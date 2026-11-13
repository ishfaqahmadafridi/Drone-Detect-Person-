import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDroneMovement } from "@/hooks/useDroneMovement";
import { droneControlApi } from "@/services/api/droneControlApi";
import type { DroneControlStatus } from "@/types";
import { droneTelemetryTiles } from "@/utils/droneMovement";

vi.mock("@/services/api/droneControlApi", () => ({
  droneControlApi: { startVideo: vi.fn(), videoStatus: vi.fn(), status: vi.fn(), connect: vi.fn(), input: vi.fn(), action: vi.fn(), disconnect: vi.fn(), emergency: vi.fn() },
}));

const base: DroneControlStatus = {
  mode: "simulation", connected: false, flight_state: "landed",
  axes: { left_right: 0, forward_back: 0, up_down: 0, yaw: 0 }, input_expired: true, error: "",
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.resetAllMocks();
  vi.mocked(droneControlApi.startVideo).mockResolvedValue({ requested: true, receiving: false, message: "Waiting for frames" });
  vi.mocked(droneControlApi.videoStatus).mockResolvedValue({ requested: true, receiving: false, message: "Waiting for frames" });
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
  it("starts camera separately after real SDK connection without issuing a flight action", async () => {
    vi.mocked(droneControlApi.connect).mockResolvedValue({ ...base, mode: "tello", connected: true });
    const { result } = renderHook(() => useDroneMovement());
    await act(async () => { await result.current.connect(); });
    expect(droneControlApi.startVideo).toHaveBeenCalledOnce();
    expect(droneControlApi.action).not.toHaveBeenCalled();
    expect(result.current.video?.receiving).toBe(false);
  });

  it("waits for a slow camera start before publishing control heartbeats", async () => {
    vi.mocked(droneControlApi.connect).mockResolvedValue({ ...base, mode: "tello", connected: true });
    let finishCamera!: (value: { requested: boolean; receiving: boolean; message: string }) => void;
    vi.mocked(droneControlApi.startVideo).mockImplementationOnce(() => new Promise(resolve => { finishCamera = resolve; }));
    const { result } = renderHook(() => useDroneMovement());
    let connecting!: Promise<void>;
    await act(async () => { connecting = result.current.connect(); });
    await act(async () => { await vi.advanceTimersByTimeAsync(3000); });
    expect(droneControlApi.input).not.toHaveBeenCalled();
    expect(result.current.pending).toBe(true);
    await act(async () => {
      finishCamera({ requested: true, receiving: false, message: "Waiting" });
      await connecting;
    });
    expect(droneControlApi.input).toHaveBeenCalled();
    expect(result.current.ownsControl).toBe(true);
  });

  it("requires an explicit recovery action to confirm landed on reconnect", async () => {
    vi.mocked(droneControlApi.status).mockResolvedValue({ ...base, flight_state: "unknown" });
    const { result } = renderHook(() => useDroneMovement());
    await act(async () => {});
    await act(async () => { await result.current.connect(true); });
    expect(vi.mocked(droneControlApi.connect).mock.lastCall?.[1]).toBe(true);
    expect(droneControlApi.action).not.toHaveBeenCalled();
  });

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

describe("safety and telemetry", () => {
  it("sends emergency stop even while a takeoff is still awaiting its acknowledgement", async () => {
    vi.mocked(droneControlApi.action).mockImplementation(() => new Promise(() => {}));
    vi.mocked(droneControlApi.emergency).mockResolvedValue({ ...base, connected: true, flight_state: "unknown", error: "Emergency motor stop sent." });
    const { result } = renderHook(() => useDroneMovement());
    await act(async () => { await result.current.connect(); });
    act(() => { void result.current.action("takeoff"); });
    await act(async () => { await result.current.emergencyStop(); });
    expect(droneControlApi.emergency).toHaveBeenCalledOnce();
    expect(result.current.status?.flight_state).toBe("unknown");
  });

  it("keeps emergency state when an earlier takeoff reply arrives later", async () => {
    let finishTakeoff!: (value: DroneControlStatus) => void;
    vi.mocked(droneControlApi.action).mockImplementationOnce(() => new Promise(resolve => { finishTakeoff = resolve; }));
    vi.mocked(droneControlApi.emergency).mockResolvedValue({ ...base, connected: true, flight_state: "unknown" });
    const { result } = renderHook(() => useDroneMovement());
    await act(async () => { await result.current.connect(); });
    let takingOff!: Promise<void>;
    await act(async () => { takingOff = result.current.action("takeoff"); });
    await act(async () => { await result.current.emergencyStop(); });
    await act(async () => {
      finishTakeoff({ ...base, connected: true, flight_state: "airborne" });
      await takingOff;
    });
    expect(result.current.status?.flight_state).toBe("unknown");
    expect(result.current.pending).toBe(false);
  });

  it("ignores a stale input failure after a newer connect succeeds", async () => {
    const { result } = renderHook(() => useDroneMovement());
    await act(async () => { await result.current.connect(); });
    let rejectInput!: (error: Error) => void;
    vi.mocked(droneControlApi.input).mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectInput = reject; }));
    await act(async () => { await vi.advanceTimersByTimeAsync(150); });
    await act(async () => { await result.current.connect(); });
    await act(async () => { rejectInput(new Error("stale failure")); });
    expect(result.current.ownsControl).toBe(true);
    expect(result.current.error).toBe("");
  });

  it("serializes camera starts before React renders pending state", async () => {
    const { result } = renderHook(() => useDroneMovement());
    await act(async () => {
      await Promise.all([result.current.startCamera(), result.current.startCamera()]);
    });
    expect(droneControlApi.startVideo).toHaveBeenCalledOnce();
  });

  it("resumes the neutral heartbeat when the window regains focus", async () => {
    const { result } = renderHook(() => useDroneMovement());
    await act(async () => { await result.current.connect(); });
    act(() => { window.dispatchEvent(new Event("blur")); });
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    const afterBlur = vi.mocked(droneControlApi.input).mock.calls.length;
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    expect(vi.mocked(droneControlApi.input).mock.calls.length).toBe(afterBlur);
    act(() => { window.dispatchEvent(new Event("focus")); });
    await act(async () => { await vi.advanceTimersByTimeAsync(300); });
    expect(vi.mocked(droneControlApi.input).mock.calls.length).toBeGreaterThan(afterBlur);
    expect(vi.mocked(droneControlApi.input).mock.lastCall?.[2]).toEqual(base.axes);
  });

  it("does not let a heartbeat reply sent before emergency stop re-enable movement", async () => {
    const { result } = renderHook(() => useDroneMovement());
    await act(async () => { await result.current.connect(); });
    await act(async () => { await result.current.action("takeoff"); });
    let resolveStale!: (value: DroneControlStatus) => void;
    vi.mocked(droneControlApi.input).mockImplementationOnce(() => new Promise(done => { resolveStale = done; }));
    await act(async () => { await vi.advanceTimersByTimeAsync(150); });
    vi.mocked(droneControlApi.emergency).mockResolvedValue({ ...base, connected: true, flight_state: "unknown" });
    await act(async () => { await result.current.emergencyStop(); });
    await act(async () => { resolveStale({ ...base, connected: true, flight_state: "airborne", input_expired: false }); });
    expect(result.current.status?.flight_state).toBe("unknown");
  });

  it("shows recovery when a timed-out action disconnects the aircraft", async () => {
    const { result } = renderHook(() => useDroneMovement());
    await act(async () => { await result.current.connect(); });
    vi.mocked(droneControlApi.action).mockRejectedValueOnce(new Error("Aircraft state is unknown"));
    vi.mocked(droneControlApi.status).mockResolvedValue({ ...base, flight_state: "unknown" });
    await act(async () => { await result.current.action("takeoff"); });
    expect(result.current.status?.flight_state).toBe("unknown");
    expect(result.current.ownsControl).toBe(false);
  });

  it("keeps control after the backend refuses an action but stays connected", async () => {
    const { result } = renderHook(() => useDroneMovement());
    await act(async () => { await result.current.connect(); });
    vi.mocked(droneControlApi.action).mockRejectedValueOnce(new Error("Battery 12% is below the 20% takeoff minimum."));
    vi.mocked(droneControlApi.status).mockResolvedValue({ ...base, connected: true });
    await act(async () => { await result.current.action("takeoff"); });
    expect(result.current.error).toContain("Battery 12%");
    expect(result.current.ownsControl).toBe(true);
  });

  it("builds telemetry tiles, flagging low battery and a stale link", () => {
    const tello = { ...base, mode: "tello" as const, connected: true };
    const telemetry = { battery_percent: 64, height_cm: 120, temperature_high_c: 58, age_s: 0.2, fresh: true };
    expect(droneTelemetryTiles({ ...tello, telemetry })).toEqual([
      { label: "Battery", value: "64%", warn: false },
      { label: "Height", value: "120 cm", warn: false },
      { label: "Temp", value: "58 °C", warn: false },
      { label: "Link", value: "Live", warn: false },
    ]);
    const stale = droneTelemetryTiles({ ...tello, telemetry: { ...telemetry, battery_percent: 12, fresh: false, age_s: 3.4 } });
    expect(stale[0]).toEqual({ label: "Battery", value: "12%", warn: true });
    expect(stale[3]).toEqual({ label: "Link", value: "Stale 3.4 s", warn: true });
    expect(droneTelemetryTiles({ ...tello, telemetry: null }).map(tile => tile.value)).toEqual(["—", "—", "—", "Waiting"]);
    expect(droneTelemetryTiles(base)).toEqual([]);
  });
});

