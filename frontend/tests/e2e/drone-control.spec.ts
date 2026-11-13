import { expect, test } from "@playwright/test";

const backend = "http://127.0.0.1:8011";
const telemetry = {
  threat_level: "CLEAR", alert_msg: "E2E simulation", total_persons: 0,
  intruders_count: 0, fps: 0, frame_idx: 0, detections: [], source_type: "synthetic",
  view_mode: "aerial", tracking_mode: "auto", selected_target_ids: [], zone_polygon: [],
  confidence_threshold: 0.35,
};

test.beforeEach(async ({ page, request }) => {
  await request.post(`${backend}/__test__/reset`);
  await page.routeWebSocket(/\/ws\/telemetry/, () => {});
  await page.route("**/api/**", async route => {
    const url = new URL(route.request().url());
    if (url.pathname.startsWith("/api/drone/manual/")) {
      // Real production API/router/controller/UDP transport -> loopback emulator.
      const response = await route.fetch({ url: backend + url.pathname + url.search });
      await route.fulfill({ response });
      return;
    }
    if (url.pathname.includes("video_feed")) { await route.abort(); return; }
    let body: object = {};
    if (url.pathname.endsWith("/cameras")) body = { cameras: [] };
    else if (url.pathname.endsWith("/alerts")) body = { alerts: [] };
    else if (url.pathname.endsWith("/snapshots")) body = { snapshots: [] };
    else if (url.pathname.endsWith("/config")) body = { confidence_threshold: 0.35, zone_polygon: [] };
    else if (url.pathname.endsWith("/reid/status")) body = { status: "disabled", targets: [], candidates: [], gallery_tracks: 0, threshold_configured: false };
    else if (url.pathname.endsWith("/stream/status")) body = telemetry;
    else if (url.pathname.endsWith("/tracking/status")) body = { mode: "auto", selected_ids: [] };
    await route.fulfill({ json: body });
  });
  await page.goto("/drone");
  await expect(page.getByRole("region", { name: "Tello movement controls" })).toBeVisible();
});

test("connect, take off, hold/release every direction, hover, land, disconnect", async ({ page, request }) => {
  const panel = page.getByRole("region", { name: "Tello movement controls" });
  await expect(panel.getByRole("button", { name: "Take off", exact: true })).toHaveCount(0); // Not offered in this state.
  await expect(page.getByRole("button", { name: "Takeoff", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "RTL", exact: true })).toHaveCount(0);
  await panel.getByRole("button", { name: "Connect controls", exact: true }).click();
  await expect(panel.getByRole("status", { name: "Tello connection status" })).toContainText("SDK connected — Tello acknowledged the connection");
  await expect(panel.getByRole("button", { name: "Take off", exact: true })).toBeEnabled();
  await panel.getByRole("button", { name: "Take off", exact: true }).click();
  await expect(panel.getByRole("button", { name: "Land", exact: true })).toBeEnabled();
  const cases = [
    ["left", "rc -25 0 0 0"], ["right", "rc 25 0 0 0"],
    ["forward", "rc 0 25 0 0"], ["backward", "rc 0 -25 0 0"],
    ["up", "rc 0 0 25 0"], ["down", "rc 0 0 -25 0"],
    ["rotate left", "rc 0 0 0 -25"], ["rotate right", "rc 0 0 0 25"],
  ];
  for (const [direction, command] of cases) {
    const button = panel.getByRole("button", { name: `Hold to move ${direction}`, exact: true });
    await button.hover();
    await page.mouse.down();
    await expect.poll(async () => (await request.get(`${backend}/__test__/packets`)).json()).toContain(command);
    await page.mouse.up();
    await expect.poll(async () => (await request.get(`${backend}/api/drone/manual/status`)).json())
      .toMatchObject({ axes: { left_right: 0, forward_back: 0, up_down: 0, yaw: 0 } });
  }
  await panel.getByRole("button", { name: "Stop / hover", exact: true }).click();
  await panel.getByRole("button", { name: "Land", exact: true }).click();
  await expect(panel.getByRole("button", { name: "Disconnect", exact: true })).toBeEnabled();
  await panel.getByRole("button", { name: "Disconnect", exact: true }).click();
  await expect(panel.getByRole("button", { name: "Connect controls", exact: true })).toBeVisible();
  await expect(panel.getByRole("status", { name: "Tello connection status" })).toContainText("Drone disconnected");
  const packets = await (await request.get(`${backend}/__test__/packets`)).json();
  expect(packets).toContain("command");
  expect(packets).toContain("takeoff");
  expect(packets).toContain("land");
});

