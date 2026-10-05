"""Synchronize a frozen frame, its tracked detections, and operator selection.

The shared frame lock also protects source changes and inference. Sessions expire
automatically so closing a browser cannot leave the shared feed paused forever.
"""
import base64
import copy
import threading
import time
from uuid import uuid4
from fastapi import HTTPException
from app.core.config import SELECTION_TIMEOUT_SECONDS


class SelectionSession:
    def __init__(self):
        self.lock = threading.RLock()
        self.latest = None
        self.token = None
        self.deadline = 0.0
        self.on_commit = None
        self.on_freeze = None
        self.on_resume = None
        self.frame_is_current = None

    @property
    def paused(self):
        if self.token and time.monotonic() >= self.deadline:
            self.token = None
            if self.on_resume is not None:
                self.on_resume()
        return self.token is not None

    def publish(self, jpeg, result):
        height, width = result.annotated_frame.shape[:2]
        self.latest = {
            "jpeg": jpeg, "width": width, "height": height,
            "detections": copy.deepcopy(result.telemetry_payload.get("detections", [])),
            "view_mode": result.telemetry_payload.get("view_mode"),
            "source_type": result.telemetry_payload.get("source_type"),
        }

    def invalidate(self):
        self.token = None
        self.latest = None
        if self.on_resume is not None:
            self.on_resume()

    def freeze(self, config):
        with self.lock:
            if config.view_mode != "ground":
                raise HTTPException(409, "Suspect selection is available only in Ground CCTV mode.")
            if self.paused:
                raise HTTPException(409, "Another selection session is already open.")
            if self.frame_is_current is not None and not self.frame_is_current():
                raise HTTPException(409, "Wait for detection on the current camera source before selecting suspects.")
            if not self.latest or self.latest["view_mode"] != "ground":
                raise HTTPException(409, "Wait for a ground-camera frame before selecting suspects.")
            self.token = uuid4().hex
            self.deadline = time.monotonic() + SELECTION_TIMEOUT_SECONDS
            if self.on_freeze is not None:
                self.on_freeze()
            snapshot = {key: value for key, value in self.latest.items() if key != "jpeg"}
            return {
                **snapshot, "token": self.token,
                "image": "data:image/jpeg;base64," + base64.b64encode(self.latest["jpeg"]).decode(),
                "selected_ids": list(config.selected_target_ids),
                "expires_in": SELECTION_TIMEOUT_SECONDS,
            }

    def validate(self, token):
        if not self.paused or token != self.token:
            raise HTTPException(409, "Selection expired or the source changed. Freeze a new frame.")

    def commit(self, token, selected_ids, config, telemetry):
        with self.lock:
            self.validate(token)
            available = {d["id"] for d in self.latest["detections"]}
            if not set(selected_ids) <= available:
                raise HTTPException(422, "Select only people detected in the frozen frame.")
            config.selected_target_ids = sorted(set(selected_ids))
            config.tracking_mode = "manual" if selected_ids else "auto"
            telemetry.update(tracking_mode=config.tracking_mode, selected_target_ids=config.selected_target_ids)
            if self.on_commit is not None:
                self.on_commit(config.selected_target_ids)
            if self.on_resume is not None:
                self.on_resume()
            self.token = None
            return {"status": "ok", "mode": config.tracking_mode, "selected_ids": config.selected_target_ids}

    def cancel(self, token):
        with self.lock:
            # A stale browser must not cancel another operator's session.
            if token == self.token:
                self.token = None
                if self.on_resume is not None:
                    self.on_resume()
            return {"status": "ok"}
