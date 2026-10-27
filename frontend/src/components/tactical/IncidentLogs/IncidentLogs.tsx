"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { useIncidentLogs } from "@/hooks";
import { IncidentHeader } from "./IncidentHeader";
import { IncidentItem } from "./IncidentItem";
import { EmptyLogsState } from "./EmptyLogsState";

export const IncidentLogs: React.FC = () => {
  const { alerts, isLoading, refetch, handleExport } = useIncidentLogs();

  return (
    <div className={TACTICAL_VIEW_STYLES.IncidentLogs_div_className}>
      <IncidentHeader
        count={alerts.length}
        isLoading={isLoading}
        onRefresh={() => refetch()}
        onExport={handleExport}
      />

      <div className="flex flex-col gap-2">
        {alerts.length === 0 ? (
          <EmptyLogsState />
        ) : (
          alerts.map((alert, idx) => <IncidentItem key={idx} alert={alert} />)
        )}
      </div>
    </div>
  );
};

export default IncidentLogs;
export * from "./IncidentHeader";
export * from "./IncidentItem";
export * from "./EmptyLogsState";
export * from "./RecentIncidentsTable";
