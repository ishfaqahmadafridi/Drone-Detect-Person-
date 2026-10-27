"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import { Camera } from "lucide-react";
import { ModalImageStageProps } from "@/types";
import { TacticalVideoPlayer } from "./TacticalVideoPlayer";

export const ModalImageStage: React.FC<ModalImageStageProps> = ({ url, filename }) => {
  const isVideo = url?.toLowerCase().endsWith(".mp4") || filename.toLowerCase().endsWith(".mp4");

  if (!url) {
    return (
      <div className={TACTICAL_VIEW_STYLES.ModalImageStage_div_className}>
        <p className={TACTICAL_VIEW_STYLES.ModalImageStage_p_className}>Media file unavailable on storage server.</p>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className={TACTICAL_VIEW_STYLES.ModalImageStage_div_className_2}>
        <TacticalVideoPlayer url={url} filename={filename} />
      </div>
    );
  }

  return (
    <div className={TACTICAL_VIEW_STYLES.ModalImageStage_div_className_3}>
      {/* ── Still Frame Snapshot Indicator Ribbon ── */}
      <div className="absolute top-3 left-4 z-20 flex items-center gap-2 pointer-events-none">
        <span className={TACTICAL_VIEW_STYLES.ModalImageStage_span_className}>
          <Camera className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Gauge_className} />
          OPTICAL SNAPSHOT • 1-FRAME AUDIT CAPTURE
        </span>
      </div>

      <img
        src={url}
        alt={filename}
        className={TACTICAL_VIEW_STYLES.ModalImageStage_img_className}
      />
    </div>
  );
};

export default ModalImageStage;
export * from "./TacticalVideoPlayer";
