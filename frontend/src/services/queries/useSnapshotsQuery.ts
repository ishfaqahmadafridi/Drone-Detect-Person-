import { useQuery } from "@tanstack/react-query";
import { alertsApi } from "../api/alertsApi";
import { SnapshotItem } from "@/types";

export const SNAPSHOTS_QUERY_KEY = ["snapshots"] as const;

export const useSnapshotsQuery = () => {
  return useQuery<SnapshotItem[], Error>({
    queryKey: SNAPSHOTS_QUERY_KEY,
    queryFn: () => alertsApi.getSnapshots(),
    refetchInterval: 6000,
    staleTime: 4000,
  });
};
