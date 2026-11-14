import React from "react";
import { ShieldCheck } from "lucide-react";
import { EVIDENCE_UI } from "@/constants/tactical";

export const EmptyLogsState: React.FC = () => (
  <div className={EVIDENCE_UI.emptyClass}>
    <span className={EVIDENCE_UI.emptyIconClass}><ShieldCheck aria-hidden="true" className="h-5 w-5" /></span>
    <p className={EVIDENCE_UI.emptyTitleClass}>No incidents</p>
    <p className={EVIDENCE_UI.emptyTextClass}>When someone enters a restricted zone, the event is listed here with its evidence frame.</p>
  </div>
);
