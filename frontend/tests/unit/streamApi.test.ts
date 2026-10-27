import { expect, it, vi } from "vitest";
import { streamApi } from "@/services/api/streamApi";
import { apiClient } from "@/services/api/client";

vi.mock("@/services/api/client", () => ({ apiClient: { post: vi.fn() } }));

it("selects a named perspective without switching the mutable legacy session", async () => {
  vi.mocked(apiClient.post).mockResolvedValue({ data: { message: "ok", active_view: "aerial" } });
  await streamApi.switchView("aerial");
  expect(apiClient.post).toHaveBeenCalledWith("/stream/view", {}, { params: { view: "aerial", channel: "aerial" } });
});
