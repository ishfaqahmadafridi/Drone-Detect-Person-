# Tello manual movement

The aerial flight decks now include a separate **Tello manual control** panel.
It supports hold-to-move left/right, forward/backward, up/down, yaw, takeoff,
land, and neutral/hover. The existing mission controls still use the older
simulated avionics service; use the new manual panel for Tello operations.

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

## Connection and state behavior

- One browser control session owns the aircraft at a time. Expired sessions may
  be replaced; old owners and out-of-order input sequences are rejected.
- Takeoff and landing are explicit acknowledged commands. A timeout closes the
  transport, marks state unknown, and does not automatically retry. Reconnect
  and confirm landing before attempting another takeoff.
- Acknowledged commands are serialized with RC transmission; pending RC replies
  are drained first. Tello's text UDP protocol does not provide request IDs, so
  this cannot guarantee correlation of arbitrarily delayed acknowledgements.
- Disconnect is permitted after confirmed landing. Closing the application sends
  neutral if possible; it does not silently issue a landing command.
- This service keeps control state in one process. Run a single backend worker.
  The existing app has no operator authentication: use it only on a trusted local
  network until authentication and access control are implemented.
- The panel's aircraft state is command-derived, not measured telemetry. It does
  not replace the simulated battery/altitude tiles with genuine Tello readings.
- No video changes or automatic person-following commands are introduced.

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
