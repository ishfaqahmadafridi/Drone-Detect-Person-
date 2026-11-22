import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { DroneMovementSocket } from "@/services/api/droneMovementSocket";
import { DRONE_MOVEMENT } from "@/constants/tactical";

const axes = { left_right: 25, forward_back: 0, up_down: 0, yaw: 0 };
const wires: FakeSocket[] = [];
class FakeSocket {
  static OPEN = 1;
  readyState = 1;
  bufferedAmount = 0;
  onmessage?: (event: { data: string }) => void;
  onerror?: () => void;
  onclose?: () => void;
  send = vi.fn();
  close = vi.fn();
  constructor() { wires.push(this); }
}

beforeEach(() => { wires.length = 0; vi.useFakeTimers(); vi.stubGlobal("WebSocket", FakeSocket); });
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

it("sends direction changes and release before earlier responses arrive", () => {
  const socket = new DroneMovementSocket();
  socket.connect();
  const wire = wires.at(-1)!;
  const status = vi.fn();
  const error = vi.fn();
  socket.send("session", 1, axes, status, error);
  socket.send("session", 2, { ...axes, left_right: 0 }, status, error);
  expect(wire.send).toHaveBeenCalledTimes(2);
  expect(JSON.parse(wire.send.mock.calls[1][0]).axes.left_right).toBe(0);
  wire.onmessage?.({ data: JSON.stringify({ sequence: 1, status: { connected: true } }) });
  wire.onmessage?.({ data: JSON.stringify({ sequence: 2, status: { connected: true } }) });
  expect(status).toHaveBeenCalledTimes(2);
  vi.advanceTimersByTime(DRONE_MOVEMENT.requestTimeoutMs);
  expect(error).not.toHaveBeenCalled();
  socket.close();
});

it("stops sending and reports a missing response instead of growing a queue", () => {
  const socket = new DroneMovementSocket();
  socket.connect();
  const wire = wires.at(-1)!;
  const error = vi.fn();
  socket.send("session", 1, axes, vi.fn(), error);
  vi.advanceTimersByTime(DRONE_MOVEMENT.requestTimeoutMs);
  expect(error).toHaveBeenCalledOnce();
  expect(wire.close).toHaveBeenCalledOnce();
  expect(socket.send("session", 2, axes, vi.fn(), error)).toBe(false);
});

it("refuses buffered movement when the connection cannot keep up", () => {
  const socket = new DroneMovementSocket();
  socket.connect();
  const wire = wires.at(-1)!;
  wire.bufferedAmount = DRONE_MOVEMENT.socketMaxBufferedBytes + 1;
  const error = vi.fn();
  socket.send("session", 1, axes, vi.fn(), error);
  expect(wire.send).not.toHaveBeenCalled();
  expect(error).toHaveBeenCalledOnce();
  expect(wire.close).toHaveBeenCalledOnce();
});

it("ignores replies from a socket replaced during reconnect", () => {
  const socket = new DroneMovementSocket();
  socket.connect();
  const staleWire = wires.at(-1)!;
  const status = vi.fn();
  socket.send("session", 1, axes, status, vi.fn());
  socket.connect();
  staleWire.onmessage?.({ data: JSON.stringify({ sequence: 1, status: { connected: true } }) });
  expect(status).not.toHaveBeenCalled();
  socket.close();
});
