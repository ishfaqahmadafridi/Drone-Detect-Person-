# BIRDS EYE detection dashboard

A local research interface for the **Ground-to-Aerial Person Re-identification** FYP. Ground and aerial person detection are connected to a local Python API. Generative AI, Re-ID, MQTT and drone control remain future work.

## Run

From the repository root on Windows:

```powershell
cd 'D:\vs code\fyp\Drone-Detect-Person-'
# First-time setup; skip when already installed:
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\setup-models.ps1
.\.venv\Scripts\python.exe app.py
```

Open **http://localhost:8000**. This one process serves both the frontend and inference API; Node.js is not required for normal use. Stop it with Ctrl+C. `--port` changes the port; `--device` defaults to `cpu`. The setup script installs CPU PyTorch, so a CUDA device requires a separate compatible PyTorch installation. The server binds only to this computer.

For frontend development, Node.js 18+ can also run `npm start` inside `frontend/`. This serves port 4173 and proxies `/api/*` to the Python server on port 8000. Both processes must run for detection in this mode. `PORT` and `INFERENCE_PORT` override these defaults. No npm dependencies are needed.

## Use the models

1. Open **Manage sources** and choose a ground video and an aerial video, or a browser webcam.
2. On each feed, choose **Run detector**. The first frame takes longer while the weights load.
3. Start at resolution **640** for CPU use. **960** and **1280** provide more input detail at higher processing cost, particularly relevant for small people in aerial footage.
4. Select a person box or a person chip to capture the reference. **Pause previews** holds the displayed result for easier selection. The crop tool supports manual selection.
5. Save the original crop or prepare/export the reference package for the future generation and matching stage.

| View | Checkpoint | Local file |
| --- | --- | --- |
| Ground | [MOT20 YOLO26s pedestrian](https://huggingface.co/Halftom/mot20-yolo26s-pedestrian) | `models/ground_mot20_yolo26s.pt` |
| Aerial | [VisDrone YOLO11n person](https://github.com/pratap424/visdrone_mot) | `models/aerial_visdrone_yolo11n.pt` |

Both selected checkpoints use class **0** for people, with a default confidence threshold of **0.25**. Source URLs, file hashes and profile settings are recorded in `models/registry.json`. The downloader verifies SHA-256 hashes; missing or invalid weights cause an explicit error. The aerial integration uses the publisher's checkpoint, not its complete motion-compensated tracking pipeline.

## Verification

```powershell
cd frontend
npm run check
cd ..
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
.\.venv\Scripts\python.exe scripts\verify_models.py
```

The checks cover JavaScript syntax/imports, static serving, API input validation, stale response rejection, and box alignment to the processed frame. The final script loads the actual checkpoints and writes `runs/model_verification.json`. It uses a packaged ground street image when available; it is a loading/inference smoke test, not an aerial accuracy evaluation.

## Available interactions

- Two animated, clearly labelled simulated camera views with scripted person boxes.
- An initial, explicitly simulated automatic selection of one ground reference.
- Select a box or a keyboard-accessible person chip to change the reference.
- Manage sources: choose local video files, use a browser webcam, or restore demo scenes.
- Real sources remove the demo boxes. **Run detector** returns actual model predictions with confidence and processing time.
- Freeze a frame and drag a rectangle using the crop button. Escape cancels crop selection.
- Pause/resume previews and expand a camera view.
- Save the original reference crop as PNG.
- Prepare and export a reference JSON package containing the image, view, source name, timestamp, video position (when applicable), normalized crop, and explicit model status.
- Review and export session activity.
- Inspect future pipeline stages and disconnected drone telemetry.

Video files stay in the browser. When detection runs, sampled frames are sent to the server on this computer and processed in memory. The backend does not save these frames. Webcam permission is requested only when the user chooses that input. Changing a source stops its camera tracks, aborts pending requests, and releases its media URL. Session state and crops live in memory; refreshing resets the session. Export before refreshing if needed.

Inference uses sampled frames, not every frame of the video. While the next request runs off screen, each feed keeps its last completed image, boxes, count and reference crop source visible. The next image and its predictions replace them together, without clearing the overlays between requests. Initial playback continues while the first result loads. Pause and crop selection hold arriving results until resumed. Video frames are skipped between requests, so detection playback advances at the model's processing speed. The two feeds are not synchronized acquisitions. CPU inference is serialized across feeds. Neither real-time throughput nor aerial accuracy has been established on your footage.

Browser decoding depends on the codec; MP4/H.264 and WebM are useful starting formats. Browsers do not directly play RTSP feeds. A future backend must convert them to a browser-compatible transport. Webcam access requires localhost or HTTPS.

## Relationship to the approved scope

The supplied proposal is titled **BIRDS EYE (Ground to Aerial Person Re-identification)**. It describes one CCTV camera, one drone, and one actively followed person. Multiple people may appear as detection candidates. The primary direction is ground to aerial; this prototype also permits an aerial reference for the alternate-view research discussed by the user.

The proposal's website and security visualization modules call for feeds, tracking overlays, match confidence, mission status, and drone telemetry. The generative preview is a UI extension requested in conversation. AE-GAN/pose-aware augmentation is discussed in the proposal, but a specific working generator has not been supplied. Generated imagery must remain distinct from original reference evidence. Similarity scores must come from an actual matching model.

The proposal names React for the eventual drone interface and Streamlit/Dash as visualization options. This first frontend prototype uses dependency-free HTML, CSS, and JavaScript, with modular components. It is not yet a React implementation of the final stack.

## Structure

```text
src/
  components/
    01-atoms/       icons, DOM and export helpers
    02-molecules/   summary cards
    03-organisms/   playback, inference overlays, crop selection
    04-templates/   dashboard layout
    05-pages/       navigation and workflow state
  demo/            procedural sample scenes (not real footage)
  inference-client.js  API health and frame requests
  state.js         browser session state and events
  main.js          entry point
```

## API and next integration boundary

`app.py` serves `GET /api/health` and `POST /api/detect/{ground|aerial}`. Detection requests send raw JPEG/PNG bytes with the matching Content-Type and query parameters `frame_id`, `imgsz` (640/960/1280), and `confidence` (0.05–0.95). Limits: 8 MB per body and 16 megapixels per image. Browser frames are scaled to at most 1920 pixels on the longest side before encoding.

Responses include view/frame ID, processed image dimensions, model provenance, inference time, and normalized `[x, y, width, height]` boxes. The client rejects mismatched frames and discards responses after a source change. Detection IDs are specific to a frame; `tracking` and `identity_matching` are explicitly false. This frontend currently runs detection only; the separate `detect.py` CLI retains local tracking and intrusion logic.

The crop exporter stores normalized coordinates, view, capture time, video position (for files), frame ID, detector name, confidence, and ID kind. Detection crops come from the processed source frame. A later Re-ID service should return ranked candidates and a separate confirmed/uncertain state. Detection confidence and camera-local IDs do not establish cross-camera identity or suspicion.

Current assets needed: representative ground/aerial clips, labelled detection frames, paired identity-labelled evaluation data, and eventually the view-generation model, Re-ID model, and drone hardware. The detectors are installed; domain evaluation and the later research stages remain.
