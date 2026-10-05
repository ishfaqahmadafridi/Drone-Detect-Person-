# Detection model registry

`registry.json` records each active model's filename, architecture, source URL, checksum, input size, person class IDs and tracker. The loader checks checkpoint integrity and class labels before inference.

| Perspective | Default checkpoint | Input edge | Person class | Tracker |
| --- | --- | --- | --- | --- |
| Ground | `yolo26n.pt` (COCO) | 640 | 0 | ByteTrack |
| Aerial | `visdrone_person_best.pt` (VisDrone) | 1280 | 0 | BoT-SORT |

The ground default is the official [Ultralytics YOLO26n](https://docs.ultralytics.com/models/yolo26/) checkpoint, downloaded from the v8.4.0 assets release. It is intended for general eye-level footage and reduces CPU inference work compared with the previous 1280-pixel MOT20 model. The previous `mot20_yolo26s_pedestrian.pt` checkpoint is retained on disk but is not the active default.

Detection is restricted to the model's person class. Other COCO classes are not drawn. Every detected person gets a box; selected ground suspects use a different color. A model can still miss occluded people or produce false positives. Confidence scores are not measured accuracy. Evaluate representative labeled footage before making accuracy claims.

The aerial panel supports two explicit profiles in `backend/.env`:

```dotenv
# Small/distant people in high-altitude drone footage:
AERIAL_DETECTION_PROFILE=visdrone
# Larger/nearby people in elevated or closer footage:
# AERIAL_DETECTION_PROFILE=general
```

`general` uses the ground registry's verified YOLO26n checkpoint, class mapping,
640-pixel input and ByteTrack settings while retaining the aerial channel. The
local environment currently selects `general` because the uploaded courtyard
clip contains nearby people: on three sampled frames, it produced 9-10 person
boxes versus 0-4 from VisDrone. These counts are a diagnostic comparison, not
measured accuracy. Use VisDrone again when evaluating actual high-altitude video.
Restart the backend after changing the profile.

Detections awaiting tracker confirmation are drawn as `Person (pending ID)`.
Only confirmed IDs are selectable or used for ReID. Pending boxes do not receive
invented IDs. Telemetry includes them separately as `untracked_detections`.

Uploaded previews resize frames to a maximum edge of 1280 pixels while preserving aspect ratio. `PREVIEW_MAX_EDGE` overrides this setting. The source resolution remains unchanged on disk. By default, preview capture runs independently of detection at up to 25 FPS; detection consumes the latest frame. Live boxes show sampled detection age, while selection freezes the exact detected snapshot. Use `STREAM_ASYNC_PREVIEW=false` with `VIDEO_PLAYBACK_MODE=sequential` to process every displayed frame, accepting slower playback on CPU.

To download a missing registered checkpoint, run `python scripts/download_models.py --view ground` or `--view aerial` from `backend`.

## Person re-identification (module 3)

X-TFCLIP is an optional, separate appearance model. It uses clean person crops
from the existing ground/aerial trackers and returns up to four ranked aerial
candidates for each selected ground person. It does not replace either detector.

The pretrained weights are installed locally at **`xtfclip.pth.tar`** (434 MB).
The model adapter is `backend/app/services/reid/encoder.py`, and its pinned
upstream architecture lives in `.runtime/X-TFCLIP/`. Weights and downloaded source
are ignored by Git. Reinstall them on another machine from `backend` with:

```bash
python scripts/setup_reid.py --install-source --download-weights
```

The local `.env` and provided template enable CPU inference. Real CPU inference
has passed: about 7-8 seconds per eight-frame sequence on this machine. This
verifies execution, not identification accuracy. GPU use requires CUDA-enabled
PyTorch and `REID_DEVICE=cuda:0`; detection has its own `DETECTION_DEVICE` setting.

The official checkpoint SHA-256 is
`7371584d202e57cc3f27404f37d2a61678be071881ec4ffbe13ebff32d08bd07`.
Setup and loading verify integrity. Missing or incompatible assets produce an
explicit error rather than simulated matches.

See [the module guide](../../docs/person-reidentification.md) for the code map,
CPU/GPU setup, configuration, API and benchmark commands. GPU performance and
ground-to-aerial accuracy on your volunteers' recordings still require validation.
