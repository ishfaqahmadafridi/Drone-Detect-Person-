import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useViewportActions } from "@/hooks/useViewportActions";
import { useFullscreen } from "@/hooks/useFullscreen";
import { availableViewportLayouts, resolveViewportLayout, selectViewportCameras } from "@/utils/gridUtils";
import { DEFAULT_TACTICAL_CAMERAS, VIEWPORT_CONTROLS } from "@/constants/tactical";
import type { TacticalCameraChannel } from "@/types";

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers(); });

it("offers only layouts supported by the connected camera count", () => {
  expect(availableViewportLayouts(1).map(item => item.mode)).toEqual(["single"]);
  expect(availableViewportLayouts(2).map(item => item.mode)).toEqual(["single", "dual"]);
  expect(resolveViewportLayout("quad", 2)).toBe("dual");
  expect(resolveViewportLayout("dual", 1)).toBe("single");
});

it("limits split/grid capacity, keeps the primary camera visible, and excludes other perspectives", () => {
  const template = DEFAULT_TACTICAL_CAMERAS[0];
  const cameras: TacticalCameraChannel[] = Array.from({ length: 5 }, (_, index) => ({ ...template, id: `air-${index}`, viewMode: "aerial" }));
  cameras.push({ ...template, id: "ground", viewMode: "ground" });
  const ids = cameras.map(camera => camera.id);
  expect(selectViewportCameras(cameras, ids, "aerial", "air-4", "dual").map(camera => camera.id)).toEqual(["air-4", "air-0"]);
  const grid = selectViewportCameras(cameras, ids, "aerial", "air-4", "quad");
  expect(grid).toHaveLength(4);
  expect(grid[0]?.id).toBe("air-4");
  expect(grid.every(camera => camera.viewMode === "aerial")).toBe(true);
});

describe("viewport actions", () => {
  it("prevents duplicate saves and reports success only after the request succeeds", async () => {
    vi.useFakeTimers();
    let finish!: () => void;
    const save = vi.fn(() => new Promise<void>(resolve => { finish = resolve; }));
    const { result } = renderHook(() => useViewportActions());
    let request!: Promise<void>;
    act(() => { request = result.current.run("snapshot", save); void result.current.run("snapshot", save); });
    expect(save).toHaveBeenCalledOnce();
    expect(result.current.pending).toBe("snapshot");
    expect(result.current.message).toBe("");
    await act(async () => { finish(); await request; });
    expect(result.current.message).toBe(VIEWPORT_CONTROLS.snapshot.success);
    expect(result.current.pending).toBeNull();
    act(() => { vi.advanceTimersByTime(VIEWPORT_CONTROLS.feedbackDurationMs); });
    expect(result.current.message).toBe("");
  });

  it("shows request failures and permits a successful retry", async () => {
    const { result } = renderHook(() => useViewportActions());
    await act(async () => { await result.current.run("snapshot", () => Promise.reject(new Error("Wait for a video frame"))); });
    expect(result.current.error).toBe("Wait for a video frame");
    expect(result.current.message).toBe("");
    await act(async () => { await result.current.run("snapshot", async () => {}); });
    expect(result.current.error).toBe("");
    expect(result.current.message).toBe(VIEWPORT_CONTROLS.snapshot.success);
  });
});

describe("native fullscreen synchronization", () => {
  beforeEach(() => {
    Object.defineProperty(document, "fullscreenElement", { configurable: true, writable: true, value: null });
    Object.defineProperty(document, "fullscreenEnabled", { configurable: true, writable: true, value: true });
  });

  it("updates state when fullscreen enters, and when Escape exits outside React", async () => {
    const element = document.createElement("div");
    element.requestFullscreen = vi.fn(async () => {
      Object.defineProperty(document, "fullscreenElement", { configurable: true, value: element });
      document.dispatchEvent(new Event("fullscreenchange"));
    });
    const { result } = renderHook(() => useFullscreen({ current: element }));
    expect(result.current.fullscreenSupported).toBe(true);
    await act(async () => { await result.current.toggleFullscreen(); });
    expect(result.current.isFullscreen).toBe(true);
    act(() => {
      Object.defineProperty(document, "fullscreenElement", { configurable: true, value: null });
      document.dispatchEvent(new Event("fullscreenchange"));
    });
    expect(result.current.isFullscreen).toBe(false);
  });

  it("reports unsupported browsers and propagates denied requests to the action UI", async () => {
    const element = document.createElement("div");
    element.requestFullscreen = vi.fn().mockRejectedValue(new Error("Permission denied"));
    const { result } = renderHook(() => useFullscreen({ current: element }));
    await expect(result.current.toggleFullscreen()).rejects.toThrow("Permission denied");
    Object.defineProperty(document, "fullscreenEnabled", { configurable: true, value: false });
    act(() => { document.dispatchEvent(new Event("fullscreenchange")); });
    expect(result.current.fullscreenSupported).toBe(false);
    await expect(result.current.toggleFullscreen()).rejects.toThrow("not supported");
  });
});
