import { dashboard } from '../04-templates/dashboard.js';
import { CameraFeed } from '../03-organisms/camera-feed.js';
import { icon } from '../01-atoms/icons.js';
import { escapeHtml, notify, downloadBlob, downloadJson } from '../01-atoms/dom.js';
import { state, subscribe, logEvent } from '../../state.js';
import { modelStatus } from '../../inference-client.js';

const titleCase = value => value.charAt(0).toUpperCase() + value.slice(1);
const timeLabel = value => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const dateLabel = value => new Date(value).toLocaleString();
const esc = escapeHtml;

export function startWorkspace() {
  document.getElementById('app').innerHTML = dashboard();
  document.querySelector('.camera-note').textContent = 'Detection labels identify people in the current frame. They are not persistent tracks or confirmed cross-view identities.';
  const dialog = document.getElementById('sources-dialog');
  const feeds = {};
  let demoTime = 0;
  let previousFrame = performance.now();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  function selectReference(reference) {
    state.reference = reference;
    state.prepared = null;
    logEvent(reference.method === 'automatic-demo' ? 'Demo reference selected automatically' : 'Reference person selected', `${titleCase(reference.source)} camera · ${reference.trackId || 'manual crop'} · ${reference.demo ? 'simulated subject' : reference.detectorName || 'local video frame'}`, 'reference');
    notify(`Reference selected from the ${reference.source} view. Ready to prepare for the next stage.`);
  }

  function sourceChanged(view) {
    if (state.reference?.source === view) { state.reference = null; state.prepared = null; }
    logEvent(`${titleCase(view)} source changed`, `${state.sources[view].name} · ${state.sources[view].mode}`, 'source');
    renderSourceOptions();
  }

  for (const view of ['ground', 'aerial']) {
    feeds[view] = new CameraFeed(view, { onSelect: selectReference, onSourceChange: sourceChanged, onManage: () => openSources(view), onDetections: updateMetrics });
    document.getElementById('camera-grid').append(feeds[view].element);
  }

  function autoSelect() {
    const view = ['ground', 'aerial'].find(source => feeds[source].mode === 'demo');
    if (!view) { notify('Automatic selection is only available in demo mode. Select a detected person or draw a reference crop on your video.'); return; }
    feeds[view].select(feeds[view].detections[view === 'ground' ? 2 : 0].id, 'automatic-demo');
  }

  function updateMetrics() {
    let demo = 0, actual = 0;
    for (const feed of Object.values(feeds)) {
      if (feed.mode === 'demo') demo += feed.detections.length;
      else actual += feed.detections.length;
    }
    const stat = document.getElementById('detection-stat');
    stat.textContent = String(actual + demo).padStart(2, '0');
    stat.closest('.stat-card').querySelector('.stat-heading span').textContent = demo ? 'Visible people (incl. demo)' : 'Detected people';
    stat.closest('.stat-card').querySelector('p').textContent = `${actual} model detections · ${demo} simulated`;
    const allDemo = Object.values(state.sources).every(source => source.mode === 'demo');
    const detecting = Object.values(feeds).some(feed => feed.inferenceEnabled);
    document.querySelector('.environment').innerHTML = `<i></i>${allDemo ? 'Demo environment' : 'Local camera workspace'}`;
    document.querySelector('.notice-tag').textContent = allDemo ? 'DEMO MODE' : detecting ? 'DETECTION ACTIVE' : 'PREVIEW MODE';
  }

  function renderReference() {
    const reference = state.reference;
    document.getElementById('reference-panel').innerHTML = `<article class="reference-panel panel"><div class="section-heading"><h2>Reference person</h2><span class="reference-indicator">${reference ? '01 SELECTED' : 'NO SELECTION'}</span></div>
      ${reference ? `<div class="reference-preview"><div class="crop-grid"></div><img src="${reference.image}" alt="${reference.demo ? 'Simulated' : 'Captured'} reference person from the ${reference.source} camera"/><span class="crop-corner top-left"></span><span class="crop-corner top-right"></span><span class="crop-corner bottom-left"></span><span class="crop-corner bottom-right"></span><span class="reference-image-label">${reference.demo ? 'DEMO SUBJECT' : 'CAPTURED REFERENCE'}</span></div><div class="reference-info"><div><h3>${esc(reference.trackId || 'Reference crop')}</h3><span class="source-pill">${icon(reference.source === 'ground' ? 'camera' : 'drone')}${titleCase(reference.source)} view</span></div><p>${reference.method === 'automatic-demo' ? 'Automatically selected for this demo' : reference.method === 'crop' ? 'Manually cropped from the preview' : 'Selected from a demo detection'}</p></div><dl class="reference-details"><div><dt>Captured</dt><dd>${timeLabel(reference.capturedAt)}</dd></div><div><dt>Target view</dt><dd>${reference.source === 'ground' ? 'Aerial' : 'Ground'} perspective</dd></div><div><dt>Identity match</dt><dd>Not evaluated</dd></div></dl><button class="button primary full-width prepare-reference">${icon('sparkles')}${state.prepared ? 'Open prepared reference' : 'Prepare for re-identification'}${icon('arrow')}</button><div class="reference-tools"><button class="text-button download-crop">${icon('download')}Save crop</button><button class="text-button clear-reference">Clear selection</button></div>` : `<div class="reference-empty">${icon('person')}<h3>Choose a person to follow</h3><p>Select a demo detection or draw a crop around someone in your video.</p></div><button class="button primary full-width auto-select">${icon('scan')}Auto-select demo subject</button>`}
      <p class="reference-footnote">${icon('info')} A reference starts a search. It is not a confirmed identity.</p></article>`;
    document.querySelector('.prepare-reference')?.addEventListener('click', prepareReference);
    if (reference && !reference.demo) {
      const confidence = reference.detectionConfidence == null ? '' : ` · ${Math.round(reference.detectionConfidence * 100)}% detection confidence`;
      document.querySelector('.reference-info p').textContent = reference.detectorName ? `${reference.detectorName}${confidence}` : 'Manually cropped from the video';
    }
    document.querySelector('.download-crop')?.addEventListener('click', saveCrop);
    document.querySelector('.clear-reference')?.addEventListener('click', clearReference);
    document.querySelector('.auto-select')?.addEventListener('click', autoSelect);
    document.getElementById('reference-stat').textContent = reference ? '01' : '00';
    updateMetrics();
    feeds.ground.updateBoxes(); feeds.aerial.updateBoxes();
  }

  function prepareReference() {
    if (!state.reference) return;
    if (!state.prepared) {
      state.prepared = {
        id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'reference_prepared',
        sourceView: state.reference.source, targetView: state.reference.source === 'ground' ? 'aerial' : 'ground',
        reference: { ...state.reference }, generationStatus: 'not_connected', matchingStatus: 'not_connected',
      };
      logEvent('Reference prepared for re-identification', `${titleCase(state.prepared.sourceView)} → ${titleCase(state.prepared.targetView)} · awaiting generation and matching models`, 'reference');
    }
    location.hash = 'identity';
  }

  function clearReference() {
    state.reference = null; state.prepared = null;
    logEvent('Reference selection cleared', 'Select a new reference from either camera.');
  }

  async function saveCrop() {
    if (!state.reference) return;
    const response = await fetch(state.reference.image);
    downloadBlob(await response.blob(), `birds-eye-${state.reference.source}-${state.reference.trackId || 'crop'}.png`);
    notify('Reference crop downloaded.');
  }

  function eventRows(events) {
    return events.map(event => `<div class="event-row"><span class="event-icon ${event.kind}">${icon(event.kind === 'reference' ? 'scan' : event.kind === 'source' ? 'camera' : 'activity')}</span><div><strong>${esc(event.title)}</strong><p>${esc(event.detail)}</p></div><time datetime="${event.at}" title="${esc(dateLabel(event.at))}">${timeLabel(event.at)}</time></div>`).join('');
  }

  function renderActivity() {
    document.getElementById('recent-events').innerHTML = eventRows(state.events.slice(0, 3));
    document.getElementById('activity-section').innerHTML = `<article class="panel activity-page"><div class="section-heading"><div><h2>Activity in this session</h2><p>Reference selections, source changes, and preparation events.</p></div><button class="button secondary export-session">${icon('download')}Export log</button></div>${eventRows(state.events)}<p class="session-note">Stored in memory for this browser session. Reloading the page starts a new session.</p></article>`;
    document.querySelector('.export-session').onclick = () => {
      downloadJson({ project: 'BIRDS EYE', exportedAt: new Date().toISOString(), mode: 'frontend_prototype', events: state.events }, 'birds-eye-session.json');
      notify('Session log downloaded.');
    };
  }

  function renderIdentity() {
    const reference = state.reference;
    const target = reference?.source === 'aerial' ? 'ground' : 'aerial';
    document.getElementById('identity-section').innerHTML = `<article class="panel identity-workspace"><div class="section-heading"><div><p class="eyebrow">CROSS-VIEW RESEARCH</p><h2>From a reference to a match</h2><p>Prepare the original crop before connecting view synthesis and re-identification.</p></div><span class="neutral-badge">${state.prepared ? 'Reference prepared' : 'Reference selection'}</span></div><div class="identity-stages"><article class="identity-stage"><span class="stage-label">01 / ORIGINAL REFERENCE</span>${reference ? `<div class="identity-image"><img src="${reference.image}" alt="${reference.demo ? 'Demo' : 'Captured'} original reference crop"/><span>${reference.demo ? 'Simulated source' : 'Original capture'}</span></div><h3>${esc(reference.trackId || 'Manual reference crop')}</h3><p>${titleCase(reference.source)} view · ${reference.width} × ${reference.height} px</p><button class="button secondary identity-save">${icon('download')}Save original crop</button>` : `<div class="stage-empty">${icon('person')}<h3>No reference selected</h3><p>Choose a person from the camera views to start.</p><a class="button secondary" href="#cameras">Open camera feeds ${icon('arrow')}</a></div>`}</article><div class="stage-arrow">${icon('arrow')}</div><article class="identity-stage future"><span class="stage-label">02 / GENERATED ${target.toUpperCase()} VIEW</span><div class="stage-empty"><span class="future-icon">${icon('sparkles')}</span><h3>Another perspective, next</h3><p>A connected generator will synthesize the ${target} perspective of your reference person.</p><span class="neutral-badge">Generation model not connected</span></div><p class="stage-note">Generated imagery will be labelled synthetic and kept separate from captured camera evidence.</p></article><div class="stage-arrow">${icon('arrow')}</div><article class="identity-stage future"><span class="stage-label">03 / RE-IDENTIFICATION</span><div class="stage-empty"><span class="future-icon">${icon('link')}</span><h3>Find the candidate</h3><p>Compare appearance features with detections in the ${target} camera.</p><span class="neutral-badge">Re-ID model not connected</span></div><p class="stage-note">Match confidence and ranked candidates will appear only after model evaluation.</p></article></div><div class="identity-footer"><p>${icon('info')}${state.prepared ? 'The reference package is ready. No images have been generated and no identity matches have been calculated.' : 'Preparation saves the crop and source metadata for the future model pipeline.'}</p><button class="button primary export-reference" ${reference ? '' : 'disabled'}>${icon(state.prepared ? 'download' : 'sparkles')}${state.prepared ? 'Export reference package' : 'Prepare reference'}</button></div></article><article class="panel handover-panel"><div><span class="camera-icon">${icon('drone')}</span><h2>Ground-to-aerial handover</h2><p>The approved prototype follows one selected target. Drone dispatch, target locking, predictive tracking, and return-to-base depend on later backend and hardware integration.</p></div><div class="handover-states"><span>Reference selected</span>${icon('chevron')}<span>Match evaluated</span>${icon('chevron')}<span>Target tracked</span></div></article>`;
    document.querySelector('.identity-save')?.addEventListener('click', saveCrop);
    document.querySelector('.export-reference').onclick = () => {
      if (!state.prepared) { prepareReference(); return; }
      downloadJson({ schemaVersion: 1, project: 'BIRDS EYE', ...state.prepared }, 'birds-eye-reference.json');
      notify('Reference package downloaded with its PNG image and source metadata.');
    };
  }

  function renderModels() {
    const stages = [
      ['camera', 'Ground person detection', 'MOT20 YOLO26s pedestrian detector. Runs on ground video or webcam frames and returns person boxes with detection confidence.', detectorStatus('ground')],
      ['drone', 'Aerial person detection', 'VisDrone YOLO11n person detector. Use the 1280 resolution option for more detail in small aerial targets.', detectorStatus('aerial')],
      ['sparkles', 'Generative view synthesis', 'Create a synthetic alternate view from the selected reference. Your next research milestone.', 'Planned research stage'],
      ['scan', 'Appearance feature extraction', 'Encode the reference and candidate crops into comparable appearance embeddings.', 'Re-ID model needed'],
      ['link', 'Cross-view matching', 'Rank candidates, show similarity scores, and evaluate whether a target can be selected.', 'Matching + evaluation needed'],
      ['activity', 'Tracking & drone handover', 'Follow one matched target and display mission state, telemetry, and target-loss events.', 'Backend + drone integration needed'],
    ];
    document.getElementById('models-section').innerHTML = `<div class="models-grid">${stages.map(([symbol, title, description, status], i) => `<article class="panel model-card"><div><span class="camera-icon">${icon(symbol)}</span><span class="model-number">0${i + 1}</span></div><h2>${title}</h2><p>${description}</p><span class="neutral-badge">${status}</span></article>`).join('')}</div><article class="panel requirements-card"><div><h2>Prepare your FYP evaluation</h2><p>The two detectors are connected. Next, evaluate them on footage from each camera perspective.</p></div><ol><li><strong>Ground and aerial video samples.</strong> Start with clear clips, then test small people, occlusion, camera motion, and different lighting.</li><li><strong>Labelled evaluation frames.</strong> Record missed people, false detections, and processing time at each resolution.</li><li><strong>Reference selection.</strong> Select a detected person or draw a crop. Automatic demo selection is a scripted example.</li><li><strong>Paired identities and future models.</strong> Collect labelled examples of the same people in both views before evaluating generation and Re-ID.</li><li><strong>Compute details.</strong> Record your CPU, RAM, GPU, and GPU memory alongside the evaluation results.</li></ol></article>`;
  }

  function renderSourceOptions() {
    document.getElementById('source-options').innerHTML = ['ground', 'aerial'].map(view => `<section class="source-option" data-source="${view}"><div class="source-option-title"><span class="camera-icon ${view === 'aerial' ? 'blue' : ''}">${icon(view === 'ground' ? 'camera' : 'drone')}</span><div><h3>${titleCase(view)} camera</h3><p>${esc(state.sources[view].name)} <span>· ${state.sources[view].mode}</span></p></div></div><div class="source-buttons"><button class="button secondary" data-action="file" data-view="${view}">${icon('upload')}Choose video</button><button class="button secondary" data-action="webcam" data-view="${view}">${icon('camera')}Use webcam</button><button class="text-button" data-action="demo" data-view="${view}">Restore demo</button></div></section>`).join('');
    document.querySelectorAll('[data-action]').forEach(button => {
      button.onclick = () => {
        const feed = feeds[button.dataset.view];
        if (button.dataset.action === 'file') feed.fileInput.click();
        else if (button.dataset.action === 'webcam') { dialog.close(); feed.useWebcam(); }
        else { feed.useDemo(); notify('Simulated scene restored.'); }
      };
    });
  }

  function detectorStatus(view) {
    const status = state.modelHealth?.models?.[view];
    if (!status) return 'Start the local inference server';
    if (!status.available) return 'Checkpoint not downloaded';
    if (status.error) return 'Model load failed — see server output';
    return status.loaded ? `Loaded · ${status.device}` : `Weights available · ${status.device}`;
  }

  async function refreshModelStatus() {
    try { state.modelHealth = await modelStatus(); }
    catch { state.modelHealth = null; }
    renderModels();
    const available = state.modelHealth && Object.values(state.modelHealth.models).every(model => model.available && !model.error);
    document.getElementById('backend-status').textContent = available ? 'Local detectors available' : 'Check the local server and model status';
  }

  function openSources(view) {
    renderSourceOptions(); dialog.showModal();
    if (view) dialog.querySelector(`[data-source="${view}"] button`).focus();
  }
  document.getElementById('manage-sources').onclick = () => openSources();
  dialog.querySelectorAll('.close-dialog').forEach(button => { button.onclick = () => dialog.close(); });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });

  document.getElementById('pause-all').onclick = () => {
    state.paused = !state.paused;
    Object.values(feeds).forEach(feed => feed.setPaused(state.paused));
    document.getElementById('pause-all').innerHTML = `${icon(state.paused ? 'play' : 'pause')}${state.paused ? 'Resume previews' : 'Pause previews'}`;
    document.getElementById('preview-state').textContent = state.paused ? 'Previews paused' : 'Preview running';
    logEvent(state.paused ? 'Previews paused' : 'Previews resumed', 'Ground and aerial preview playback.');
  };

  function route() {
    const requested = location.hash.slice(1) || 'overview';
    state.route = ['overview', 'cameras', 'identity', 'activity', 'models'].includes(requested) ? requested : 'overview';
    const current = state.route;
    const pageInfo = {
      overview: ['Overview', 'Observation workspace', 'Two perspectives. One reference. A clearer path to re-identification.'],
      cameras: ['Camera feeds', 'Your eyes on both views', 'Preview your sources and select one reference person.'],
      identity: ['Identity workspace', 'The identity workspace', 'Prepare a reference for generative view synthesis and cross-view matching.'],
      activity: ['Session activity', 'Every step, in context', 'Review the source and reference events from this browser session.'],
      models: ['Models & pipeline', 'The path to re-identification', 'A modular research pipeline, from ground detection to aerial tracking.'],
    }[current];
    document.getElementById('breadcrumb-current').textContent = pageInfo[0];
    document.getElementById('page-title').innerHTML = `${pageInfo[1]}<span class="heading-dot">.</span>`;
    document.getElementById('page-description').textContent = pageInfo[2];
    document.querySelectorAll('.route-section').forEach(section => { section.hidden = section.id !== `${current === 'cameras' ? 'overview' : current}-section`; });
    document.getElementById('overview-section').classList.toggle('camera-focus', current === 'cameras');
    document.querySelectorAll('[data-route]').forEach(link => {
      link.classList.toggle('active', link.dataset.route === current);
      if (link.dataset.route === current) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
    document.title = `${pageInfo[0]} — BIRDS EYE`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  window.addEventListener('hashchange', route);
  subscribe(() => { renderReference(); renderIdentity(); renderActivity(); });
  renderModels(); renderSourceOptions();
  logEvent('Workspace initialized', 'Demo views are simulated. Choose videos and Run detector to use the selected models.', 'source');
  autoSelect(); route();
  refreshModelStatus();
  const healthTimer = setInterval(refreshModelStatus, 15000);

  function animate(now) {
    const delta = Math.min((now - previousFrame) / 1000, .1); previousFrame = now;
    if (!state.paused && !document.hidden && ['overview', 'cameras'].includes(state.route)) {
      if (!reducedMotion.matches) demoTime += delta;
      for (const feed of Object.values(feeds)) feed.draw(demoTime);
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
  window.addEventListener('pagehide', () => { clearInterval(healthTimer); Object.values(feeds).forEach(feed => feed.cleanup()); });
}
