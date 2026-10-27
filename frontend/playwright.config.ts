import { defineConfig } from "@playwright/test";
import path from "node:path";

export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://127.0.0.1:3100",
    browserName: "chromium",
    channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: ".venv/bin/python tests/drone_control_e2e_server.py",
      cwd: path.resolve(__dirname, "../backend"),
      url: "http://127.0.0.1:8011/api/drone/manual/status",
      timeout: 120_000,
    },
    {
      command: "npm run dev -- --hostname 127.0.0.1 --port 3100 --webpack",
      url: "http://127.0.0.1:3100/drone",
      timeout: 180_000,
      env: {
        NEXT_DIST_DIR: ".next-e2e",
        NEXT_FONT_GOOGLE_MOCKED_RESPONSES: path.resolve(__dirname, "tests/support/google-fonts.cjs"),
      },
    },
  ],
});
