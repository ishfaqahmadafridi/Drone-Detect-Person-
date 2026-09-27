"use client";

import { useAlertsQuery } from "@/services/queries/useAlertsQuery";
import { exportAlertsToCsv } from "@/utils/exportUtils";

export function useIncidentLogs() {
  const { data: alerts = [], isLoading, refetch } = useAlertsQuery();

  const handleExport = () => {
    exportAlertsToCsv(alerts);
  };

  return {
    alerts,
    isLoading,
    refetch,
    handleExport,
  };
}
