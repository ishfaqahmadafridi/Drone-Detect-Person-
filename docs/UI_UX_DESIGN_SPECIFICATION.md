# Person detection dashboard specification

## Primary workflow

1. Choose a ground camera or aerial source.
2. Connect a feed or upload a test video.
3. Display a box, person ID and confidence for every detected person.
4. For Ground CCTV, freeze the current frame, select one or more suspects, then resume tracking.

## Video presentation

- Ordinary detections use green boxes and compact `Person #ID confidence` labels.
- Selected suspects use amber boxes. Other detected people remain visible.
- There are no person-to-person connector lines or group classifications.
- Motion trails and the in-video status banner are off by default.
- Maintain the source aspect ratio. The selection dialog uses the frame's actual dimensions and is independent of display zoom.
- Freeze pauses all viewers of the shared active feed and expires automatically after the configured timeout.
- Source changes clear selected IDs and invalidate previous frozen frames.

## Telemetry

Show actual person count and processing FPS. Frame interval is derived from measured FPS. Person count includes all currently detected people, even while suspects are selected. Optional intrusion counts refer only to an explicitly configured restricted zone. A person count alone does not trigger an alarm.

## Controls

Detection tuning exposes confidence. The source toolbar supports ground/aerial feeds and video upload. Uploads show progress and readable validation errors. Suspect selection is offered only in Ground CCTV mode.

## Separation of responsibilities

- Components render UI; hooks own asynchronous actions and local state.
- API modules own routes and request serialization.
- Types live in shared type files; visual tokens and limits live in constants.
- Backend services separate inference, person annotation, source playback and selection-session validation.
- Restrict geometric transforms to reusable geometry/normalization helpers.

## Performance

Ground preview uses YOLO26n at a 640-pixel inference size with ByteTrack. Large preview frames are resized with their aspect ratio preserved. Uploaded files advance using their source FPS; under CPU load, frames may be skipped to avoid slow-motion playback. Every displayed frame is analyzed, and no detections are copied onto an unrelated frame.

## Verification

Test video format/size validation, ground-only selection, all-person box visibility, token expiry, source invalidation, multiple viewers sharing one inference producer, aspect-ratio preservation and playback timing while frozen.
