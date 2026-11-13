import React from "react";
import { act, cleanup, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { store } from "@/store";
import { setTelemetryData } from "@/store/slices/telemetrySlice";
import { useStreamMutation } from "@/services/queries/useStreamMutation";
import { streamApi } from "@/services/api/streamApi";
import type { ChildrenProps, StreamSourceResponse } from "@/types";

vi.mock("@/services/api/streamApi", () => ({ streamApi: { switchSource: vi.fn(), switchView: vi.fn() } }));
const fallback: StreamSourceResponse = { message: "fallback", source_type: "synthetic", source_path: "" };
let client: QueryClient;

beforeEach(() => {
  vi.resetAllMocks();
  client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  store.dispatch(setTelemetryData({ view_mode: "aerial", source_type: "rtsp" }));
});
afterEach(() => { cleanup(); client.clear(); });

const wrapper = ({ children }: ChildrenProps) => (
  <Provider store={store}><QueryClientProvider client={client}>{children}</QueryClientProvider></Provider>
);

it("uses the effective backend source after a hardware fallback", async () => {
  vi.mocked(streamApi.switchSource).mockResolvedValue(fallback);
  const { result } = renderHook(() => useStreamMutation(), { wrapper });
  await act(async () => { await result.current.switchSource.mutateAsync({ sourceType: "webcam", channel: "aerial" }); });
  expect(store.getState().telemetry.source_type).toBe("synthetic");
});

it("does not apply a delayed source reply to another perspective", async () => {
  let finish!: (value: StreamSourceResponse) => void;
  vi.mocked(streamApi.switchSource).mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  const { result } = renderHook(() => useStreamMutation(), { wrapper });
  let request!: Promise<unknown>;
  await act(async () => { request = result.current.switchSource.mutateAsync({ sourceType: "webcam", channel: "aerial" }); });
  act(() => { store.dispatch(setTelemetryData({ view_mode: "ground", source_type: "http" })); });
  await act(async () => { finish(fallback); await request; });
  expect(store.getState().telemetry.view_mode).toBe("ground");
  expect(store.getState().telemetry.source_type).toBe("http");
});
