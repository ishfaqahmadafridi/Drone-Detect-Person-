import { apiClient } from "./client";
import { DRONE_CONTROL_PATHS } from "@/constants/network";
import { DRONE_MOVEMENT } from "@/constants/tactical";
import type { DroneControlAxes, DroneControlStatus, DroneManualAction } from "@/types";

export const droneControlApi = {
  async status() {
    return (await apiClient.get<DroneControlStatus>(DRONE_CONTROL_PATHS.status)).data;
  },
  async connect(sessionId: string) {
    return (await apiClient.post<DroneControlStatus>(DRONE_CONTROL_PATHS.connect, { session_id: sessionId })).data;
  },
  async input(sessionId: string, sequence: number, axes: DroneControlAxes) {
    return (await apiClient.post<DroneControlStatus>(DRONE_CONTROL_PATHS.input,
      { session_id: sessionId, sequence, axes }, { timeout: DRONE_MOVEMENT.requestTimeoutMs })).data;
  },
  async action(sessionId: string, action: DroneManualAction) {
    return (await apiClient.post<DroneControlStatus>(DRONE_CONTROL_PATHS.action, { session_id: sessionId, action })).data;
  },
  async disconnect(sessionId: string) {
    return (await apiClient.post<DroneControlStatus>(DRONE_CONTROL_PATHS.disconnect, { session_id: sessionId })).data;
  },
};
