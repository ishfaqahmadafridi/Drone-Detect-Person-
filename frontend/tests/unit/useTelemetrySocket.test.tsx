import React from "react";
import { act, cleanup, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { store } from "@/store";
import { setTelemetryData } from "@/store/slices/telemetrySlice";
import type { ChildrenProps } from "@/types";
import { useTelemetrySocket } from "@/hooks/useTelemetrySocket";

const { siren } = vi.hoisted(() => ({ siren: vi.fn() }));
vi.mock("@/hooks/useAudioAlert", () => ({ useAudioAlert: () => ({ playIntrusionSiren: siren }) }));

class Socket {
  static instances: Socket[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  close = vi.fn();
  constructor() { Socket.instances.push(this); }
}
const wrapper = ({ children }: ChildrenProps) => <Provider store={store}>{children}</Provider>;

beforeEach(() => {
  Socket.instances = [];
  siren.mockClear();
  vi.stubGlobal("WebSocket", Socket);
  store.dispatch(setTelemetryData({ view_mode: "aerial", source_type: "synthetic", threat_level: "CLEAR" }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("ignores old-channel telemetry immediately after perspective selection", () => {
  renderHook(() => useTelemetrySocket(), { wrapper });
  const old = Socket.instances[0];
  act(() => {
    store.dispatch(setTelemetryData({ view_mode: "ground" }));
    old.onmessage?.(new MessageEvent("message", {
      data: JSON.stringify({ view_mode: "aerial", threat_level: "INTRUSION", source_type: "tello" }),
    }));
  });
  expect(store.getState().telemetry.view_mode).toBe("ground");
  expect(store.getState().telemetry.source_type).toBe("synthetic");
  expect(siren).not.toHaveBeenCalled();
});

it("rejects mismatched payload perspectives and accepts the current one", () => {
  renderHook(() => useTelemetrySocket(), { wrapper });
  const current = Socket.instances[0];
  act(() => { current.onmessage?.(new MessageEvent("message", {
    data: JSON.stringify({ view_mode: "ground", source_type: "http" }),
  })); });
  expect(store.getState().telemetry.source_type).toBe("synthetic");
  act(() => { current.onmessage?.(new MessageEvent("message", {
    data: JSON.stringify({ view_mode: "aerial", source_type: "rtsp" }),
  })); });
  expect(store.getState().telemetry.source_type).toBe("rtsp");
});
