import { icon } from '../01-atoms/icons.js';
import { statCard } from '../02-molecules/stat-card.js';

export function dashboard() {
  return `<aside class="sidebar">
    <a class="brand" href="#overview" aria-label="Birds Eye overview"><span class="brand-mark">${icon('scan')}</span><span>BIRDS EYE<small>GROUND TO AERIAL RE-ID</small></span></a>
    <div class="project-label"><span class="project-avatar">BE</span><div>Final year project<small>Research workspace</small></div><span class="tiny-badge">FYP</span></div>
    <p class="nav-label">WORKSPACE</p><nav aria-label="Main navigation">
      <a href="#overview" data-route="overview" class="nav-item active">${icon('overview')}Overview<span class="nav-active-dot"></span></a>
      <a href="#cameras" data-route="cameras" class="nav-item">${icon('camera')}Camera feeds<span class="nav-count">02</span></a>
      <a href="#identity" data-route="identity" class="nav-item">${icon('person')}Identity workspace</a>
      <a href="#activity" data-route="activity" class="nav-item">${icon('activity')}Session activity</a>
      <p class="nav-label">SYSTEM</p><a href="#models" data-route="models" class="nav-item">${icon('layers')}Models & pipeline</a>
    </nav>
    <div class="phase-card"><span class="phase-icon">${icon('sparkles')}</span><p>Building the bigger picture</p><span>Generative view synthesis and cross-view matching are the next research phase.</span><a href="#models">Explore the pipeline ${icon('arrow')}</a></div>
    <div class="sidebar-footer"><span class="status-dot"></span>Frontend prototype<span>v0.1</span></div>
  </aside>
  <div class="app-body"><header class="topbar"><div class="breadcrumb">Workspace ${icon('chevron')} <span id="breadcrumb-current">Overview</span></div><div class="topbar-right"><span class="environment"><i></i> Demo environment</span><span class="topbar-divider"></span><span class="team-avatar">BE</span><span class="team-name">FYP Team<small>Research & development</small></span></div></header>
    <main id="main" tabindex="-1"><div class="page-heading"><div><p class="eyebrow">SEE BEYOND A SINGLE VIEW</p><h1 id="page-title">Observation workspace<span class="heading-dot">.</span></h1><p id="page-description">Two perspectives. One reference. A clearer path to re-identification.</p></div><div class="heading-actions"><button id="pause-all" class="button secondary">${icon('pause')}Pause previews</button><button id="manage-sources" class="button primary">${icon('plus')}Manage sources</button></div></div>
    <div class="demo-notice">${icon('info')}<p><strong>Two detection models, one workspace.</strong> Demo scenes use scripted boxes. For real footage, choose a video or webcam and select Run detector. <span id="backend-status">Checking local detectors…</span></p><span class="notice-tag">DEMO MODE</span></div>
    <section id="overview-section" class="route-section">
      <div class="stats-grid">
        ${statCard({ title: 'Camera sources', value: '02 <span>/ 02</span>', detail: 'Ground + aerial perspectives', symbol: 'camera', id: 'source-stat' })}
        ${statCard({ title: 'Demo detections', value: '07', detail: 'Simulated tracks across both views', symbol: 'people', id: 'detection-stat' })}
        ${statCard({ title: 'Active reference', value: '01', detail: 'One selected person of interest', symbol: 'scan', id: 'reference-stat', tone: 'mint' })}
        ${statCard({ title: 'Verified matches', value: '—', detail: 'Re-identification model pending', symbol: 'link', id: 'match-stat' })}
      </div>
      <div class="observation-grid"><section class="feeds-section"><div class="section-heading"><div><h2>Camera perspectives <span class="count-badge">2</span></h2><p>Select a bounding box to set your reference person.</p></div><span class="small-status"><span class="status-dot"></span><span id="preview-state">Preview running</span></span></div><div id="camera-grid" class="camera-grid"></div><div class="camera-note">${icon('info')} Tracking IDs belong to their own camera. They do not confirm a cross-view identity.</div>
        <article class="pipeline panel"><div class="section-heading"><div><p class="eyebrow">FROM OBSERVATION TO IDENTITY</p><h2>The re-identification workflow</h2></div><a class="text-link" href="#identity">Open workspace ${icon('arrow')}</a></div><div class="pipeline-stages"><div class="pipeline-step complete"><span class="step-number">${icon('check')}</span><div><h3>Observe</h3><p>Ground & aerial feeds</p></div></div><span class="pipeline-connector"></span><div class="pipeline-step current"><span class="step-number">02</span><div><h3>Select reference</h3><p>One person of interest</p></div></div><span class="pipeline-connector"></span><div class="pipeline-step"><span class="step-number">03</span><div><h3>Generate view</h3><p>Next research phase</p></div></div><span class="pipeline-connector"></span><div class="pipeline-step"><span class="step-number">04</span><div><h3>Match & track</h3><p>Model connection needed</p></div></div></div></article>
      </section><aside class="reference-column"><div id="reference-panel"></div><article class="telemetry panel"><div class="section-heading"><h2>${icon('drone')} Drone status</h2><span class="neutral-badge">Not connected</span></div><div class="telemetry-grid"><div><span>Battery</span><strong>— <small>%</small></strong></div><div><span>Altitude</span><strong>— <small>m</small></strong></div><div><span>Speed</span><strong>— <small>m/s</small></strong></div><div><span>Mission</span><strong class="mission-text">Standby</strong></div></div><p>Live telemetry will appear after drone integration.</p></article></aside></div>
      <article class="recent-activity panel"><div class="section-heading"><h2>Session activity</h2><a href="#activity" class="text-link">View all ${icon('arrow')}</a></div><div id="recent-events"></div></article>
    </section>
    <section id="identity-section" class="route-section" hidden></section>
    <section id="activity-section" class="route-section" hidden></section>
    <section id="models-section" class="route-section" hidden></section>
    <footer class="main-footer"><span>BIRDS EYE <span class="footer-separator">/</span> Ground-to-aerial person re-identification</span><span>One target. Two perspectives.</span></footer>
    </main>
  </div>
  <dialog id="sources-dialog" aria-labelledby="sources-title"><div class="dialog-heading"><div><p class="eyebrow">INPUT SOURCES</p><h2 id="sources-title">Bring your cameras into view</h2></div><button class="icon-button close-dialog" aria-label="Close source settings">${icon('close')}</button></div><p class="dialog-description">Choose a demo, local video, or webcam. Run detector sends frames only to the inference server on this computer.</p><div id="source-options"></div><div class="dialog-note">${icon('info')} Detection supports local videos and browser webcams. RTSP cameras need a future adapter for browser playback.</div><div class="dialog-footer"><button class="button secondary close-dialog">Done</button></div></dialog>`;
}
