# Tello manual movement

The aerial deck contains a single **Tello flight control** panel: mode and
flight-state badges, live telemetry tiles (battery, height, temperature, link),
an emergency motor stop, one primary action per state (Connect → Take off ⇄
Land), and two hold-to-move pads. Keyboard: **WASD** moves, **↑/↓** climb and
descend, **←/→** rotate; keys are ignored while typing in a form field. The duplicate simulated flight-action buttons have been removed from the flight
decks. Use this single panel for flight controls; telemetry tiles remain separate.

## Try simulation

1. Start the backend and frontend normally. `DRONE_CONTROL_MODE=simulation` is
   the default; it never opens an aircraft socket.
2. Open the aerial flight deck and select **Connect controls**.
3. Select **Take off**, then hold a direction. Releasing the button clears that
   direction. Opposite directions cancel each other; independent axes combine.
4. Select **Land**, then **Disconnect**.

Simulation validates control state and command flow, not aircraft physics.

## Connect a Ryze Tello

1. Connect the computer running the backend to the Tello Wi-Fi network. Close
   the mobile Tello app so it does not compete for aircraft control.
2. In `backend/.env`, set `DRONE_CONTROL_MODE=tello`, then restart the backend.
   The host and port defaults match Tello SDK 1.3; all are overridable:

   ```dotenv
   DRONE_CONTROL_MODE=tello
   TELLO_HOST=192.168.10.1
   TELLO_COMMAND_PORT=8889
   TELLO_LOCAL_PORT=9000
   TELLO_COMMAND_TIMEOUT_SECONDS=10
   TELLO_SEND_INTERVAL_SECONDS=0.05
   TELLO_INPUT_TIMEOUT_SECONDS=0.6
   # takeoff/land are acknowledged only after the manoeuvre completes.
   TELLO_FLIGHT_COMMAND_TIMEOUT_SECONDS=20
   # Only the non-moving SDK-mode handshake is retried; flight commands never are.
   TELLO_CONNECT_ATTEMPTS=3
   TELLO_COMMAND_GAP_SECONDS=0.1
   # Tello state broadcast (battery, height, temperature) and pre-flight battery floor.
   TELLO_STATE_PORT=8890
   TELLO_STATE_STALE_SECONDS=2.0
   TELLO_MIN_TAKEOFF_BATTERY_PERCENT=20
   ```

3. Start with the aircraft on the ground. Select **Connect controls** to enter
   SDK mode, then use the new panel's takeoff, movement, and landing controls.
   Successful SDK connection does not measure the aircraft's airborne state.

The browser sends the latest axes every 100 ms, serializing requests rather than
queuing every pointer event. The backend repeats fresh input every 50 ms. Those
rates are configurable engineering defaults, not values recovered from the APK.
Movement magnitude defaults to 25 on the SDK's -100…100 channel range.

Release, pointer cancellation, focus loss, hidden tabs, and component cleanup
clear held directions. After 0.6 seconds without input, the backend attempts one
neutral RC packet and stops keepalives. This preserves Tello's documented
no-command automatic landing behavior rather than indefinitely keeping an
abandoned connection alive. Network failure can prevent delivery of neutral;
this is not a guarantee of instantaneous physical stopping.

## SDK choice and reliability

The controller speaks Ryze's published Tello SDK text protocol directly over
UDP. That protocol *is* the official SDK; Ryze ships no maintained Python
package. Third-party wrappers such as `djitellopy` were deliberately not adopted:
they resend commands — including `takeoff` — on timeout, and claim the
telemetry/video ports this backend already owns.

Hardening against intermittent failures:

| Symptom | Cause | Handling |
| --- | --- | --- |
| Connect sometimes fails first time | First `command` datagram lost or ignored while Wi-Fi settles | Handshake retried `TELLO_CONNECT_ATTEMPTS` times (it never moves the aircraft) |
| Takeoff "times out" but the drone flew | Tello acknowledges only after the climb completes | Separate `TELLO_FLIGHT_COMMAND_TIMEOUT_SECONDS` (20 s) |
| Command occasionally ignored | Sent immediately after an `rc` packet | `TELLO_COMMAND_GAP_SECONDS` spacing before acknowledged commands |
| Late `ok` confirms the wrong command | No request IDs in the protocol | Pending replies drained before each command |
| "Address already in use" after restart | Previous socket still tearing down | `SO_REUSEADDR`; clear error naming the port |
| Silent failure off the TELLO network | ICMP port unreachable | Reported as "Tello unreachable" with the Wi-Fi hint |
| Low-battery takeoff marks state unknown | Aircraft rejects takeoff | Pre-flight battery check refuses locally; no packet sent |

Telemetry (battery, height, temperature) is read from the state broadcast on
UDP 8890 and shown in the panel. When it goes stale the panel says the link may
be lost. Telemetry is advisory: if the port cannot be bound, control still works.

**Emergency stop** sends the SDK `emergency` command (motors off immediately;
an airborne drone falls). It requires a confirmation click and is sent without
waiting behind a pending takeoff or landing. Afterwards the state is unknown
until the operator confirms the aircraft is on the ground.

## Connection and state behavior

- One browser control session owns the aircraft at a time. Expired sessions may
  be replaced; old owners and out-of-order input sequences are rejected.
- Takeoff and landing are explicit acknowledged commands. A timeout closes the
  transport, marks state unknown, and does not automatically retry. Reconnect
  and confirm landing before attempting another takeoff.
