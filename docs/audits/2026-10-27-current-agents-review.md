# Current AGENTS.md compliance review

> Historical review before the subsequent cleanup. Findings and line numbers below
> describe that snapshot. See [the cleanup validation](2026-10-28-cleanup-validation.md)
> for the implementation and validation status submitted for review.

## Verdict

The current working tree is **not fully compliant**. The recent modular splits
and controller tests do not establish zero duplication, zero inconsistency, or
zero hardcoded operational values across the repository.

This review searched the current source, parsed 211 backend Python files, and
scanned 319 frontend TS/TSX files with the TypeScript AST. No application code
was changed during this review. Numerical mathematical/protocol constants and
test fixture values were not automatically classified as configuration defects.

## Confirmed findings

| Priority | Rule | Evidence | Impact / repair |
| --- | --- | --- | --- |
| High | Fixed perspective and isolated state | `backend/app/services/streaming/channels.py:48` | Named channels can return the mutable global session. A later global view switch changes the object used by a ground client. Give named channels stable, fixed sessions. The latest full backend run has four associated failures. |
| High | Consistent control contract | `frontend/src/hooks/useDroneFlight.ts:60`, `backend/app/api/v1/endpoints/drone.py:25` | Legacy frontend sends `connect_drone_link`, while backend accepts `connect_drone`. This rejects the command. The new Tello manual panel has its own tested API, but it does not repair this separate legacy path. |
| Medium | No duplicated domain workflows | `frontend/src/hooks/useChannelPanel.ts:29`, `frontend/src/hooks/useSuspectSelection.ts:95` | Repeated freeze/retry, confidence selection, cropping, commit, portrait updates, and delayed aerial navigation. Consolidate in one shared workflow with explicit token cleanup on failure. |
| Medium | No duplicated pipeline orchestration | `backend/app/engine/pipeline.py:30`, `backend/app/services/streaming/pipeline_processor/frame_orchestrator.py:20` | The CLI still separately coordinates detection, zoning, annotation, evidence, and telemetry. Reuse shared stages through a CLI adapter. This is duplicated business logic; it is not proof that multiple producers process one stream simultaneously. |
| Medium | Central deployment configuration | `frontend/next.config.ts:14`, `frontend/src/constants/network.ts` | Rewrites pin the backend to `127.0.0.1:8000`; WebSocket construction repeats port literals. Use environment-driven origins and shared network tokens. |
| Medium | Central camera presets | `frontend/src/components/tactical/CameraWallModal/wizard/GroundSensorWizard.tsx:22`, `frontend/src/hooks/useDroneFlight.ts:54`, `backend/app/services/streaming/camera/seed.py:33` | UI code and backend fleet seeds embed private-network addresses, ports and stream paths. Centralize presets; deployment-specific camera endpoints should be configurable. |
| Medium | Central backend settings | `backend/app/services/inference/profiles.py:22`, `backend/app/services/streaming/source_provider/config.py:15`, `backend/app/services/streaming/coordinator_config.py:14`, `backend/app/db/connection.py:24`, `backend/app/api/v1/endpoints/ws.py:25` | Confidence, IoU, input size, acquisition settings, DB timeouts, shutdown waits, and telemetry intervals remain outside core config/constants. Some have constructor or registry overrides, but do not meet the required core/.env convention. |
| Medium | Consistent metadata | `frontend/src/constants/tactical.ts:75`, `backend/app/services/streaming/channels.py:12` | CCTV metadata identifies CAM-01, while primary camera routing maps CAM-01 to aerial and CAM-02 to ground. Frontend fallback engine/fleet data also duplicate backend profiles/seeds and can diverge. |
| Medium | Truthful fallback/status values | `frontend/src/hooks/useDroneFlight.ts:71`, `backend/app/api/v1/endpoints/drone.py:63`, `backend/app/services/streaming/pipeline_models.py:44` | Missing avionics can display populated flight values and online/detecting flags. Fallback frames/telemetry repeat dimensions and confidence defaults. Centralize simulation values and distinguish unknown device status. |
| Medium | Central styling and interaction tokens | `frontend/src/hooks/useZoneCanvas.ts:45`, `frontend/src/components/tactical/Header/index.tsx:19`, `frontend/src/components/tactical/FlightControlDeck/DeviceDeckCard.tsx:23` | Canvas colors, custom backgrounds, RGBA glows and interaction limits remain embedded outside tactical/design tokens. Ordinary spacing and layout utilities need not become environment settings. |
| Medium | All state/effects in hooks | Camera wizard, link prober, modal, snapshot, player and tuning components | AST scan found 14 direct `useState`/`useEffect` calls under `src/components`. This violates the repository's strict rule even where local state is otherwise ordinary React practice. |
| Medium | No inline TSX types | `src/app/layout.tsx:12`, `src/providers/AppProviders.tsx:10`, `src/providers/QueryProvider.tsx:6`, `src/components/tactical/CameraWallModal/wizard/GroundWizardStepIndicator.tsx:12` under frontend | Four TSX object type literals remain. Move their contracts to the central type modules. |
| Medium | Central type contracts | `frontend/src/hooks/useActiveCamera.ts:5`, `frontend/src/services/api/cameraApi.ts:5`, `configApi.ts:4`, `recordingsApi.ts:4` | Exported hook/API contracts still live outside `src/types`. Re-export centrally without redeclaration. |
| Medium | Export-only index files | `frontend/src/components/tactical/FlightControlDeck/index.tsx`, `Header/index.tsx`, other component indexes | Many index files still implement components. The AST found 37 top-level function/variable declarations in index.tsx files; this is a declaration count, not a count of confirmed duplicate components. Move implementations to named component files and keep indexes as barrels. |

## Improvements that are present

- Pydantic BaseModel declarations were found only under `backend/app/schemas`.
- Target coordinate matching is now under `app/services/tracking`.
- The frame orchestrator delegates analysis and output to focused stages.
- Capture lifecycle and file playback are separated.
- The frozen-suspect modal delegates frame, choice and action rendering; its new
  geometry helper, props and styling tokens are centralized.
- Manual drone settings are in core configuration, with environment overrides.
  The previously reported early `.env` loading problem has been corrected.
- New Tello movement components import shared props/types and use a dedicated hook.

These improvements are local to those modules; they do not clear other findings.

## Verification status

The immediately preceding test rerun on this working tree reported:

- Controller backend unit/integration tests: **25 passed**.
- Frontend unit tests: **16 passed**.
- Browser-to-API-to-loopback-UDP tests: **3 passed**.
- TypeScript: passed. ESLint: zero errors, five image warnings.
- Full backend suite: **173 passed, four failed**, one warning.

The failures are all in `test_parallel_channels.py`: fixed perspective,
ground/aerial freeze isolation, model/tracking isolation, and primary camera
identity. This review did not rerun unchanged tests merely to repeat those results.
Passing lint/tests does not enforce every custom architecture rule. Physical
Tello connection and flight smoothness remain unverified.

## Recommended repair order

1. Fix channel identity/isolation and the legacy command mismatch.
2. Centralize network/camera settings, thresholds, timeouts, and fallback values.
3. Consolidate suspect-capture and view-selection workflows.
4. Extract remaining component state/effects, types, and index implementations.
5. Unify CLI orchestration and align fleet/model metadata and styling tokens.
6. Add architecture checks so new violations fail CI, then rerun the full suite.
