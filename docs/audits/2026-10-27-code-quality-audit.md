# Backend and frontend quality audit — 2026-10-27

> Historical audit before the subsequent cleanup. See
> [the cleanup validation](2026-10-28-cleanup-validation.md) for the submitted status.

The repository does not yet meet its strict rules for centralized configuration,
zero duplication, component purity, and fixed camera perspectives. This is an
audit of the current working tree, including the uncommitted refactors.
Application code was not changed during this audit.

## Scope and validation

- Searched `backend/app`, `frontend/src`, and frontend deployment configuration.
- Parsed all 207 Python files under `backend/app` successfully.
- Frontend TypeScript: `npx tsc --noEmit` passed.
- Frontend ESLint: zero errors, five existing `no-img-element` warnings.
- Initial backend run stopped at eight failures: six tests could not bind local
  camera-test sockets in the sandbox; two exposed channel-isolation problems.
- Rerunning with the three socket-test modules excluded completed with
  **138 passed, four failed**, one deprecation warning. All four failures were in
  `tests/test_parallel_channels.py`: fixed perspective, independent freeze,
  model/tracking isolation, and primary camera identity.
- Frontend production build did not complete: `next/font` could not download
  Inter and JetBrains Mono from Google Fonts in the restricted network environment.
  This does not establish a source compilation failure; production build success
  remains unverified. Use locally hosted fonts for reproducible offline builds.

Passing lint or type checks does not enforce the custom AGENTS.md architecture
rules. The searches identify concrete violations; this is not proof that every
possible duplicate or runtime race has been found. No live hardware was tested.

## Findings, in priority order

### 1. High: named channels can return a mutable global session

Evidence: `backend/app/services/streaming/channels.py:48`.

If the global session currently matches the requested perspective, it is returned
without creating or caching a fixed session. A later global perspective switch
can change that same object underneath ground clients. This explains the four
failures in the broader backend run; focused suites previously passed under a
different global state. Named channels should have stable identities and fixed
perspectives, independently of the legacy global manager.

### 2. High: new configuration values are evaluated before .env loading

Evidence: `backend/app/core/config.py:11` and the `app.core.env` import at line 44.

The target-click and device-capture settings added during the earlier refactors
call `os.getenv` before importing the module that loads `.env`. Shell-exported
variables work, but settings supplied only by `.env` can be ignored. A controlled
import reproduction injected `DEVICE_READ_RETRY_SECONDS=0.125` at environment-load
time and observed the effective configuration remain `0.04`. Load the environment
before evaluating any settings.

### 3. High: frontend and backend drone command names disagree

Evidence: `frontend/src/hooks/useDroneFlight.ts:60` and
`backend/app/api/v1/endpoints/drone.py:25`.

The frontend sends `connect_drone_link`; backend validation permits
`connect_drone`. Connecting a drone therefore reaches a rejected command after
the source/perspective changes. Centralize the frontend command contract and
verify the complete API workflow.

### 4. Medium: deployment routing is pinned to a local backend

Evidence: `frontend/next.config.ts:13` and
`frontend/src/constants/network.ts:32`.

All four Next.js rewrites point to `127.0.0.1:8000`. WebSocket construction also
repeats literal ports rather than using the declared network tokens. Configuring
the video-stream origin does not configure REST and WebSocket origins. Use an
environment-driven backend origin and consistent runtime URL construction.

### 5. Medium: camera presets and addresses live in UI implementation

Evidence: `frontend/src/components/tactical/CameraWallModal/wizard/GroundSensorWizard.tsx:22`,
`GroundStep3Form.tsx:73`, and `frontend/src/hooks/useDroneFlight.ts:54`.

The wizard contains IP addresses, ports, credentials defaults, stream paths, USB
defaults, and URL assembly. Device presets also appear in the form; the drone
hook has its own RTSP address. Move presets to tactical constants, URL assembly
and validation to utilities, and wizard state/transitions to a custom hook.
Illustrative labels should be distinguished from values used to initiate connections.

### 6. Medium: duplicated freeze/select/commit and view-selection workflows

Evidence: `frontend/src/hooks/useChannelPanel.ts:29`,
`frontend/src/hooks/useSuspectSelection.ts:95`,
`frontend/src/hooks/useVideoViewport.ts:18`, and
`frontend/src/hooks/useDashboardOrchestrator.ts:66`.

Both suspect-capture implementations retry five times, wait 300 ms, choose a
high-confidence detection, crop, commit, dispatch portraits, and schedule a view
change. Both view-selection implementations repeat camera selection and layout
logic. Centralize each workflow. Ensure acquired freeze tokens are resumed on
crop/commit failure; the current capture catch paths can leave the source paused
until session expiry. Timing and retry policies belong in constants.

### 7. Medium: backend configuration is still distributed across services