describe("keyboard flight control", () => {
  const key = (type: "keydown" | "keyup", code: string, init: KeyboardEventInit = {}) =>
    act(() => { window.dispatchEvent(new KeyboardEvent(type, { code, bubbles: true, cancelable: true, ...init })); });

  async function airborne() {
    const hook = renderHook(() => useDroneMovement());
    await act(async () => { await hook.result.current.connect(); });
    await act(async () => { await hook.result.current.action("takeoff"); });
    return hook;
  }

  it("holds a direction while the key is down and releases on key up", async () => {
    const { result } = await airborne();
    key("keydown", "KeyW");
    expect(result.current.held).toEqual(["forward"]);
    key("keydown", "ArrowUp");
    expect(result.current.held).toEqual(["forward", "up"]);
    key("keyup", "KeyW");
    key("keyup", "ArrowUp");
    expect(result.current.held).toEqual([]);
  });

  it("ignores keys while landed, with modifiers, on auto-repeat, and while typing in a field", async () => {
    const landed = renderHook(() => useDroneMovement());
    await act(async () => { await landed.result.current.connect(); });
    key("keydown", "KeyW");
    expect(landed.result.current.held).toEqual([]);
    landed.unmount();

    const { result } = await airborne();
    key("keydown", "KeyW", { metaKey: true });
    key("keydown", "KeyW", { repeat: true });
    expect(result.current.held).toEqual([]);
    const input = document.createElement("input");
    document.body.appendChild(input);
    act(() => { input.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyW", bubbles: true })); });
    expect(result.current.held).toEqual([]);
    input.remove();
  });
});
