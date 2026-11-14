import { apiClient } from "./client";
import { IncidentAlert, SnapshotList } from "@/types";
import { resolveMediaUrl } from "@/constants/network";

export const alertsApi = {
  getAlerts: async (): Promise<IncidentAlert[]> => {
    const { data } = await apiClient.get<{ total_alerts: number; alerts: IncidentAlert[] }>("/alerts");
    return data.alerts || [];
  },

  getSnapshots: async (): Promise<SnapshotList> => {
    const { data } = await apiClient.get<Partial<SnapshotList>>("/snapshots");
    const snapshots = (data.snapshots ?? []).map(item => ({
      ...item,
      url: resolveMediaUrl(item.url),
      thumbnail_url: item.thumbnail_url ? resolveMediaUrl(item.thumbnail_url) : item.thumbnail_url,
    }));
    return { snapshots, total: data.total ?? snapshots.length };
  },
};
