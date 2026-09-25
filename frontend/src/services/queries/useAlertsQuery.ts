import { useQuery } from "@tanstack/react-query";
import { alertsApi } from "../api/alertsApi";
import { IncidentAlert } from "@/types";

export const ALERTS_QUERY_KEY = ["alerts"] as const;

export const useAlertsQuery = () => {
  return useQuery<IncidentAlert[], Error>({
    queryKey: ALERTS_QUERY_KEY,
    queryFn: () => alertsApi.getAlerts(),
    refetchInterval: 5000,
    staleTime: 3000,
  });
};
