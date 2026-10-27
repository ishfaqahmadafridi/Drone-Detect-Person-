# Tello APK control investigation

## Result

REA was used to inspect the user-provided Tello APK. The working joystick,
takeoff, and landing algorithms have **not** been recovered. The current
AERO-GUARD manual controller remains an independently written implementation of
the published Tello SDK, not a copy or reconstruction of the mobile application's
controller. No controller code was changed during this investigation.

## Artifact and tools

- APK: `1725247646821-TELLO_GOOGLEPLAY_release_2024-08-29_1.apk`.
- Package identified earlier: `com.ryzerobotics.tello`, version `1.6.8.0`.
- SHA-256: `b55f2e62cd4dff960e855a549c978f611f82683e86134a4bc9f2092b3703a8af`.
- REA npm package: `rea-agents@6.8.0`, using portable Node `24.22.1`.
- Portable Temurin JDK `21.0.13` and JADX headless MCP `0.7.1`.
- JADX SHA-256 matched the digest pinned in REA's Android documentation:
  `6e5eacf500b64292bfb73c49797c1958f6ee44646e43e868039ae7feb573ff75`.
- Tools were installed under `/tmp`; application dependencies and global agent
  configuration were not changed. These temporary tools may be removed by the OS.

## Verified static observations

REA identified `TelloCameraActivity`, its left/right rocker fields, the
`oneKeyTakeOff` view, `RockerView`, `RockerRelativeLayout`, and the obfuscated
flight coordinator `com.ryzerobotics.tello.gcs.engine.flight.a`.

Method inspection returned the following results, with invalid-debug-info
warnings. REA marked the source as complete for these stored methods; that does
not establish that they are the methods used after runtime protection initializes.

| Inspected method | Static result |
| --- | --- |
| `RockerView.onTouchEvent` | Constant false |
| `RockerRelativeLayout.onInterceptTouchEvent` | Constant false |
| Flight coordinator `a` constructor | Empty body |
| `TelloCameraActivity$$ViewBinder.bind`, overload 0 | Empty body |
| `TelloCameraActivity.onTouch` | Constant false |

The archive also contains `assets/ijiami.ajm` and native `libexec.so` files for
multiple architectures under `assets/ijm_lib/`. Together with the empty binding
and initialization bodies, this suggests protection/packing and unavailable
runtime code. It does not identify the actual movement protocol or prove that
any particular constant-return method should perform movement.

REA's APK signature reader reported v1/v2 signatures with self-consistent
signer/digest metadata. No comparison with a trusted vendor fingerprint was
performed, so this does not independently authenticate the APK's publisher.

See [rea-evidence.json](rea-evidence.json) for artifact-bound evidence IDs,
selected method bodies, tool identity, and observed protection artifacts.

## Existing implementation checklist

Verified by inspection and the 21 passing mocked/simulated control tests:

- Left/right, forward/backward, up/down, and left/right yaw.
- Explicit takeoff and landing API actions and buttons.
- Neutral RC input for release and stop/hover.
- Input expiry, sequencing, ownership, and disconnect-after-landing checks.
- SDK acknowledgement timeout handling and simulation default.

This does not establish physical flight performance. The existing implementation
does not recover the official app's joystick curves, dead zones, transmission
cadence, proprietary packet format, or firmware-specific logic. Its displayed
aircraft state is command-derived, not measured telemetry. Legacy mission/RTL
buttons still target the simulated avionics service, not Tello flight control.

## What is needed next

To investigate protected runtime behavior, provide a connected Android phone
with this app installed and explicitly enable USB debugging for analysis. Device
capabilities may still limit access to protected code; runtime inspection is not
guaranteed merely by connecting the phone. Alternatively, provide an authorized
unprotected build or existing control/traffic evidence from the working app.

First verify device access and which control code can actually be observed.
Then document the real input mapping, release behavior, cadence, and
takeoff/landing call paths before changing AERO-GUARD to match them. No motor
commands or flight tests are implied by connecting an analysis device.
