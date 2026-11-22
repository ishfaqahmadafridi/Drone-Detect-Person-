import { getDroneMovementSocketUrl } from "@/constants/network";
import { DRONE_MOVEMENT } from "@/constants/tactical";
import type { DroneControlAxes, DroneMovementSocketPending, DroneMovementSocketReply } from "@/types";

/** Sends changes without waiting for a previous response, with bounded pending work. */
export class DroneMovementSocket {
  private socket: WebSocket | null = null;
  private pending = new Map<number, DroneMovementSocketPending>();
  private watchdog: ReturnType<typeof setTimeout> | null = null;

  connect() {
    this.close();
    if (typeof WebSocket === "undefined") return;
    try {
      const socket = new WebSocket(getDroneMovementSocketUrl());
      this.socket = socket;
      socket.onmessage = event => {
        if (this.socket !== socket) return;
        try {
          const reply: DroneMovementSocketReply = JSON.parse(event.data);
          if (reply.error) { this.fail(new Error(reply.error)); return; }
          const pending = reply.sequence === undefined ? undefined : this.pending.get(reply.sequence);
          if (pending && reply.status) {
            this.pending.delete(pending.sequence);
            this.clearWatchdog();
            pending.onStatus(reply.status);
            if (this.pending.size) this.startWatchdog();
          }
        } catch { this.fail(new Error("Invalid drone control response.")); }
      };
      socket.onerror = () => { if (this.socket === socket) this.fail(new Error("Drone control connection lost.")); };
      socket.onclose = () => { if (this.socket === socket) this.fail(new Error("Drone control connection closed.")); };
    } catch { this.close(); } // HTTP remains available if sockets cannot be opened.
  }

  send(sessionId: string, sequence: number, axes: DroneControlAxes,
    onStatus: DroneMovementSocketPending["onStatus"], onError: DroneMovementSocketPending["onError"]): boolean {
    const socket = this.socket;
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    this.pending.set(sequence, { sequence, onStatus, onError });
    if (socket.bufferedAmount > DRONE_MOVEMENT.socketMaxBufferedBytes ||
        this.pending.size > DRONE_MOVEMENT.socketMaxPendingInputs) {
      this.fail(new Error("Drone control connection is too slow. Reconnect controls."));
      return true;
    }
    try {
      socket.send(JSON.stringify({ session_id: sessionId, sequence, axes }));
      this.startWatchdog();
    } catch { this.fail(new Error("Drone movement could not be sent.")); }
    return true;
  }

  private clearWatchdog() {
    if (this.watchdog) clearTimeout(this.watchdog);
    this.watchdog = null;
  }

  private startWatchdog() {
    if (!this.watchdog) this.watchdog = setTimeout(() => {
      this.fail(new Error("Drone control response timed out. Reconnect controls."));
    }, DRONE_MOVEMENT.requestTimeoutMs);
  }

  private fail(error: Error) {
    const pending = [...this.pending.values()].at(-1);
    this.close();
    pending?.onError(error);
  }

  close() {
    const socket = this.socket;
    this.socket = null;
    this.pending.clear();
    this.clearWatchdog();
    socket?.close();
  }
}
