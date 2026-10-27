"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Film, Maximize2 } from "lucide-react";
import { PreviewViewportProps } from "@/types";
import { getPerspectiveLabel } from "@/utils";

export const PreviewViewport: React.FC<PreviewViewportProps> = ({
  selectedSnapshot,
  onOpenModal,
}) => {
  const perspectiveLabel = getPerspectiveLabel(selectedSnapshot.view_mode);

    const isVideo = selectedSnapshot.media_type === "video" || selectedSnapshot.filename.endsWith(".mp4");

    return (
      <div
        onClick={onOpenModal}
        className={TACTICAL_VIEW_STYLES.PreviewViewport_div_className}
      >
        {selectedSnapshot.url ? (
          isVideo ? (
            <video
              src={selectedSnapshot.url}
              controls
              autoPlay
              loop
              muted
              playsInline
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <img
              src={selectedSnapshot.url}
              alt={selectedSnapshot.filename}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
            />
          )
        ) : (
          <div className={TACTICAL_VIEW_STYLES.PreviewViewport_div_className_2}>
            <Film className={TACTICAL_VIEW_STYLES.PreviewViewport_Film_className} />
            <span>IMAGE / VIDEO FEED UNAVAILABLE</span>
          </div>
        )}

      {/* Corner HUD Reticles */}
      <div className={TACTICAL_VIEW_STYLES.PreviewViewport_div_className_3} />
      <div className={TACTICAL_VIEW_STYLES.PreviewViewport_div_className_4} />
      <div className={TACTICAL_VIEW_STYLES.PreviewViewport_div_className_5} />
      <div className={TACTICAL_VIEW_STYLES.PreviewViewport_div_className_6} />

      {/* Tactical Watermark / OSD */}
      <div className={TACTICAL_VIEW_STYLES.PreviewViewport_div_className_7}>
        <span className={TACTICAL_VIEW_STYLES.PreviewViewport_span_className} />
        <span>EVIDENCE CAPTURE · {perspectiveLabel}</span>
      </div>

      {/* Click-to-expand overlay hint */}
      <div className={TACTICAL_VIEW_STYLES.PreviewViewport_div_className_8}>
        <div className={TACTICAL_VIEW_STYLES.PreviewViewport_div_className_9}>
          <Maximize2 className="w-4 h-4" />
          <span>CLICK TO EXPAND INSPECTOR</span>
        </div>
      </div>
    </div>
  );
};

export default PreviewViewport;
