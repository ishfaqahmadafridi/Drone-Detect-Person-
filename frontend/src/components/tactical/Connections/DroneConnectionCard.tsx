"use client";
import React from "react";
import { ArrowRight, Drone } from "lucide-react";
import { CONNECTIONS_UI, EVIDENCE_UI, VIDEO_TOOLS } from "@/constants/tactical";
import { useDroneConnectionStatus } from "@/hooks/useConnections";
import type { DroneConnectionCardProps } from "@/types";
import { EvidenceSectionHeader } from "../IncidentLogs/EvidenceSectionHeader";

export const DroneConnectionCard: React.FC<DroneConnectionCardProps> = ({ onOpenFlightControls }) => {
  const { connected, reachable, error, details } = useDroneConnectionStatus();
  const pill = !reachable ? CONNECTIONS_UI.pillClass.warn : connected ? CONNECTIONS_UI.pillClass.on : CONNECTIONS_UI.pillClass.off;
  const pillText = !reachable ? "Backend offline" : connected ? "Connected" : "Not connected";

  return (
    <section aria-label="Drone connection" className={EVIDENCE_UI.cardClass}>
      <EvidenceSectionHeader icon={Drone} title="Drone" count={connected ? 1 : 0} description="One drone at a time.">
        <span className={pill}>{pillText}</span>
      </EvidenceSectionHeader>
      <dl className={CONNECTIONS_UI.detailsClass}>
        {details.map(detail => (
          <div key={detail.label} className={CONNECTIONS_UI.detailRowClass}>
            <dt className={CONNECTIONS_UI.detailTermClass}>{detail.label}</dt>
            <dd className={CONNECTIONS_UI.detailValueClass}>{detail.value}</dd>
          </div>
        ))}
      </dl>
      {error && <p role="alert" className={VIDEO_TOOLS.errorClass}>{error}</p>}
      <p className={CONNECTIONS_UI.noteClass}>
        Connect, take off and land from the flight panel, so the controls stay with one session.
        For the real Tello, join the laptop to the drone&apos;s TELLO Wi-Fi first.
      </p>
      <button type="button" onClick={onOpenFlightControls} className={VIDEO_TOOLS.primaryButtonClass}>
        {connected ? "Open flight controls" : "Connect drone"}<ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </section>
  );
};

export default DroneConnectionCard;