- The browser allows 45 seconds for acknowledged control operations; movement
  input retains its separate 2-second request limit. If backend command budgets
  are increased, also adjust `DRONE_MOVEMENT.controlTimeoutMs` in
  `frontend/src/constants/tactical.ts`.
- Camera startup pauses browser heartbeats while the backend holds the command
  lock, then renews the ownership lease before control input resumes.
- Acknowledged commands are serialized with RC transmission; pending RC replies
  are drained first. Tello's text UDP protocol does not provide request IDs, so
  this cannot guarantee correlation of arbitrarily delayed acknowledgements.
- Disconnect is permitted after confirmed landing. Closing the application sends
  neutral if possible; it does not silently issue a landing command.
- This service keeps control state in one process. Run a single backend worker.
  The existing app has no operator authentication: use it only on a trusted local
  network until authentication and access control are implemented.
- The panel's aircraft state is command-derived. Battery, height, and temperature
  come from Tello state broadcasts and are marked stale when updates stop.
- Airspace and Settings share the manual control panel. Settings no longer
  routes launch actions through the legacy simulation endpoint.
- Manual evidence capture uses the selected channel's last processed JPEG. It
  returns a conflict until a current frame exists, without advancing the camera
  or running a second inference pass.
- Camera streaming uses a separate SDK request and the existing aerial pipeline.
  No automatic person-following commands are introduced.

## Evidence and verification

Implementation uses Ryze's documented SDK, not a claimed reconstruction of
the mobile app:
[Tello SDK 1.3](https://dl-cdn.ryzerobotics.com/downloads/tello/20180910/Tello%20SDK%20Documentation%20EN_1.3.pdf).
REA has now been used for static APK inspection. The inspected control methods
returned empty/constant bodies, and the APK contains protection artifacts. The
working joystick implementation has not been recovered; see the
[APK investigation](analysis/tello-control/README.md). Matching the official app's
smoothness requires observable runtime behavior and actual Tello firmware,
network-latency, and flight testing.

Automated tests use simulated/mocked transports and cover axis mapping, release,
input expiry, ownership, sequence rejection, takeoff/landing validation, command
timeout, UDP encoding, socket cleanup, and API validation. No aircraft was
connected or flown during implementation.

## Repeatable test commands

From `frontend`, run:

```sh
npm test
npm run test:e2e
npx tsc --noEmit
npm run lint
```

The unit suite checks direction mapping and input lifecycle, including slow
requests, release, blur, connection failure, and stale initial status responses.

The browser suite starts an isolated backend on localhost:8011 and Next.js on
localhost:3100. Chrome is used by default; `PLAYWRIGHT_CHANNEL` can select another
installed Playwright-compatible browser channel. The test servers shut down when
the suite finishes. Test-only font responses avoid Google Fonts downloads, and
the frontend uses `.next-e2e` to keep its build separate from the normal dev server.

Movement requests go through the actual UI, API router, controller, and UDP
transport to a loopback-only Tello emulator. Unrelated camera/video/telemetry
services are stubbed. Tests cover all eight directions, release, hover, landing,
disconnect, missing aircraft replies, and page-close input expiry. Test helper
routes exist only in `backend/tests/drone_control_e2e_server.py` and are never
mounted in the production application.

From `backend`, run the controller and UDP integration tests:

```sh
.venv/bin/python -m pytest tests/test_drone_movement.py tests/test_drone_udp_integration.py -q
```

These tests require permission to bind local sockets. They do not connect to the
Tello Wi-Fi network or validate actual flight smoothness. A real aircraft
connection is confirmed only when Tello acknowledges SDK initialization; selecting
a Wi-Fi network alone is not that confirmation.

## Recovering an unknown flight state

A rejected or timed-out flight command disables movement. Reconnecting alone
must not assume the aircraft landed. Once the operator physically verifies the
aircraft is on the ground with propellers stopped, the manual panel offers
**Confirm drone is on the ground and reconnect**. This explicitly records the
operator confirmation and initializes the SDK connection; it sends no takeoff
or landing command. Confirmation is not measured aircraft telemetry. Do not use
this recovery while the aircraft is airborne.

## Live Tello camera

After a successful SDK connection on the ground, the panel requests `streamon`
through the same serialized command transport and selects the aerial Tello source.
OpenCV's FFmpeg backend decodes UDP video on port 11111. Frames enter the existing
detection and MJPEG pipeline; no additional inference loop is created. Starting
video does not take off or land.

The camera message distinguishes requested video from recently decoded frames.
If video is missing or stops, simulation fallback keeps the viewer open. A waiting
message does not confirm live video. Use **Start Tello camera** on the ground to
retry. Select Synthetic Drone or uploaded footage to leave the camera source.

Keep the laptop on Tello Wi-Fi and local UDP port 11111 available. Configure
`TELLO_VIDEO_HOST`, `TELLO_VIDEO_PORT`, `TELLO_VIDEO_TIMEOUT_MS`, and
`TELLO_VIDEO_STALE_SECONDS` for the receiver. The standard aircraft destination
is port 11111; changing the receiver port alone does not reconfigure the drone.

Automated checks cover streamon, source switching, freshness, bounded capture
settings, and browser messages using loopback UDP and mocked capture. Actual
aircraft video decoding remains unverified. Camera-start failure preserves the
flight connection/state.
