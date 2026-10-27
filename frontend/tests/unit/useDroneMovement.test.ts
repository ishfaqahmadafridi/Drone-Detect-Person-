import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDroneMovement } from "@/hooks/useDroneMovement";
import { droneControlApi } from "@/services/api/droneControlApi";
import type { DroneControlStatus } from "@/types";

vi.mock("@/services/api/droneControlApi", () => ({
  droneControlApi: { status: vi.fn(), connect: vi.fn(), input: vi.fn(), action: vi.fn(), disconnect: vi.fn() },
}));

const base: DroneControlStatus = {
  mode: "simulation", connected: false, flight_state: "landed",
  axes: { left_right: 0, forward_back: 0, up_down: 0, yaw: 0 }, input_expired: true, error: "",
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.resetAllMocks();
  vi.mocked(droneControlApi.status).mockResolvedValue(base);
  vi.mocked(droneControlApi.connect).mockResolvedValue({ ...base, connected: true });
  let flightState: DroneControlStatus["flight_state"] = "landed";
  vi.mocked(droneControlApi.input).mockImplementation(async (_session, _sequence, axes) =>
    ({ ...base, connected: true, flight_state: flightState, axes, input_expired: false }));
  vi.mocked(droneControlApi.action).mockImplementation(async (_session, action) => {
    flightState = action === "land" ? "landed" : "airborne";
    return { ...base, connected: true, flight_state: flightState };
  });
});

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("manual control input lifecycle", () => {
  it("does not let a delayed initial status overwrite an active flight", async () => {
    let resolve!: (value: DroneControlStatus) => void;
    vi.mocked(droneControlApi.status).mockImplementationOnce(() => new Promise(done => { resolve = done; }));
    const { result } = renderHook(() => useDroneMovement());
    await act(async () => { await result.current.connect(); });
    await act(async () => { await result.current.action("takeoff"); });
    await act(async () => { resolve(base); });
    expect(result.current.status?.flight_state).toBe("airborne");
    expect(result.current.status?.connected).toBe(true);
  });

  it("does not move before owning a control connection", async () => {
    const { result } = renderHook(() => useDroneMovement());
    await act(async () => { result.current.press("left"); });
    expect(droneControlApi.input).not.toHaveBeenCalled();
    await act(async () => { await result.current.connect(); });
    const count = vi.mocked(droneControlApi.input).mock.calls.length;
    await act(async () => { result.current.press("left"); });
    expect(droneControlApi.input).toHaveBeenCalledTimes(count);
  });

  it("sends neutral on release and stops heartbeats on blur", async () => {
    const { result } = renderHook(() => useDroneMovement());
    await act(async () => { await result.current.connect(); });
    await act(async () => { await result.current.action("takeoff"); });
    await act(async () => { result.current.press("left"); });
    expect(vi.mocked(droneControlApi.input).mock.lastCall?.[2].left_right).toBe(-25);
    await act(async () => { result.current.release("left"); });
    expect(vi.mocked(droneControlApi.input).mock.lastCall?.[2].left_right).toBe(0);
    await act(async () => { window.dispatchEvent(new Event("blur")); });
    const count = vi.mocked(droneControlApi.input).mock.calls.length;
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    expect(droneControlApi.input).toHaveBeenCalledTimes(count);
    expect(result.current.held).toEqual([]);
  });

  it("sends the latest release after a slow request without overlapping requests", async () => {
    const { result } = renderHook(() => useDroneMovement());
    await act(async () => { await result.current.connect(); });
    await act(async () => { await result.current.action("takeoff"); });
    let resolve!: (value: DroneControlStatus) => void;
    vi.mocked(droneControlApi.input).mockImplementationOnce(() => new Promise(done => { resolve = done; }));
    act(() => { result.current.press("right"); });
    const count = vi.mocked(droneControlApi.input).mock.calls.length;
    act(() => { result.current.release("right"); });
    expect(droneControlApi.input).toHaveBeenCalledTimes(count);
    await act(async () => { resolve({ ...base, connected: true, flight_state: "airborne" }); });
    expect(droneControlApi.input).toHaveBeenCalledTimes(count + 1);
    expect(vi.mocked(droneControlApi.input).mock.lastCall?.[2].left_right).toBe(0);
  });

  it("shows connection failure without acquiring control", async () => {
    vi.mocked(droneControlApi.connect).mockRejectedValue(new Error("Wi-Fi unavailable"));
    const { result } = renderHook(() => useDroneMovement());
    await act(async () => { await result.current.connect(); });
    expect(result.current.ownsControl).toBe(false);
    expect(result.current.error).toContain("Wi-Fi unavailable");
    expect(droneControlApi.input).not.toHaveBeenCalled();
  });
});
