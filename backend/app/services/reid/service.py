"""Session-scoped retrieval coordinator shared by the two explicit camera channels.

The video pipeline only supplies clean crops. A background thread snapshots short
tracklets and calls one inference process. Reference sequences stop changing once full,
so a later tracking error cannot silently rewrite the selected person's identity.
"""
import logging
import threading
import time
from collections import deque

from app.core.config import ReIDConfig
from app.schemas.reid import ReIDCandidate, ReIDStatus, ReIDTarget
from app.services.reid.crops import normalized_embedding, person_crop, thumbnail
from app.services.reid.tracklets import EncodingJob, Tracklet
from app.services.reid.worker import ModelWorker

logger = logging.getLogger(__name__)


class ReIDService:
    def __init__(self, settings=None, worker_factory=ModelWorker, background=True):
        self.settings = settings or ReIDConfig()
        self._worker_factory = worker_factory
        self._background = background
        self._lock = threading.RLock()
        self._wake = threading.Event()
        self._stop = threading.Event()
        self._thread = None
        self._worker = None
        self._tracks = {"ground": {}, "aerial": {}}
        self._references = {}
        self._frozen_ground = {}
        self._selected_ids = set()
        self._generation = 0
        self._inference_ms = None
        self._status = "idle" if self.settings.enabled else "disabled"
        self._message = ("Select a person in a real ground feed to begin." if self.settings.enabled
                         else "ReID is disabled. Detection and person selection remain available.")

    def select(self, selected_ids):
        """Called under the ground frame lock when operator selection changes."""
        with self._lock:
            ids = set(selected_ids)
            if ids == self._selected_ids:
                return
            self._generation += 1
            self._selected_ids = ids
            active_ids = sorted(ids)[:self.settings.max_targets]
            self._references = {pid: ref for pid, ref in self._references.items() if pid in active_ids}
            for pid in active_ids:
                if pid not in self._references:
                    ref = Tracklet(pid, deque(maxlen=self.settings.sequence_length))
                    self._references[pid] = ref
                    self._collect_reference(ref, self._frozen_ground.get(pid) or self._tracks["ground"].get(pid))
            self._frozen_ground.clear()
            self._wake.set()

    def freeze_ground(self):
        """Retain sampled crops while the operator considers a frozen frame."""
        with self._lock:
            self._frozen_ground = dict(self._tracks["ground"])

    def resume_ground(self):
        with self._lock:
            self._frozen_ground.clear()

    def _collect_reference(self, ref, track):
        if track is None or len(ref.frames) >= self.settings.sequence_length:
            return
        if ref.origin_key and ref.origin_key != track.key:
            return  # Never borrow a reused tracker ID after a gap.
        ref.origin_key = track.key
        ref.frames = deque(track.frames, maxlen=self.settings.sequence_length)
        ref.image, ref.frame_idx, ref.seen_at = track.image, track.frame_idx, track.seen_at
        ref.last_seen, ref.version = track.last_seen, track.version

    def reset_channel(self, channel):
        with self._lock:
            self._generation += 1
            self._tracks[channel].clear()
            if channel == "ground":
                self._references.clear()
                self._frozen_ground.clear()
                self._selected_ids.clear()
            self._wake.set()

    def _expire(self, now):
        for tracks in self._tracks.values():
            for pid in list(tracks):
                if now - tracks[pid].last_seen > self.settings.track_ttl_seconds:
                    del tracks[pid]

    def observe(self, channel, frame, detections, frame_idx, source_type, selected_ids):
        """Cheap sampled work only; synthetic fallback never generates identity matches."""
        if not self.settings.enabled or self._stop.is_set():
            return
        with self._lock:
            now = time.monotonic()
            self._expire(now)
            if source_type == "synthetic":
                if self._tracks[channel] or (channel == "ground" and self._references):
                    self.reset_channel(channel)
                return
            tracks = self._tracks[channel]
            # Existing tracks and selected targets have priority when a scene is crowded.
            ordered = sorted(detections, key=lambda d: (d.get("id") not in self._selected_ids,
                                                       d.get("id") not in tracks))
            for detection in ordered:
                pid = detection.get("id")
                if not isinstance(pid, int) or pid < 0:
                    continue
                track = tracks.get(pid)
                if track is None:
                    if len(tracks) >= self.settings.max_tracks:
                        continue
                    track = Tracklet(pid, deque(maxlen=self.settings.sequence_length))
                track.last_seen = now
                if now - track.last_sample < self.settings.sample_seconds:
                    continue
                crop = person_crop(frame, detection, self.settings)
                if crop is None:
                    continue
                tracks[pid] = track
                track.frames.append(crop)
                track.last_sample, track.seen_at = now, time.time()
                track.frame_idx = frame_idx
                track.image = thumbnail(crop, self.settings.jpeg_quality)
                track.version += 1
            if channel == "ground":
                self.select(selected_ids)
                for pid, ref in self._references.items():
                    self._collect_reference(ref, tracks.get(pid))
            if self._background and self._thread is None:
                self._thread = threading.Thread(target=self._run, daemon=True, name="reid-scheduler")
                self._thread.start()
            self._wake.set()

    def _jobs(self, now):
        jobs = []
        # Encode the ground query once. Aerial embeddings are refreshed fairly.
        sources = [("ground", ref) for ref in self._references.values() if ref.embedding is None]
        if self._references:
            sources += [("aerial", track) for track in sorted(
                self._tracks["aerial"].values(), key=lambda item: item.last_encoded)]
        for channel, track in sources:
            if len(track.frames) < self.settings.sequence_length:
                continue
            if track.version == track.encoded_version or now - track.last_encoded < self.settings.update_seconds:
                continue
            jobs.append(EncodingJob(channel, track.track_id, track.key, track.version, tuple(track.frames),
                                    track.image, track.frame_idx, track.last_sample, track.seen_at))
            if len(jobs) >= self.settings.batch_size:
                break
        return self._generation, jobs

    def process_once(self):
        """One bounded inference batch; also used by deterministic CPU-only contract tests."""
        with self._lock:
            self._expire(time.monotonic())
            if self._stop.is_set() or self._status in ("disabled", "error"):
                return
            generation, jobs = self._jobs(time.monotonic())
            if not jobs:
                return
            if self._worker is None:
                self._status, self._message = "loading", f"Loading X-TFCLIP on {self.settings.device}..."
        try:
            if self._worker is None:
                self._worker = self._worker_factory(self.settings)
                self._worker.start()
            started = time.monotonic()
            output = self._worker.encode([job.frames for job in jobs], [job.channel for job in jobs])
            if len(output) != len(jobs):
                raise ValueError("Model returned an unexpected embedding batch size")
            embeddings = [normalized_embedding(vector) for vector in output]
            if len({vector.shape for vector in embeddings}) != 1:
                raise ValueError("Model returned inconsistent embedding dimensions")
            with self._lock:
                self._status, self._message = "ready", "Appearance candidates require operator review. Scores are not probabilities."
                self._inference_ms = round((time.monotonic() - started) * 1000, 1)
                if generation != self._generation:
                    return  # A source/selection changed while inference was running.
                for job, embedding in zip(jobs, embeddings):
                    tracks = self._references if job.channel == "ground" else self._tracks["aerial"]
                    track = tracks.get(job.track_id)
                    if track is None or track.key != job.key:
                        continue
                    track.embedding, track.encoded_version = embedding, job.version
                    track.last_encoded = time.monotonic()
                    track.embedding_time, track.embedding_seen_at = job.last_seen, job.seen_at
                    track.embedding_image, track.embedding_frame_idx = job.image, job.frame_idx
        except Exception as exc:
            if self._stop.is_set():
                return
            logger.exception("ReID inference failed; detection continues")
            if self._worker:
                self._worker.close()
                self._worker = None
            with self._lock:
                self._status, self._message = "error", str(exc)

    def _run(self):
        try:
            while not self._stop.is_set():
                self._wake.wait(timeout=self.settings.update_seconds)
                self._wake.clear()
                if not self._stop.is_set():
                    self.process_once()
        finally:
            if self._worker:
                self._worker.close()
                self._worker = None

    def retry(self):
        with self._lock:
            if self.settings.enabled and self._status == "error":
                self._status, self._message = "idle", "Retry queued; waiting for complete person sequences."
                self._wake.set()
        return self.snapshot()

    def snapshot(self):
        with self._lock:
            now = time.monotonic()
            self._expire(now)
            gallery = [track for track in self._tracks["aerial"].values()
                       if track.embedding is not None and now - track.embedding_time <= self.settings.track_ttl_seconds]
            targets = []
            for ref in self._references.values():
                candidates = []
                state = "collecting" if len(ref.frames) < self.settings.sequence_length else "searching"
                if ref.embedding is not None and self._status == "ready":
                    scores = [(float(ref.embedding @ track.embedding), track) for track in gallery
                              if ref.embedding.shape == track.embedding.shape]
                    scores.sort(key=lambda pair: (-pair[0], pair[1].track_id))
                    for score, track in scores:
                        score = max(-1.0, min(1.0, score))
                        if score < self.settings.min_similarity:
                            continue
                        candidates.append(ReIDCandidate(
                            track_key=track.key, track_id=track.track_id, rank=len(candidates) + 1,
                            similarity=round(score, 4), image=track.embedding_image,
                            frame_idx=track.embedding_frame_idx, seen_at=track.embedding_seen_at))
                        if len(candidates) == self.settings.top_k:
                            break
                    state = "candidates" if candidates else ("no_match" if gallery else "searching")
                targets.append(ReIDTarget(target_key=ref.key, ground_track_id=ref.track_id, image=ref.image,
                                          samples=len(ref.frames), required_samples=self.settings.sequence_length,
                                          state=state, candidates=candidates))
            message = self._message
            reported_status = self._status
            if not targets and self._status not in {"error", "disabled", "loading"}:
                reported_status = "idle"
                message = "Select a person in the ground panel to create a matching reference."
            if len(self._selected_ids) > self.settings.max_targets:
                message += f" ReID is limited to the first {self.settings.max_targets} selected ground IDs."
            return ReIDStatus(status=reported_status, message=message,
                              threshold_configured=self.settings.min_similarity > -1,
                              targets=targets, gallery_tracks=len(self._tracks["aerial"]),
                              last_inference_ms=self._inference_ms, generation=self._generation)

    def close(self):
        self._stop.set()
        self._wake.set()
        # Terminate an in-flight inference process before joining the scheduler.
        if self._worker:
            self._worker.close()
        if self._thread:
            self._thread.join(timeout=3)
        with self._lock:
            for tracks in self._tracks.values():
                tracks.clear()
            self._references.clear()
            self._frozen_ground.clear()
            self._selected_ids.clear()


reid_service = ReIDService()
