import { apiClient } from "./client";
import { DRONE_CONTROL_PATHS } from "@/constants/network";
import { DRONE_MOVEMENT } from "@/constants/tactical";
import type { DroneControlAxes, DroneControlStatus, DroneManualAction, DroneVideoStatus } from "@/types";

const controlRequest = { timeout: DRONE_MOVEMENT.controlTimeoutMs };

export const droneControlApi = {
  async startVideo(sessionId: string) {
    return (await apiClient.post<DroneVideoStatus>(DRONE_CONTROL_PATHS.video, { session_id: sessionId }, controlRequest)).data;
  },
  async videoStatus() {
    return (await apiClient.get<DroneVideoStatus>(DRONE_CONTROL_PATHS.video)).data;
  },
  async status() {
    return (await apiClient.get<DroneControlStatus>(DRONE_CONTROL_PATHS.status, controlRequest)).data;
  },
  async connect(sessionId: string, confirmedLanded = false) {
    return (await apiClient.post<DroneControlStatus>(DRONE_CONTROL_PATHS.connect, { session_id: sessionId, confirmed_landed: confirmedLanded }, controlRequest)).data;
  },
  async input(sessionId: string, sequence: number, axes: DroneControlAxes) {
    return (await apiClient.post<DroneControlStatus>(DRONE_CONTROL_PATHS.input,
      { session_id: sessionId, sequence, axes }, { timeout: DRONE_MOVEMENT.requestTimeoutMs })).data;
  },
  async action(sessionId: string, action: DroneManualAction) {
    return (await apiClient.post<DroneControlStatus>(DRONE_CONTROL_PATHS.action, { session_id: sessionId, action }, controlRequest)).data;
  },
  async emergency(sessionId: string) {
    return (await apiClient.post<DroneControlStatus>(DRONE_CONTROL_PATHS.emergency, { session_id: sessionId }, controlRequest)).data;
  },
  async disconnect(sessionId: string) {
    return (await apiClient.post<DroneControlStatus>(DRONE_CONTROL_PATHS.disconnect, { session_id: sessionId }, controlRequest)).data;
  },
};
