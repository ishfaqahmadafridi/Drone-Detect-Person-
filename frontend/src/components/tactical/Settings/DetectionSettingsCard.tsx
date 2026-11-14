import React from "react";
import { ScanSearch } from "lucide-react";
import { EVIDENCE_UI, SETTINGS_UI } from "@/constants/tactical";
import { EvidenceSectionHeader } from "../IncidentLogs/EvidenceSectionHeader";
import { DetectionChannelRow } from "./DetectionChannelRow";

export const DetectionSettingsCard: React.FC = () => (
  <section aria-label="Detection settings" className={EVIDENCE_UI.cardClass}>
    <EvidenceSectionHeader
      icon={ScanSearch}
      title="Detection"       description="Each perspective has its own model, sensitivity and evidence rules. Lower confidence finds more people but adds false alarms."
    />
    {SETTINGS_UI.channels.map(item => <DetectionChannelRow key={item.channel} channel={item.channel} label={item.label} />)}
  </section>
);

export default DetectionSettingsCard;
