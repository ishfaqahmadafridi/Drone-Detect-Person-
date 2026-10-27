
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";
import React from "react";
import { ShieldCheck } from "lucide-react";

export const EmptyLogsState: React.FC = () => {
  return (
    <div className={TACTICAL_VIEW_STYLES.EmptyLogsState_div_className}>
      <ShieldCheck className={TACTICAL_VIEW_STYLES.EmptyLogsState_ShieldCheck_className} />
      <span className={TACTICAL_VIEW_STYLES.EmptyLogsState_span_className}>
        AIRSPACE SECURE • NO INCIDENTS
      </span>
      <span className={TACTICAL_VIEW_STYLES.EmptyLogsState_span_className_2}>
        Restricted-zone intrusion events appear here.
      </span>
    </div>
  );
};
