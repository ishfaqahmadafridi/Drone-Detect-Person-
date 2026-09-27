"use client";

import React from "react";
import { useIncidentLogs } from "@/hooks";
import { IncidentHeader } from "./IncidentHeader";
import { IncidentItem } from "./IncidentItem";
import { EmptyLogsState } from "./EmptyLogsState";

export const IncidentLogs: React.FC = () => {
  const { alerts, isLoading, refetch, handleExport } = useIncidentLogs();

  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col gap-3 border border-slate-800 max-h-[300px]">
      <IncidentHeader
        count={alerts.length}
        isLoading={isLoading}
        onRefresh={() => refetch()}
        onExport={handleExport}
      />

      <div className="flex flex-col gap-2 overflow-y-auto pr-1">
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
