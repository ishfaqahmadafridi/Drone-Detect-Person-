// Session-local observations, never identity matches. All coordinates use the source image.
export class CandidatePool {
  constructor({ maxTracks = 60, maxSamples = 3, maxPoints = 120 } = {}) {
    this.maxTracks = maxTracks; this.maxSamples = maxSamples; this.maxPoints = maxPoints;
    this.clear();
  }

  clear() { this.tracks = new Map(); this.epoch = null; this.selectedId = null; this.evicted = 0; }

  update(result, makeCrop) {
    if (!result.tracking) return;
    if (this.epoch !== result.tracking_epoch) { this.clear(); this.epoch = result.tracking_epoch; }
    for (const track of this.tracks.values()) track.active = false;
    for (const detection of result.detections) {
      if (detection.track_id == null) continue;
      let track = this.tracks.get(detection.id);
      if (!track) {
        track = { id: detection.id, trackId: detection.track_id, firstSeen: result.source_time,
          samples: [], trajectory: [], observations: 0, model: result.model };
        this.tracks.set(track.id, track);
      }
      if (track.lastFrameId === result.frame_id) { track.active = true; continue; }
      track.active = true; track.lastSeen = result.source_time; track.lastFrameId = result.frame_id;
      track.confidence = detection.confidence; track.observations++;
      const [x, y, w, h] = detection.bbox_normalized;
      track.trajectory.push({ x: x + w / 2, y: y + h, time: result.source_time, frameId: result.frame_id });
      if (track.trajectory.length > this.maxPoints) track.trajectory.shift();
      const lastSample = track.samples.at(-1);
      if (!lastSample || result.source_time - lastSample.time >= 1) {
        const crop = makeCrop(detection.bbox_normalized);
        if (crop) {
          track.samples.push({ ...crop, time: result.source_time, frameId: result.frame_id,
            confidence: detection.confidence, bboxNormalized: [...detection.bbox_normalized] });
          if (track.samples.length > this.maxSamples) track.samples.shift();
        }
      }
    }
    while (this.tracks.size > this.maxTracks) {
      const choices = [...this.tracks.values()].filter(track => track.id !== this.selectedId);
      const oldest = choices.find(track => !track.active) || choices[0];
      this.tracks.delete(oldest.id); this.evicted++;
    }
  }

  export(sourceName) {
    return { schemaVersion: 1, sourceView: 'aerial', sourceName, trackingEpoch: this.epoch,
      tracker: 'ByteTrack', identityMatching: false, generation: 'not_connected',
      selectedCandidate: this.selectedId, evictedTracks: this.evicted,
      limits: { tracks: this.maxTracks, cropsPerTrack: this.maxSamples, trajectoryPoints: this.maxPoints },
      tracks: [...this.tracks.values()] };
  }
}
