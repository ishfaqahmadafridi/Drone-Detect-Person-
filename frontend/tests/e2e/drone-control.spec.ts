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
  await expect(panel.getByRole("button", { name: "Take off", exact: true })).toBeDisabled();
  await panel.getByRole("button", { name: "Connect controls", exact: true }).click();
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
  await expect(panel.getByRole("button", { name: "Take off", exact: true })).toBeDisabled();
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
