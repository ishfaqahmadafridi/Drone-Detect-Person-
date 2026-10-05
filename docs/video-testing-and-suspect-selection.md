# Video testing and ground suspect selection

## Use the dashboard

1. Select the appropriate perspective: Ground CCTV for eye-level footage, Aerial Drone for drone footage.
2. Click **Upload test video**, or choose the video option in the source selector.
3. Choose MP4, AVI, MOV, MKV, WebM or M4V (up to 500 MB by default). A decodable video is required; invalid files leave the current feed unchanged.
4. Inspect the processed video, boxes, confidence and track IDs. Uploaded files use the real model pipeline; synthetic feeds use simulated targets and are not model-accuracy tests.
5. In Ground CCTV mode, click **Freeze & select suspects**. Click person boxes or their ID buttons, then **Track selected & resume**. Cancel resumes without changing selection. Selected suspects are highlighted; every other detected person remains boxed. Clear suspects restores automatic tracking.

This works on the active ground feed regardless of whether it is a camera, network channel, simulation or uploaded video. In a camera grid, activate the desired channel first. The selection dialog uses the original frame proportions, so display zoom and letterboxing do not affect selection.

The backend shares one active inference feed across clients. Freezing pauses that feed for everyone. A session expires after 120 seconds if the browser is closed or abandoned. Source/perspective changes invalidate the frozen frame and clear selected IDs. A long disappearance, source reconnect or new tracker ID can require selecting the person again. IDs are track identifiers, not persistent personal identities.

## Model and tracker behavior

- Ground: YOLO26n COCO model with Ultralytics ByteTrack (`bytetrack.yaml`, `persist=True`).
- Aerial: YOLO11n VisDrone model with BoT-SORT (`botsort.yaml`, `persist=True`).
- Unconfirmed model boxes do not receive fabricated stable track IDs.
- Pending detections are displayed as person boxes without an ID; wait for tracker
  confirmation before selecting them. They are excluded from ReID references.
- For nearby/elevated people, `AERIAL_DETECTION_PROFILE=general` selects the
  verified YOLO26n profile for the aerial channel. The default `visdrone` profile
  is intended for smaller people in high-altitude footage. Choose based on your
  footage and restart the backend after changing the setting.
- This feature supports visual model testing. Quantitative precision, recall or mAP requires labeled reference data; confidence alone is not accuracy.

## Code map

| Responsibility | Location |
| --- | --- |
| Upload size/type/decode validation and generated filenames | `backend/app/services/video_upload.py` |
| Upload endpoint and source activation | `backend/app/api/v1/endpoints/stream.py` |
| Shared MJPEG delivery and synchronous compatibility mode | `backend/app/services/streaming/frame_streamer.py` |
| Independent preview capture and latest-frame detection worker | `backend/app/services/streaming/preview_streamer.py` |
| Delayed detection boxes and existing display controls | `backend/app/services/annotation/preview_overlay.py` |
| Frame/detection snapshot, expiry, token and ID validation | `backend/app/services/streaming/selection_session.py` |
| Ground-only API operations | `backend/app/api/v1/endpoints/tracking.py` |
| Request schemas | `backend/app/schemas/selection.py` |
| Source change synchronization and tracker reset | `backend/app/services/streaming/coordinator/manager.py` |
| Upload and selection state | `frontend/src/hooks/useVideoUpload.ts`, `useSuspectSelection.ts` |
| UI controls | `frontend/src/components/tactical/VideoViewport/VideoUploadControls.tsx`, `SuspectSelection.tsx` |
| API calls | `frontend/src/services/api/streamApi.ts`, `trackingApi.ts` |
| Shared contracts and styling/limits | `frontend/src/types/videoTesting.ts`, `types/components/videoTesting.ts`, `constants/tactical.ts` |
| Regression tests | `backend/tests/test_video_testing.py` |

## API flow

