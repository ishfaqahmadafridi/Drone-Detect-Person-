# Cleanup and validation — 2026-10-28

The submitted changes address the earlier audit's named-channel isolation,
duplicated pipeline and suspect-selection workflows, legacy connect action,
deployment settings, camera presets, component state placement, inline types,
and shared styling/configuration findings. Component index files now re-export
implementations. Architecture tests enforce the checked frontend conventions.

Validation completed during this work:

- Backend: 178 tests passed; one dependency deprecation warning.
- Frontend: 24 unit/architecture tests passed; TypeScript passed.
- ESLint: zero errors; five existing image-element warnings.
- Browser: three scenarios exercise the real API/controller against a local UDP
  emulator, including movement/release, flight actions, missing acknowledgments,
  and input lease expiry after closing the page.
- Production webpack build passed using the test-only offline font fixture.

These checks do not establish full compliance of every legacy subsystem. Some
legacy simulated metadata and response conventions remain outside this cleanup.
The previous audits remain as historical evidence, not current test reports.

Real-aircraft smoothness is unverified. The user reports control lag; the emulator
cannot reproduce radio conditions, aircraft response, or flight dynamics. Control
state is command-derived rather than measured flight telemetry. The implementation
uses the Tello SDK protocol; inspecting the protected APK did not recover the
official app's working controller algorithm. See
[manual control documentation](../tello-manual-control.md) for operating limits.
