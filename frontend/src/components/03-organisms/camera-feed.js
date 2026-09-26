import { icon } from '../01-atoms/icons.js';
import { element, notify } from '../01-atoms/dom.js';
import { DemoScene, DEMO_SIZE } from '../../demo/scene.js';
import { state } from '../../state.js';
import { detectFrame } from '../../inference-client.js';

export class CameraFeed {
  constructor(view, { onSelect, onSourceChange, onManage, onDetections = () => {} }) {
    this.view = view;
    this.onSelect = onSelect;
    this.onSourceChange = onSourceChange;
    this.onDetections = onDetections;
    this.inferenceEnabled = false;
    this.detectionEpoch = 0;
    this.processingFrameId = 0;
    this.nextInferenceAt = 0;
    this.inferenceCanvas = document.createElement('canvas');
    this.captureCanvas = document.createElement('canvas');
    this.pendingResult = null;
    this.paused = state.paused;
    this.scene = new DemoScene(view);
    this.mode = 'demo';
    this.requestId = 0;
    this.detections = [];
    this.video = document.createElement('video');
    this.video.muted = true;
    this.video.playsInline = true;
    this.video.loop = true;
    this.video.addEventListener('error', () => {
      if (this.mode === 'file') {
        this.stopInference(); this.cancelCrop();
        this.sourceError = true;
        this.setLabel('.feed-status', 'VIDEO UNAVAILABLE');
        this.setLabel('.model-state', 'Video could not be decoded');
        this.draw(0);
        notify('This video could not be decoded. Try an MP4 with H.264 video or a WebM file.');
      }
    });
    const ground = view === 'ground';
    this.element = element(`<article class="camera-card panel" aria-label="${view} camera">
      <header class="camera-header"><span class="camera-icon ${ground ? '' : 'blue'}">${icon(ground ? 'camera' : 'drone')}</span><div><h3>${ground ? 'Ground camera' : 'Aerial camera'}</h3><p>${ground ? 'CAM 01 · Campus walkway' : 'CAM 02 · Courtyard overview'}</p></div><button class="icon-button manage" aria-label="Manage ${view} camera source" title="Manage source">${icon('settings')}</button></header>
      <div class="feed-stage"><canvas width="${DEMO_SIZE.width}" height="${DEMO_SIZE.height}" aria-label="Simulated ${view} camera scene"></canvas><div class="boxes"></div><div class="feed-top"><span class="feed-badge"><i></i><span class="feed-status">DEMO FEED</span></span><span class="feed-resolution">960 × 600</span></div><span class="feed-caption">SIMULATED SCENE · NO MODEL INFERENCE</span><div class="crop-rectangle" hidden></div><div class="crop-instruction" hidden>Drag a box around one person · Esc to cancel</div></div>
      <div class="feed-actions"><span class="feed-count">${ground ? '4' : '3'} simulated tracks</span><div><button class="icon-button crop-button" aria-label="Capture reference from ${view} camera" title="Draw a reference crop">${icon('scan')}</button><button class="icon-button fullscreen" aria-label="Expand ${view} camera" title="Expand view">${icon('expand')}</button></div></div>
      <div class="track-list" aria-label="Select a ${view} demo person"></div>
      <div class="detector-controls"><button class="button secondary run-detector" disabled title="Choose a video or webcam first">${icon('scan')}Run detector</button><label>Resolution<select class="inference-size" aria-label="${view} inference resolution"><option value="640">640 · Faster</option><option value="960">960 · Balanced</option><option value="1280">1280 · More detail</option></select></label></div>
      <footer class="camera-footer"><span class="status-dot"></span><span class="model-state">Scripted detections</span><span class="source-type">DEMO</span></footer>
    </article>`);
    this.canvas = this.element.querySelector('canvas');
    this.stage = this.element.querySelector('.feed-stage');
    this.boxLayer = this.element.querySelector('.boxes');
    this.cropRect = this.element.querySelector('.crop-rectangle');
    this.element.querySelector('.manage').onclick = onManage;
    this.element.querySelector('.fullscreen').onclick = async () => {
      try { if (document.fullscreenElement) await document.exitFullscreen(); else await this.stage.requestFullscreen(); }
      catch { notify('Fullscreen is unavailable in this browser.'); }
    };
    this.element.querySelector('.crop-button').onclick = () => this.beginCrop();
    this.element.querySelector('.run-detector').onclick = () => this.toggleInference();
    this.element.querySelector('.inference-size').onchange = () => {
      if (this.inferenceEnabled) { this.stopInference(); this.toggleInference(); }
    };
    this.stage.addEventListener('pointerdown', event => this.cropStart(event));
    this.stage.addEventListener('pointermove', event => this.cropMove(event));
    this.stage.addEventListener('pointerup', event => this.cropEnd(event));
    this.stage.addEventListener('pointercancel', () => this.cancelCrop());
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && this.cropping) this.cancelCrop(); });
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file'; this.fileInput.accept = 'video/*';
    this.fileInput.addEventListener('change', () => {
      const file = this.fileInput.files[0];
      if (file) this.loadFile(file);
      this.fileInput.value = '';
    });
    this.draw(0);
  }

  setLabel(selector, text) { this.element.querySelector(selector).textContent = text; }

  draw(time) {
    if (this.cropping) return;
    if (this.inferenceEnabled && this.mode !== 'demo' && !this.sourceError) {
      this.presentPendingResult();
      if (!this.paused && !this.inFlight && !this.pendingResult && performance.now() >= this.nextInferenceAt && this.video.readyState >= 2) this.inferCurrentFrame();
      // Playback can continue during initial model loading, before any boxes exist.
      if (!this.resultReady && !this.paused && this.video.readyState >= 2) this.drawVideo(this.video, this.video.videoWidth, this.video.videoHeight);
      return;
    }
    const context = this.canvas.getContext('2d');
    if (this.mode === 'demo') {
      this.detections = this.scene.draw(this.canvas, time);
      this.videoRect = { x: 0, y: 0, width: 960, height: 600 };
    } else if (this.video.readyState >= 2 && !this.sourceError) {
      this.drawVideo(this.video, this.video.videoWidth, this.video.videoHeight);
    } else {
      context.fillStyle = '#0d1622'; context.fillRect(0, 0, 960, 600);
      context.fillStyle = '#c7d7e6'; context.font = '24px sans-serif'; context.textAlign = 'center';
      context.fillText(this.sourceError ? 'Video unavailable' : 'Loading video preview…', 480, 290);
      context.font = '18px sans-serif'; context.fillStyle = '#a1b1c5';
      context.fillText(this.sourceError ? 'Choose another video in Manage sources.' : 'Waiting for the first decoded frame.', 480, 325);
      context.textAlign = 'left';
    }
    this.updateBoxes();
  }

  drawVideo(source, sourceWidth, sourceHeight) {
    const context = this.canvas.getContext('2d');
    const scale = Math.min(960 / sourceWidth, 600 / sourceHeight);
    const width = sourceWidth * scale, height = sourceHeight * scale;
    this.videoRect = { x: (960 - width) / 2, y: (600 - height) / 2, width, height };
    context.fillStyle = '#090d13'; context.fillRect(0, 0, 960, 600);
    context.drawImage(source, this.videoRect.x, this.videoRect.y, width, height);
  }

  toggleInference() {
    if (this.inferenceEnabled) { this.stopInference(); this.draw(0); return; }
    if (this.mode === 'demo') { notify('Choose a real video or webcam before running a detector.'); return; }
    if (this.sourceError || this.video.readyState < 2) { notify('Wait for a valid video frame before starting detection.'); return; }
    this.cancelCrop(); this.inferenceEnabled = true; this.resultReady = false;
    this.detectionEpoch++; this.nextInferenceAt = 0;
    state.sources[this.view].inferenceEnabled = true;
    this.element.querySelector('.run-detector').textContent = 'Stop detection';
    this.setLabel('.feed-caption', 'LOCAL MODEL INFERENCE · FRAME-ALIGNED BOXES');
    this.setLabel('.model-state', 'Loading detector…');
    this.setLabel('.feed-count', 'Waiting for first detection…');
    this.updateBoxes();
    this.onDetections(); this.draw(0);
    notify(`Running the ${this.view} detector locally. The first frame may take longer while weights load.`);
  }

  stopInference() {
    this.detectionEpoch++; this.inferenceEnabled = false; this.resultReady = false;
    this.pendingResult = null; this.lastResult = null;
    this.inferenceController?.abort(); this.inferenceController = null; this.inFlight = false;
    if (state.sources[this.view]) state.sources[this.view].inferenceEnabled = false;
    const button = this.element.querySelector('.run-detector');
    button.innerHTML = `${icon('scan')}Run detector`;
    if (this.mode !== 'demo') {
      this.detections = []; this.updateBoxes();
      this.setLabel('.feed-count', 'Detection stopped');
      this.setLabel('.feed-caption', 'LOCAL PREVIEW · DETECTION OFF');
      this.setLabel('.model-state', 'Detector stopped');
    }
    this.onDetections();
  }

  async inferCurrentFrame() {
    if (this.inFlight || this.pendingResult || this.paused || this.cropping) return;
    const epoch = this.detectionEpoch;
    const frameId = ++this.processingFrameId;
    this.inFlight = true;
    const controller = this.inferenceController = new AbortController();
    const timeout = setTimeout(() => controller.abort('Inference timed out'), 120000);
    try {
      // Capture off screen. Keep the last complete image + boxes + crop source intact.
      const frame = this.captureCanvas;
      const scale = Math.min(1, 1920 / Math.max(this.video.videoWidth, this.video.videoHeight));
      const width = Math.max(1, Math.round(this.video.videoWidth * scale));
      const height = Math.max(1, Math.round(this.video.videoHeight * scale));
      if (frame.width !== width) frame.width = width;
      if (frame.height !== height) frame.height = height;
      frame.getContext('2d').drawImage(this.video, 0, 0, width, height);
      const videoTime = this.video.currentTime;
      const blob = await new Promise(resolve => frame.toBlob(resolve, 'image/jpeg', .9));
      if (!blob) throw new Error('Could not encode the video frame.');
      if (epoch !== this.detectionEpoch) return;
      const result = await detectFrame(this.view, frameId, blob, {
        imgsz: Number(this.element.querySelector('.inference-size').value), signal: controller.signal,
      });
      if (epoch !== this.detectionEpoch || !this.inferenceEnabled) return;
      this.pendingResult = { result, frame, videoTime, epoch };
      this.presentPendingResult();
    } catch (error) {
      if (epoch !== this.detectionEpoch) return;
      this.stopInference();
      this.setLabel('.model-state', 'Detection unavailable — retry after checking the server');
      notify(error.message || 'Inference failed. Check the local detection server.');
    } finally {
      clearTimeout(timeout);
      if (epoch === this.detectionEpoch) { this.inFlight = false; this.inferenceController = null; }
    }
  }

  presentPendingResult() {
    if (!this.pendingResult || this.paused || this.cropping) return;
    const { result, frame, videoTime, epoch } = this.pendingResult;
    this.pendingResult = null;
    if (epoch !== this.detectionEpoch || !this.inferenceEnabled) return;
    // Swap both buffers and all result metadata in one browser paint.
    this.captureCanvas = this.inferenceCanvas;
    this.inferenceCanvas = frame;
    this.drawVideo(frame, frame.width, frame.height);
    this.displayedVideoTime = videoTime;
    this.lastResult = result; this.resultReady = true;
    const rect = this.videoRect;
    this.detections = result.detections.map((detection, index) => ({
      id: detection.id, label: `${this.view[0].toUpperCase()}${index + 1} · ${Math.round(detection.confidence * 100)}%`,
      confidence: detection.confidence, demo: false, frameId: result.frame_id,
      bbox: [rect.x + detection.bbox_normalized[0] * rect.width, rect.y + detection.bbox_normalized[1] * rect.height, detection.bbox_normalized[2] * rect.width, detection.bbox_normalized[3] * rect.height],
    }));
    this.setLabel('.model-state', `${result.model} · ${Math.round(result.inference_ms)} ms`);
    this.setLabel('.feed-count', `${this.detections.length} people · frame ${result.frame_id}`);
    this.updateBoxes(); this.onDetections();
    // No extra 250 ms stall: sample the next frame on the next animation tick.
    this.nextInferenceAt = performance.now();
  }

  updateBoxes() {
    const signature = `${this.inferenceEnabled}:${this.resultReady}:` + this.detections.map(d => d.id).join(',');
    if (this.boxSignature !== signature) {
      this.boxSignature = signature;
      this.boxLayer.replaceChildren();
      const list = this.element.querySelector('.track-list'); list.replaceChildren();
      for (const detection of this.detections) {
        const box = element('<button class="detection-box"><span></span></button>');
        box.setAttribute('aria-label', `Select ${detection.demo ? 'demo person' : 'detected person'} ${detection.id} from ${this.view} camera`);
        box.firstElementChild.textContent = detection.label || detection.id;
        const chip = element(`<button class="track-chip">${icon('person')}<span></span></button>`);
        chip.setAttribute('aria-label', `Use ${detection.id} as reference`);
        chip.lastElementChild.textContent = detection.label || detection.id;
        box.onclick = chip.onclick = () => this.select(detection.id, detection.demo ? 'manual' : 'detection');
        this.boxLayer.append(box); list.append(chip);
      }
      if (!this.detections.length) {
        const note = element('<span class="no-detections"></span>');
        note.textContent = this.inferenceEnabled ? (this.resultReady ? 'No people detected in this frame.' : 'Waiting for this frame’s predictions…') : 'Detection is off · use Run detector or draw a reference crop.';
        list.append(note);
      }
    }
    for (const [index, detection] of this.detections.entries()) {
      const [x, y, width, height] = detection.bbox;
      const box = this.boxLayer.children[index];
      Object.assign(box.style, { left: `${x / 9.6}%`, top: `${y / 6}%`, width: `${width / 9.6}%`, height: `${height / 6}%` });
      const selected = state.reference?.source === this.view && state.reference?.trackId === detection.id;
      box.classList.toggle('selected', selected);
      box.setAttribute('aria-pressed', String(selected));
      const chip = this.element.querySelector('.track-list').children[index];
      chip.classList.toggle('selected', selected); chip.setAttribute('aria-pressed', String(selected));
    }
  }

  select(id, method = 'manual') {
    const detection = this.detections.find(d => d.id === id);
    if (detection) this.capture(detection.bbox, id, method, detection.confidence);
  }

  capture(bbox, trackId = null, method = 'crop', confidence = null) {
    const [x, y, width, height] = bbox.map(Math.round);
    const rect = this.videoRect || { x: 0, y: 0, width: 960, height: 600 };
    if (width < 3 || height < 3) { notify('Select a larger area around the person.'); return; }
    const originalFrame = this.inferenceEnabled && this.resultReady ? this.inferenceCanvas : this.canvas;
    const native = originalFrame === this.inferenceCanvas;
    const cropWidth = native ? Math.max(1, Math.round(width / rect.width * originalFrame.width)) : width;
    const cropHeight = native ? Math.max(1, Math.round(height / rect.height * originalFrame.height)) : height;
    const crop = document.createElement('canvas'); crop.width = cropWidth; crop.height = cropHeight;
    const sx = native ? (x - rect.x) / rect.width * originalFrame.width : x;
    const sy = native ? (y - rect.y) / rect.height * originalFrame.height : y;
    crop.getContext('2d').drawImage(originalFrame, sx, sy, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    this.onSelect({
      source: this.view, trackId, method, demo: this.mode === 'demo',
      sourceName: state.sources[this.view].name,
      capturedAt: new Date().toISOString(),
      videoTime: this.mode === 'file' ? (this.inferenceEnabled ? this.displayedVideoTime : this.cropping ? this.cropVideoTime : this.video.currentTime) : null,
      image: crop.toDataURL('image/png'), width: cropWidth, height: cropHeight,
      detectorName: this.inferenceEnabled ? this.lastResult?.model : null,
      detectionConfidence: confidence,
      frameId: this.inferenceEnabled ? this.lastResult?.frame_id : null,
      idKind: method === 'detection' ? 'frame_detection' : this.mode === 'demo' ? 'demo_track' : 'manual_crop',
      bboxNormalized: [(x - rect.x) / rect.width, (y - rect.y) / rect.height, width / rect.width, height / rect.height],
    });
    this.updateBoxes();
  }

  beginCrop() {
    if (this.cropping) { this.cancelCrop(); return; }
    if (this.sourceError || (this.mode !== 'demo' && this.video.readyState < 2) || (this.inferenceEnabled && !this.resultReady)) { notify('Wait for a processed video frame before selecting a reference.'); return; }
    this.cropping = true;
    this.cropVideoTime = this.video.currentTime;
    this.stage.classList.add('cropping');
    this.element.querySelector('.crop-instruction').hidden = false;
    notify('The frame is frozen. Drag a box around one person. Press Escape to cancel.');
  }

  point(event) {
    const rect = this.stage.getBoundingClientRect();
    const active = this.videoRect || { x: 0, y: 0, width: 960, height: 600 };
    return {
      x: Math.max(active.x, Math.min(active.x + active.width, (event.clientX - rect.left) / rect.width * 960)),
      y: Math.max(active.y, Math.min(active.y + active.height, (event.clientY - rect.top) / rect.height * 600)),
    };
  }
  cropStart(event) {
    if (!this.cropping || event.button !== 0) return;
    event.preventDefault(); this.start = this.point(event); this.stage.setPointerCapture(event.pointerId);
  }
  cropMove(event) {
    if (!this.cropping || !this.start) return;
    const end = this.point(event);
    this.pendingBox = [Math.min(this.start.x, end.x), Math.min(this.start.y, end.y), Math.abs(end.x - this.start.x), Math.abs(end.y - this.start.y)];
    const [x, y, w, h] = this.pendingBox; this.cropRect.hidden = false;
    Object.assign(this.cropRect.style, { left: `${x / 9.6}%`, top: `${y / 6}%`, width: `${w / 9.6}%`, height: `${h / 6}%` });
  }
  cropEnd(event) {
    if (!this.cropping || !this.start) return;
    this.cropMove(event);
    if (this.pendingBox) this.capture(this.pendingBox);
    this.cancelCrop();
  }
  cancelCrop() {
    this.cropping = false; this.start = null; this.pendingBox = null;
    this.cropRect.hidden = true; this.stage.classList.remove('cropping');
    this.element.querySelector('.crop-instruction').hidden = true;
  }

  cleanup() {
    this.stopInference();
    this.cancelCrop(); this.video.pause(); this.video.onloadeddata = null;
    if (this.video.srcObject) this.video.srcObject.getTracks().forEach(track => track.stop());
    this.video.srcObject = null; this.video.removeAttribute('src'); this.video.load();
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = null;
  }

  updateSource(mode, name) {
    this.mode = mode; this.detections = []; this.boxSignature = null; this.sourceError = false;
    state.sources[this.view] = { mode, name };
    this.canvas.setAttribute('aria-label', `${this.view} camera ${mode === 'demo' ? 'simulated scene' : 'video preview'}`);
    this.setLabel('.feed-status', mode === 'demo' ? 'DEMO FEED' : mode === 'file' ? 'LOCAL VIDEO' : 'WEBCAM');
    this.setLabel('.feed-caption', mode === 'demo' ? 'SIMULATED SCENE · NO MODEL INFERENCE' : 'LOCAL PREVIEW · DETECTION OFF');
    this.setLabel('.model-state', mode === 'demo' ? 'Scripted detections' : 'Select Run detector to detect people');
    this.setLabel('.source-type', mode.toUpperCase());
    this.setLabel('.feed-count', mode === 'demo' ? `${this.view === 'ground' ? 4 : 3} simulated tracks` : 'No model predictions');
    this.element.querySelector('.run-detector').disabled = mode === 'demo';
    this.element.querySelector('.run-detector').title = mode === 'demo' ? 'Choose a video or webcam first' : `Run the ${this.view} model locally`;
    this.element.querySelector('.track-list').setAttribute('aria-label', `Select a ${this.view} person as reference`);
    this.setLabel('.camera-header p', `${this.view === 'ground' ? 'CAM 01' : 'CAM 02'} · ${name}`);
    this.onSourceChange(this.view);
    this.draw(0);
  }

  useDemo() {
    ++this.requestId; this.cleanup();
    this.updateSource('demo', this.view === 'ground' ? 'Campus walkway' : 'Courtyard overview');
    this.setLabel('.feed-resolution', '960 × 600');
  }

  loadFile(file) {
    if (!file.type.startsWith('video/') && !/\.(mp4|webm|mov|m4v|ogg)$/i.test(file.name)) { notify('Please choose a video file.'); return; }
    ++this.requestId; this.cleanup();
    this.objectUrl = URL.createObjectURL(file); this.video.src = this.objectUrl;
    this.updateSource('file', file.name);
    this.video.onloadeddata = () => {
      this.setLabel('.feed-resolution', `${this.video.videoWidth} × ${this.video.videoHeight}`);
      this.draw(0);
      if (!state.paused) this.video.play().catch(() => notify('Playback is paused by the browser. Use Resume previews to start it.'));
    };
    notify(`${this.view === 'ground' ? 'Ground' : 'Aerial'} video loaded locally. Choose Run detector to detect people.`);
  }

  async useWebcam() {
    if (!navigator.mediaDevices?.getUserMedia) { notify('Webcam access requires localhost or HTTPS and a supported browser.'); return; }
    const request = this.requestId = (this.requestId || 0) + 1;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (request !== this.requestId) { stream.getTracks().forEach(track => track.stop()); return; }
      this.cleanup(); this.video.srcObject = stream;
      this.updateSource('webcam', 'Local webcam');
      this.video.onloadeddata = () => { this.draw(0); this.setLabel('.feed-resolution', `${this.video.videoWidth} × ${this.video.videoHeight}`); };
      stream.getVideoTracks().forEach(track => track.addEventListener('ended', () => {
        if (this.video.srcObject !== stream) return;
        this.stopInference(); this.cancelCrop();
        this.sourceError = true;
        this.setLabel('.feed-status', 'WEBCAM DISCONNECTED');
        this.setLabel('.model-state', 'Choose a source to reconnect');
        this.draw(0);
        notify('The webcam disconnected. Choose a source to reconnect.');
      }));
      if (!state.paused) await this.video.play();
      notify('Webcam connected. Run detector to detect people, or draw a reference crop.');
    } catch { notify('Could not access the webcam. Check browser permission or choose a local video.'); }
  }

  setPaused(paused) {
    this.paused = paused;
    if (this.mode === 'demo') return;
    if (paused) this.video.pause(); else this.video.play().catch(() => notify('Unable to play this source. Choose another video or restore the demo.'));
  }
}
