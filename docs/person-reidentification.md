# Module 3: ground-to-aerial person re-identification

Select a person in the ground feed and retrieve up to four similar aerial tracks
using pretrained X-TFCLIP. No training is needed to run inference. Use your
consenting volunteers' paired recordings for the FYP demonstration.

## How it works

1. Existing YOLO detectors and trackers locate people in both feeds.
2. ReID samples clean person crops before annotation and collects eight per track.
3. Ground freeze/select/confirm creates a fixed reference for each selected person.
4. One separate CPU or CUDA process extracts appearance features.
5. Cosine similarity ranks distinct aerial tracks against each reference.
6. The panel displays up to four candidates with crops, IDs, scores and timestamps.

Buffers are bounded. Background inference uses current tracklets rather than an
unbounded frame queue. Failures appear in the panel with a retry action.

## File map

| File | Responsibility |
| --- | --- |
| `backend/models/xtfclip.pth.tar` | Actual pretrained weights, about 434 MB; ignored by Git |
| `.runtime/X-TFCLIP/` | Pinned official model source; ignored by Git |
| `backend/app/services/reid/encoder.py` | Model loading, CPU/CUDA placement and feature extraction |
| `backend/app/services/reid/assets.py` | Source, tokenizer and checkpoint installation |
| `backend/app/services/reid/worker.py` | Isolated inference process and timeouts |
| `backend/app/services/reid/service.py` | Sampling, references, scheduling, expiry and ranking |
| `backend/app/services/reid/crops.py` | Crop validation, resizing, RGB conversion and thumbnails |
| `backend/app/services/reid/tracklets.py` | Internal tracklet and job records |
| `backend/app/core/config.py` | Environment settings in ReIDConfig |
| `backend/app/core/constants.py` | Source revision, artifact hashes and preprocessing |
| `backend/app/schemas/reid.py` | API response schemas |
| `backend/app/api/v1/endpoints/reid.py` | Status and retry routes |
| `backend/app/services/streaming/channels.py` | Feed integration |
| `frontend/src/hooks/useReID.ts` | Polling and retry |
| `frontend/src/components/tactical/ReIDPanel/` | Query and candidate display |
| `backend/scripts/setup_reid.py` | Asset installation and readiness checks |
| `backend/scripts/smoke_reid.py` | Real-model test using artificial inputs |
| `backend/scripts/benchmark_reid.py` | Retrieval evaluation on prepared person crops |

## Run on this computer

The local backend/.venv is prepared and backend/.env enables CPU detection and
ReID. The official weights and tokenizer are downloaded and verified. From the
project root, use the existing launcher:

```powershell
.\start_system.ps1
```

Open http://127.0.0.1:3000, open both camera panels and upload the paired recordings.
Allow tracks to collect samples, then freeze/select/confirm a ground person.
Keep subjects visible long enough to collect eight samples. If an incomplete
reference loses its original track, clear and reselect it.

The model loads lazily when complete sequences need encoding. To check it separately:

```powershell
cd backend
.venv\Scripts\python.exe scripts/setup_reid.py
.venv\Scripts\python.exe scripts/smoke_reid.py --device cpu --report ../runs/reid/cpu-smoke.json
```

Measured locally: Python 3.13.14, PyTorch 2.13.0+cpu, torchvision 0.29.0+cpu;
13.2 seconds to load and 7.3-7.6 seconds per eight-frame sequence with flip
augmentation and two CPU threads. Output was finite, normalized and
2048-dimensional. This used real trained weights with artificial inputs; it
was **not an accuracy test or a simultaneous detection benchmark**. Several
people require multiple jobs, so CPU candidate updates are delayed.

Short uploaded recordings hold at the end by default. This lets pending CPU
matching finish instead of losing its reference/gallery on every automatic loop.
The panel displays **Video ended** and provides **Replay video**. Replay creates
a new tracker session; select the ground reference again after ground replay.
Held images do not create new crop observations. Normal buffer expiry still
applies, so select soon after upload or replay if a completed clip has expired.
Set VIDEO_END_BEHAVIOR=loop only when automatic resets are desired.

Preview playback now runs independently of detection with a latest-frame mailbox.
Defaults are STREAM_ASYNC_PREVIEW=true, STREAM_PREVIEW_FPS=25 and
VIDEO_PLAYBACK_MODE=realtime. Detection and ReID sample frames, so the preview
does not represent exhaustive frame-by-frame evaluation. Live boxes show the age
of sampled detections; frozen selection uses the exact detected snapshot.
See [video testing](video-testing-and-suspect-selection.md) for settings and the
preview benchmark. For slower exhaustive displayed-frame processing, disable
asynchronous preview and choose sequential playback.

## Reproduce setup

Use Python 3.13 and Git. From backend, create and activate an environment:

```bash
python -m venv .venv
# Windows: .venv\Scripts\Activate.ps1
# Linux: source .venv/bin/activate
python -m pip install -r requirements.txt -r requirements-reid-runtime.txt
python scripts/setup_reid.py --install-source --download-weights
```

