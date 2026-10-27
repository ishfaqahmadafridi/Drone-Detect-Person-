import { afterEach, describe, expect, it, vi } from "vitest";
import { captureSuspect } from "@/utils/suspectCapture";
import { trackingApi } from "@/services/api/trackingApi";
import { cropSuspectSnapshots } from "@/utils/suspectSnapshots";
import type { FrozenSelection } from "@/types";

vi.mock("@/services/api/trackingApi", () => ({ trackingApi: { freeze: vi.fn(), resume: vi.fn(), commit: vi.fn() } }));
vi.mock("@/utils/suspectSnapshots", () => ({ cropSuspectSnapshots: vi.fn() }));
const frame: FrozenSelection = {
  token: "freeze-token", image: "image", width: 640, height: 480,
  detections: [
    { id: 1, bbox: [0, 0, 10, 10], conf: .7, is_intruder: false },
    { id: 2, bbox: [20, 20, 30, 30], conf: .9, is_intruder: false },
  ], selected_ids: [], source_type: "file", expires_in: 120,
};
afterEach(() => { vi.resetAllMocks(); });

describe("shared suspect capture", () => {
  it("chooses the best detection and returns only committed portraits", async () => {
    vi.mocked(trackingApi.freeze).mockResolvedValue(frame);
    vi.mocked(cropSuspectSnapshots).mockResolvedValue([{ id: 2, image: "portrait", capturedAt: "now" }]);
    vi.mocked(trackingApi.commit).mockResolvedValue({ status: "ok", mode: "manual", selected_ids: [2] });
    const capture = await captureSuspect("ground");
    expect(trackingApi.commit).toHaveBeenCalledWith(frame.token, [2], "ground");
    expect(capture.portraits[0].id).toBe(2);
    expect(trackingApi.resume).not.toHaveBeenCalled();
  });

  it("resumes the acquired freeze token if cropping fails", async () => {
    vi.mocked(trackingApi.freeze).mockResolvedValue(frame);
    vi.mocked(cropSuspectSnapshots).mockRejectedValue(new Error("image unavailable"));
    vi.mocked(trackingApi.resume).mockResolvedValue();
    await expect(captureSuspect("ground")).rejects.toThrow("image unavailable");
    expect(trackingApi.resume).toHaveBeenCalledWith(frame.token, "ground");
    expect(trackingApi.commit).not.toHaveBeenCalled();
  });

  it("honors an explicit target and resumes on commit failure", async () => {
    vi.mocked(trackingApi.freeze).mockResolvedValue(frame);
    vi.mocked(cropSuspectSnapshots).mockResolvedValue([]);
    vi.mocked(trackingApi.commit).mockRejectedValue(new Error("expired"));
    vi.mocked(trackingApi.resume).mockResolvedValue();
    await expect(captureSuspect("ground", 1)).rejects.toThrow("expired");
    expect(trackingApi.commit).toHaveBeenCalledWith(frame.token, [1], "ground");
    expect(trackingApi.resume).toHaveBeenCalledWith(frame.token, "ground");
  });
});
