import { apiClient } from "./client";
import { IncidentAlert, SnapshotItem } from "@/types";

export const alertsApi = {
  getAlerts: async (): Promise<IncidentAlert[]> => {
    const { data } = await apiClient.get<{ total_alerts: number; alerts: IncidentAlert[] }>("/alerts");
    return data.alerts || [];
  },

  getSnapshots: async (): Promise<SnapshotItem[]> => {
    const { data } = await apiClient.get<{ snapshots: SnapshotItem[] }>("/snapshots");
    return data.snapshots || [];
  },
};
