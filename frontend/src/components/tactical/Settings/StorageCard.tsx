"use client";
import React from "react";
import { HardDrive, Trash2 } from "lucide-react";
import { CONNECTIONS_UI, EVIDENCE_UI, SETTINGS_UI, VIDEO_TOOLS } from "@/constants/tactical";
import { useStorageSettings } from "@/hooks/useStorageSettings";
import { EvidenceSectionHeader } from "../IncidentLogs/EvidenceSectionHeader";

export const StorageCard: React.FC = () => {
  const { rows, days, setDays, confirmCleanup, cleaning, result, error } = useStorageSettings();

  return (
    <section aria-label="Storage" className={EVIDENCE_UI.cardClass}>
      <EvidenceSectionHeader icon={HardDrive} title="Storage" description="Evidence saved on this computer." />
      <dl className={CONNECTIONS_UI.detailsClass}>
        {rows.map(row => (
          <div key={row.label} className={CONNECTIONS_UI.detailRowClass}>
            <dt className={CONNECTIONS_UI.detailTermClass}>{row.label}</dt>
            <dd className={CONNECTIONS_UI.detailValueClass}>{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col gap-2">
        <label htmlFor="cleanup-age" className={SETTINGS_UI.channelTitleClass}>Free up space</label>
        <p className={SETTINGS_UI.channelMetaClass}>Delete old snapshots from disk. Recordings are kept.</p>
        <div className={VIDEO_TOOLS.actionsClass}>
          <select id="cleanup-age" value={days} onChange={event => setDays(Number(event.target.value))} className={SETTINGS_UI.selectClass}>
            {SETTINGS_UI.cleanupOptions.map(option => <option key={option.days} value={option.days}>Older than {option.label}</option>)}
          </select>
          <button type="button" onClick={confirmCleanup} disabled={cleaning} className={SETTINGS_UI.dangerButtonClass}>
            <Trash2 aria-hidden="true" className="h-4 w-4" />{cleaning ? "Deleting…" : "Delete snapshots"}
          </button>
        </div>
      </div>
      {result && <p role="status" className={VIDEO_TOOLS.statusClass}>{result}</p>}
      {error && <p role="alert" className={VIDEO_TOOLS.errorClass}>{error}</p>}
    </section>
  );
};

export default StorageCard;