Choose CPU or CUDA PyTorch wheels appropriate to the machine. The runtime file
pins the locally tested versions; it does not install an NVIDIA driver or ensure
CUDA support. The local environment uses existing system packages, so a clean
installation still needs validation on the destination machine.

Copy .env.example to .env only when no .env exists. Otherwise edit your existing
settings. Setup downloads assets, checks the pinned revision, SHA-256 hashes,
dependencies and selected device. Live inference does not download models.

## Switch to GPU

Application code and weights stay the same. Install an NVIDIA driver and a
compatible CUDA-enabled PyTorch/torchvision pair on the GPU machine, reproduce
the setup above, and change backend/.env:

```dotenv
REID_ENABLED=true
REID_DEVICE=cuda:0
DETECTION_DEVICE=cuda:0
REID_BATCH_SIZE=1
```

Then run:

```bash
python -c "import torch; print(torch.__version__, torch.cuda.is_available())"
python scripts/setup_reid.py
python scripts/smoke_reid.py --device cuda:0 --report ../runs/reid/gpu-smoke.json
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --workers 1
```

Start with batch size 1; increase only after measuring GPU memory and combined
throughput. GPU operation has not been tested on this CPU-only computer. Missing
CUDA produces an explicit error. Restart after editing .env; retry does not reload
it. Use one Uvicorn worker because camera and selection state are held in memory.

For a cloud backend, a private SSH tunnel from local port 8000 to server port 8000
works with the frontend proxy. Uploaded videos go to the backend. The webcam
option opens a camera attached to the backend machine. A laptop camera needs a
network stream/relay reachable by the remote server; browser webcam forwarding
is not included.

## Camera settings and provenance

The [official dataset](https://github.com/agvpreid25/AG-VPReID) identifies C0/C1
as CCTV, C2/C3 as wearable and C4/C5 as UAV. Defaults use C0 for ground and C4 for
aerial. These are representative training-domain embeddings, not your actual
camera identities or person track IDs:

```dotenv
REID_CAMERA_MODE=mapped
REID_GROUND_CAMERA_ID=0
REID_AERIAL_CAMERA_ID=4
```

REID_CAMERA_MODE=neutral removes the camera offset while retaining video
embeddings. This optional adaptation should be compared against mapped mode on
held-out footage; it does not reproduce the authors' evaluation.

- [Official model](https://github.com/BiDAlab/X-TFCLIP), revision
  cb7e0c97c3c76714fe1ce662ca9104c5318a59b2.
- Official checkpoint checkpoint_ep.pth.tar is installed as xtfclip.pth.tar:
  434122970 bytes, SHA-256
  7371584d202e57cc3f27404f37d2a61678be071881ec4ffbe13ebff32d08bd07.
- Configuration: configs/vit_clipreid_288x144.yml; eight RGB 288x144 crops.
- Preprocessing follows the evaluation loader: PIL bilinear resize,
  mean [0.485, 0.456, 0.406], standard deviation [0.229, 0.224, 0.225].
- The adapter constructs the exact visual architecture without a redundant base
  CLIP download. Full trained state loads with strict=True and weights_only=True.
- Pre-neck features and optional original/flipped averaging are used. Published
  demographic-label distance adjustment is not used. Challenge scores do not
  measure this application's accuracy.

## Validate your recordings

Prepare at least eight person crops per directory, sorted by frame number:

```text
crops/ground/volunteer_a/000001.jpg ...
crops/aerial/track_a/000001.jpg ...
crops/aerial/track_b/000001.jpg ...
```

From backend in its Python environment:

```bash
python scripts/benchmark_reid.py --query-dir crops/ground/volunteer_a --gallery-dir crops/aerial --expected-track track_a
```

Repeat across volunteers, angles, and cases where the person is absent. Measure
top-four recall on held-out footage before claiming accuracy. Actual identity
accuracy remains unverified until those recordings are available.

Cosine scores are similarities, not probabilities or identity confirmation.
REID_MIN_SIMILARITY=-1 ranks all candidates; all four can be wrong. A threshold
can produce no_match but must be calibrated on your footage.

## Lifecycle and API

- Complete references remain fixed until deselection or ground-source reset.
- Tracklets and appearance evidence expire after REID_TRACK_TTL_SECONDS (120 by
  default). Candidate timestamps describe encoded observations, which can be old.
- Source replacement, simulation fallback and video loops clear channel tracks.
  Ground resets also clear references. Stale in-flight results are discarded.
- Crops and embeddings stay in bounded RAM: defaults are 48 tracks per channel
  and four targets. No persistent identity database is created.
- Candidate retrieval does not reconstruct unseen movement or implement a
  persistent, confirmed journey history across cameras.

| Route | Purpose |
| --- | --- |
| GET /api/reid/status | Model state, reference progress and candidates |
| POST /api/reid/retry | Retry model failure using current configuration |
| /api/tracking/*?channel=ground | Existing ground selection controls |

Contract tests use fake encoders for scheduling, lifecycle and API checks.
The smoke script separately checks actual pretrained inference.