test("missing drone acknowledgement shows connection failure", async ({ page, request }) => {
  await request.post(`${backend}/__test__/drop/command`);
  const panel = page.getByRole("region", { name: "Tello movement controls" });
  await panel.getByRole("button", { name: "Connect controls", exact: true }).click();
  await expect(panel.getByRole("alert")).toContainText("Tello connection failed");
  await expect(panel.getByRole("button", { name: "Take off", exact: true })).toHaveCount(0); // Not offered in this state.
});

test("closing the browser control page stops movement through the backend watchdog", async ({ page, request }) => {
  const panel = page.getByRole("region", { name: "Tello movement controls" });
  await panel.getByRole("button", { name: "Connect controls", exact: true }).click();
  await panel.getByRole("button", { name: "Take off", exact: true }).click();
  const forward = panel.getByRole("button", { name: "Hold to move forward", exact: true });
  await forward.hover();
  await page.mouse.down();
  await expect.poll(async () => (await request.get(`${backend}/__test__/packets`)).json()).toContain("rc 0 25 0 0");
  await page.close();
  await expect.poll(async () => (await request.get(`${backend}/api/drone/manual/status`)).json())
    .toMatchObject({ input_expired: true, axes: { left_right: 0, forward_back: 0, up_down: 0, yaw: 0 } });
});


test("unconfirmed takeoff blocks movement until explicit ground recovery", async ({ page, request }) => {
  const panel = page.getByRole("region", { name: "Tello movement controls" });
  await panel.getByRole("button", { name: "Connect controls", exact: true }).click();
  await request.post(`${backend}/__test__/drop/takeoff`);
  await panel.getByRole("button", { name: "Take off", exact: true }).click();
  await expect(panel.getByRole("alert")).toContainText("Aircraft state is unknown");
  await expect(panel.getByRole("button", { name: "Hold to move up", exact: true })).toBeDisabled();
  await expect(panel.getByRole("button", { name: "Take off", exact: true })).toHaveCount(0); // Not offered in this state.
  await expect(panel.getByRole("button", { name: "Connect controls", exact: true })).toHaveCount(0);
  await panel.getByRole("button", { name: "Confirm drone is on the ground and reconnect", exact: true }).click();
  await expect(panel.getByRole("button", { name: "Take off", exact: true })).toBeEnabled();
  await expect(panel.getByRole("alert")).toHaveCount(0);
  const packets: string[] = await (await request.get(`${backend}/__test__/packets`)).json();
  expect(packets.filter(packet => packet === "takeoff")).toHaveLength(1);
  expect(packets).not.toContain("land");
});


test("SDK connect requests the camera and shows waiting until frames arrive", async ({ page, request }) => {
  const panel = page.getByRole("region", { name: "Tello movement controls" });
  await panel.getByRole("button", { name: "Connect controls", exact: true }).click();
  await expect(panel.getByRole("status", { name: "Tello camera status" })).toContainText("Waiting for Tello camera frames");
  const packets: string[] = await (await request.get(`${backend}/__test__/packets`)).json();
  expect(packets).toContain("streamon");
  expect(packets).not.toContain("takeoff");
  expect(packets).not.toContain("land");
  await expect(panel.getByRole("button", { name: "Start Tello camera", exact: true })).toBeEnabled();
});


const packetsOf = async (request: import("@playwright/test").APIRequestContext): Promise<string[]> =>
  (await request.get(`${backend}/__test__/packets`)).json();
const sendState = (request: import("@playwright/test").APIRequestContext, battery: number) =>
  request.post(`${backend}/__test__/state`, { data: { text: `pitch:0;roll:0;yaw:0;h:0;bat:${battery};tof:10;temph:55;time:0;\r\n` } });

test("live telemetry is shown and a low battery blocks takeoff without sending it", async ({ page, request }) => {
  const panel = page.getByRole("region", { name: "Tello movement controls" });
  await panel.getByRole("button", { name: "Connect controls", exact: true }).click();
  await expect(panel.getByRole("status", { name: "Tello telemetry" })).toContainText("Waiting");
  await sendState(request, 12);
  await expect(panel.getByRole("status", { name: "Tello telemetry" })).toContainText("12%");
  await expect(panel.getByRole("status", { name: "Tello telemetry" })).toContainText("Live");
  await panel.getByRole("button", { name: "Take off", exact: true }).click();
  await expect(panel.getByRole("alert")).toContainText("Battery 12% is below the 20% takeoff minimum");
  await expect(panel.getByRole("button", { name: "Take off", exact: true })).toBeEnabled();
  expect(await packetsOf(request)).not.toContain("takeoff");
  await sendState(request, 80);
  await expect(panel.getByRole("status", { name: "Tello telemetry" })).toContainText("80%");
  await panel.getByRole("button", { name: "Take off", exact: true }).click();
  await expect(panel.getByRole("button", { name: "Hold to move up", exact: true })).toBeEnabled();
});