- `POST /api/video/upload`: multipart `file`; validates, saves and activates the video.
- `POST /api/tracking/freeze`: ground-only; returns paired JPEG data URL, frame dimensions, detections, selection token and expiry.
- `POST /api/tracking/commit`: `{ "token": "...", "selected_ids": [7] }`; validates IDs against that frame and resumes.
- `POST /api/tracking/resume`: `{ "token": "..." }`; cancels that session without changing targets.

Backend settings `VIDEO_UPLOAD_MAX_BYTES` and `SELECTION_TIMEOUT_SECONDS` can be configured through `.env`. Keep the frontend upload limit in `VIDEO_TESTING` and the multipart proxy limit in `frontend/next.config.ts` aligned if changing the server limit.

## Verification

Run from `backend`: `python -m unittest tests.test_video_testing tests.test_tracking_modes -v`.
Run from `frontend`: `node node_modules/typescript/bin/tsc --noEmit`.

Uploaded previews follow the source video clock. By default, capture and MJPEG delivery run independently of detection, targeting `STREAM_PREVIEW_FPS=25`. Detection processes the newest available frame and replaces pending frames rather than building a backlog. Preview frames are therefore not all inferred. Large preview frames preserve aspect ratio and are capped by `PREVIEW_MAX_EDGE`.

Uploaded clips hold at their last frame (`VIDEO_END_BEHAVIOR=hold`) so CPU ReID
can finish after a short recording ends. The panel shows **Video ended**. No new
detections or crops are collected from the held image. Existing references and
tracklets remain subject to their normal expiry. Choose **Replay video** to
start the file again; replay clears that channel's tracker/session state, so
select a fresh ground reference after ground replay. The replay endpoint is
`POST /api/stream/replay?channel=ground|aerial`; non-file sources return HTTP 409.
`VIDEO_END_BEHAVIOR=loop` restores automatic looping and identity resets.
Camera feeds continue streaming normally.

Live boxes describe sampled detections and display their age. They expire after `STREAM_BOX_MAX_AGE_SECONDS=1.0`, so movement between detection updates can cause temporary box misalignment. Freeze/select uses the exact annotated detection frame and its matching IDs, rather than the newer live preview. A source replacement or video loop requires a fresh detection before selection is available.

`VIDEO_PLAYBACK_MODE=realtime` follows elapsed media time; `sequential` reads each video frame. For synchronous processing of every displayed frame, use both `STREAM_ASYNC_PREVIEW=false` and `VIDEO_PLAYBACK_MODE=sequential`, accepting slower CPU playback. Restart the backend after editing these settings.

On this machine, a five-second test of one uploaded aerial video with actual CPU detection measured approximately 1.6 FPS delivery in synchronous mode and 24 FPS in asynchronous mode. This is local delivery, not browser rendering or a guarantee for multiple feeds plus ReID. Reproduce with:

```powershell
cd backend
.venv\Scripts\python.exe scripts/benchmark_preview.py --video uploads/<filename>.mp4 --view aerial --report ../runs/system/preview-benchmark.json
```

## Suspect snapshots beneath the video

The dashboard uses one active video viewport. Split layouts and simulated inactive camera previews have been removed.

In ground mode, choose **Freeze & select suspects**, select the detected people, and confirm **Track selected & resume**. A small panel beneath the video shows a cropped snapshot of each selected person and their tracker ID. Crops come from the frozen selection frame and are stored only after the backend accepts the selection. Cancelling keeps the previous snapshots; confirming a new selection replaces them; **Clear suspects** removes them.

Snapshots are kept in the current browser component session, not in the backend evidence archive. Refreshing, reconnecting the preview, or switching sources resets them. Use **Download image** to retain a JPEG.

Implementation: `useSuspectSelection.ts` owns selection and snapshot state, `utils/suspectSnapshots.ts` handles cropping, and `SuspectSnapshots.tsx` renders the panel.
