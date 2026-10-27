
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";
import React from "react";
import { Camera } from "lucide-react";

export const EmptyGalleryState: React.FC = () => {
  return (
    <div className={TACTICAL_VIEW_STYLES.EmptyGalleryState_div_className}>
      <Camera className={TACTICAL_VIEW_STYLES.EmptyGalleryState_Camera_className} />
      <span className={TACTICAL_VIEW_STYLES.EmptyLogsState_span_className}>
        NO EVIDENTIARY SNAPSHOTS YET
      </span>
      <span className={TACTICAL_VIEW_STYLES.EmptyLogsState_span_className_2}>
        Automated high-resolution frames will appear upon perimeter breach or manual capture.
      </span>
    </div>
  );
};