Evidence:

- `backend/app/services/inference/profiles.py:22`: input size, confidence, IoU,
  tracker filename, and engine defaults.
- `backend/app/services/streaming/source_provider/config.py:15`: HTTP timeout,
  frame sizes, simulation size/count/interval.
- `backend/app/services/streaming/coordinator_config.py:14`: retry/throttle timing.
- `backend/app/services/streaming/preview_streamer.py:89`: shutdown timeout.
- `backend/app/api/v1/endpoints/ws.py:25`: telemetry send interval.
- `backend/app/db/connection.py:24`: connection and busy timeouts.
- `backend/app/services/alert/alert_manager.py:15` and `evidence_recorder.py:24`:
  snapshot directory defaults.
- `backend/app/services/generative/config.py:16`: model identifier and inference
  defaults outside core configuration.

Some are configurable through constructors or model registry JSON. That still
falls short of the repository rule requiring centralized core defaults and
environment overrides. Keep service-specific config objects, but source their
defaults from core configuration instead of repeating literals.

### 8. Medium: fallback and status payloads contain duplicated operational values

Evidence: `backend/app/services/streaming/pipeline_models.py:44`,
`backend/app/api/v1/endpoints/drone.py:63`, and
`frontend/src/hooks/useDroneFlight.ts:71`.

Fallback frames repeat 1280x720 instead of core dimension constants. Fallback
telemetry repeats confidence and obsolete threshold fields. Ground camera status
always reports online/detecting with fixed equipment data; frontend missing-data
fallbacks also report online/detecting and populated flight metrics. Keep
simulation defaults centralized, and make missing real-device status explicit.

### 9. Medium: visual tokens remain embedded in components and hooks

Evidence: `frontend/src/hooks/useZoneCanvas.ts:45`,
`frontend/src/components/tactical/Header/index.tsx:19`, and
`frontend/src/components/tactical/VideoViewport/ViewportSplitGrid.tsx:23`.

Canvas colors, custom hex backgrounds, and RGBA glow colors are repeated outside
the tactical constants/design tokens. The canvas also embeds interaction radii
and a maximum polygon vertex count. Move configurable visual/interaction tokens
to the central constants; preserve ordinary layout utilities in components.

### 10. Medium: component and type purity rules are not fully enforced

Evidence: `GroundSensorWizard.tsx:19`, `StreamLinkProber.tsx:21`,
`DetectedPersonsModal.tsx:34`, and `GroundWizardStepIndicator.tsx:12` under
`frontend/src/components/tactical/`.

Wizard/prober state and modal effects remain in components. The step indicator
declares an inline object type. Additional exported contracts live outside
`src/types`, for example `frontend/src/hooks/useActiveCamera.ts:5` and
`frontend/src/services/api/cameraApi.ts:5`. Named interface/type declarations were
not found in TSX files, but that does not satisfy the stricter no-inline-types or
all-state-in-hooks requirements.

### 11. Medium: camera identity and model metadata can disagree

Evidence: `frontend/src/constants/tactical.ts:50` defines the CCTV camera ID as
`CAM-01`, while the default fleet identifies CAM-01 as aerial and CAM-02 as ground.
The same file advertises a default aerial BoT-SORT engine, while the fallback
backend profile in `backend/app/services/inference/profiles.py:41` uses ByteTrack.
Backend fleet defaults in `backend/app/services/streaming/camera/seed.py` also
duplicate frontend fleet data, including differing default statuses. Use backend
fleet/model metadata as the runtime authority and consistent frontend placeholders.

### 12. Medium: CLI and streaming pipelines duplicate orchestration

Evidence: `backend/app/engine/pipeline.py:30` and
`backend/app/services/streaming/pipeline_processor/frame_orchestrator.py:20`.

The CLI uses the older `DetectionPipeline` via `backend/app/cli/executor.py:55`;
it separately implements detection, zoning, alerts, annotation, evidence, and
telemetry assembly. This is duplicated business orchestration, not evidence of
two producers simultaneously processing the same stream. Reuse the shared
pipeline behind a CLI adapter while preserving its return contract.

## Recommended repair order

1. Stabilize channel identity, load .env before settings, and fix the drone command contract.
2. Centralize deployment origins, camera presets, backend operational defaults,
   and frontend capture policies.
3. Consolidate capture/view workflows and move state/effects/types out of components.
4. Unify CLI orchestration and align fleet/model metadata and styling tokens.
5. Add architecture checks for forbidden literals, inline TSX types, and contracts
   outside the type modules. Re-run the complete suite including local socket tests
   in an environment that permits test servers.

Numerical bounds such as normalized coordinates, valid port ranges, empty counts,
and mathematical constants are not automatically configuration defects. The
findings above target deployment values, operational policies, duplicated
defaults, and explicit repository-rule violations.