test("slow takeoff acknowledgement within the flight timeout still succeeds", async ({ page, request }) => {
  const panel = page.getByRole("region", { name: "Tello movement controls" });
  await panel.getByRole("button", { name: "Connect controls", exact: true }).click();
  await request.post(`${backend}/__test__/delay/takeoff/0.4`); // > command timeout (0.3), < flight timeout (0.6)
  await panel.getByRole("button", { name: "Take off", exact: true }).click();
  await expect(panel.getByRole("button", { name: "Hold to move up", exact: true })).toBeEnabled();
  await expect(panel.getByRole("alert")).toHaveCount(0);
  expect((await packetsOf(request)).filter(packet => packet === "takeoff")).toHaveLength(1);
});

test("emergency stop needs confirmation, kills motors and requires ground recovery", async ({ page, request }) => {
  const panel = page.getByRole("region", { name: "Tello movement controls" });
  const emergency = panel.getByRole("button", { name: "EMERGENCY — stop motors", exact: true });
  await expect(emergency).toHaveCount(0);
  await panel.getByRole("button", { name: "Connect controls", exact: true }).click();
  await panel.getByRole("button", { name: "Take off", exact: true }).click();
  await expect(panel.getByRole("button", { name: "Hold to move up", exact: true })).toBeEnabled();
  page.once("dialog", dialog => void dialog.dismiss());
  await emergency.click();
  expect(await packetsOf(request)).not.toContain("emergency");
  page.once("dialog", dialog => void dialog.accept());
  await emergency.click();
  await expect.poll(() => packetsOf(request)).toContain("emergency");
  await expect(panel.getByRole("alert")).toContainText("Emergency motor stop sent");
  await expect(panel.getByRole("button", { name: "Hold to move up", exact: true })).toBeDisabled();
  await expect(panel.getByRole("button", { name: "Take off", exact: true })).toHaveCount(0); // Not offered in this state.
  await panel.getByRole("button", { name: "Confirm drone is on the ground and reconnect", exact: true }).click();
  await expect(panel.getByRole("button", { name: "Take off", exact: true })).toBeEnabled();
});

test("emergency stop is sent while a takeoff acknowledgement is still pending", async ({ page, request }) => {
  const panel = page.getByRole("region", { name: "Tello movement controls" });
  await panel.getByRole("button", { name: "Connect controls", exact: true }).click();
  await request.post(`${backend}/__test__/delay/takeoff/0.5`);
  await panel.getByRole("button", { name: "Take off", exact: true }).click();
  await expect.poll(() => packetsOf(request)).toContain("takeoff");
  page.once("dialog", dialog => void dialog.accept());
  await panel.getByRole("button", { name: "EMERGENCY — stop motors", exact: true }).click();
  await expect.poll(() => packetsOf(request)).toContain("emergency");
  const packets = await packetsOf(request);
  expect(packets.indexOf("emergency")).toBeGreaterThan(packets.indexOf("takeoff"));
  expect(packets.filter(packet => packet === "takeoff")).toHaveLength(1);
  await expect(panel.getByRole("button", { name: "Confirm drone is on the ground and reconnect", exact: true })).toBeVisible();
});

test("keyboard flies the drone: W moves forward, arrow up climbs, release returns to neutral", async ({ page, request }) => {
  const panel = page.getByRole("region", { name: "Tello movement controls" });
  await panel.getByRole("button", { name: "Connect controls", exact: true }).click();
  await page.keyboard.down("w");
  await expect(panel.getByRole("button", { name: "Hold to move forward", exact: true })).not.toHaveAttribute("aria-pressed", "true");
  await page.keyboard.up("w");
  await panel.getByRole("button", { name: "Take off", exact: true }).click();
  await expect(panel.getByRole("button", { name: "Land", exact: true })).toBeEnabled();
  await page.locator("body").click({ position: { x: 5, y: 5 } });
  await page.keyboard.down("w");
  await page.keyboard.down("ArrowUp");
  await expect.poll(() => packetsOf(request)).toContain("rc 0 25 25 0");
  await expect(panel.getByRole("button", { name: "Hold to move forward", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.up("w");
  await page.keyboard.up("ArrowUp");
  await expect.poll(async () => (await request.get(`${backend}/api/drone/manual/status`)).json())
    .toMatchObject({ axes: { left_right: 0, forward_back: 0, up_down: 0, yaw: 0 } });
});


test("settings uses the same manual controls without simulated launch actions", async ({ page }) => {
  await page.goto("/settings");
  const panel = page.getByRole("region", { name: "Tello movement controls" });
  await expect(panel).toBeVisible();
  await expect(page.getByRole("button", { name: "LAUNCH / RE-FLY", exact: true })).toHaveCount(0);
  await panel.getByRole("button", { name: "Connect controls", exact: true }).click();
  await expect(panel.getByRole("button", { name: "Take off", exact: true })).toBeVisible();
});
