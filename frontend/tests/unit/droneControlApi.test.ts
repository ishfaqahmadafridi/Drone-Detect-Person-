import { expect, it, vi } from "vitest";
import { apiClient } from "@/services/api/client";
import { droneControlApi } from "@/services/api/droneControlApi";
import { DRONE_MOVEMENT } from "@/constants/tactical";
import { DRONE_CONTROL_PATHS } from "@/constants/network";

vi.mock("@/services/api/client", () => ({ apiClient: { post: vi.fn(), get: vi.fn() } }));

it("allows long acknowledged operations while keeping input requests bounded", async () => {
  vi.mocked(apiClient.post).mockResolvedValue({ data: {} });
  await droneControlApi.action("session", "takeoff");
  expect(apiClient.post).toHaveBeenLastCalledWith(DRONE_CONTROL_PATHS.action,
    { session_id: "session", action: "takeoff" }, { timeout: DRONE_MOVEMENT.controlTimeoutMs });
  await droneControlApi.connect("session");
  expect(apiClient.post).toHaveBeenLastCalledWith(DRONE_CONTROL_PATHS.connect,
    { session_id: "session", confirmed_landed: false }, { timeout: DRONE_MOVEMENT.controlTimeoutMs });
  await droneControlApi.input("session", 1, { left_right: 0, forward_back: 0, up_down: 0, yaw: 0 });
  expect(vi.mocked(apiClient.post).mock.lastCall?.[2]?.timeout).toBe(DRONE_MOVEMENT.requestTimeoutMs);
});
