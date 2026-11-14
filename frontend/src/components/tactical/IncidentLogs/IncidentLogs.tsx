"use client";
import React from "react";
import { EVIDENCE_UI } from "@/constants/tactical";
import { useIncidentLogs } from "@/hooks";
import { IncidentHeader } from "./IncidentHeader";
import { IncidentItem } from "./IncidentItem";
import { EmptyLogsState } from "./EmptyLogsState";

export const IncidentLogs: React.FC = () => {
  const { alerts, isLoading, refetch, handleExport } = useIncidentLogs();

  return (
    <section aria-label="Incidents" className={EVIDENCE_UI.cardClass}>
      <IncidentHeader count={alerts.length} isLoading={isLoading} onRefresh={() => refetch()} onExport={handleExport} />
      {alerts.length === 0 ? (
        <EmptyLogsState />
      ) : (
        <ul className={EVIDENCE_UI.listClass}>
          {alerts.map((alert, idx) => <IncidentItem key={`${alert.timestamp}-${idx}`} alert={alert} />)}
        </ul>
      )}
    </section>
  );
};

export default IncidentLogs;
export * from "./IncidentHeader";
export * from "./IncidentItem";
export * from "./EmptyLogsState";
export * from "./EvidenceSectionHeader";
