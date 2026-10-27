"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { ViewportSplitGridProps } from "@/types";
import { TacticalCameraFeedPreview } from "../CameraWallModal/card/TacticalCameraFeedPreview";
import { ArrowUpRight, CheckCircle2, X } from "lucide-react";
import { useViewportSplitGrid } from "@/hooks";

export const ViewportSplitGrid: React.FC<ViewportSplitGridProps> = ({
  layoutMode,
  activeCameraId,
  fps,
  onSelectCamera,
}) => {
  const {
    channelsToDisplay,
    gridClass,
    handlePromoteCamera,
    handleDisconnectCamera,
  } = useViewportSplitGrid({ layoutMode, onSelectCamera });

  return (
    <div className={`${TACTICAL_VIEW_STYLES.ViewportSplitGrid_div_className}${gridClass}`}>
      {channelsToDisplay.map((cam) => {
        const isCamActive = activeCameraId === cam.id;

        return (
          <div
            key={cam.id}
            className={`relative rounded-xl overflow-hidden border flex flex-col justify-between transition-all duration-200 ${
              isCamActive
                ? TACTICAL_VIEW_STYLES.ViewportSplitGrid_div_className_2
                : TACTICAL_VIEW_STYLES.ViewportSplitGrid_div_className_3
            }`}
          >
            {/* 1. Pane Header */}
            <div className={TACTICAL_VIEW_STYLES.ViewportSplitGrid_div_className_4}>
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isCamActive
                      ? TACTICAL_VIEW_STYLES.ViewportSplitGrid_span_className
                      : TACTICAL_VIEW_STYLES.OpticalSensorStatus_span_className_2
                  }`}
                />
                <span className={TACTICAL_VIEW_STYLES.ViewportSplitGrid_span_className_2}>
                  {cam.channelNum}: {cam.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isCamActive ? (
                  <span className={TACTICAL_VIEW_STYLES.CardHeader_span_className_5}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> PRIMARY ({fps} FPS)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePromoteCamera(cam)}
                    className={TACTICAL_VIEW_STYLES.ViewportSplitGrid_button_className}
                  >
                    <span>PROMOTE</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}

                {channelsToDisplay.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDisconnectCamera(cam.id)}
                    title="Disconnect camera from simultaneous multi-view"
                    className={TACTICAL_VIEW_STYLES.ViewportSplitGrid_button_className_2}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Visual Surveillance Feed Preview Window */}
            <div className={TACTICAL_VIEW_STYLES.ViewportSplitGrid_div_className_5}>
              <TacticalCameraFeedPreview
                channel={cam}
                isActive={isCamActive}
                className="w-full h-full rounded-md"
                onSelect={() => handlePromoteCamera(cam)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ViewportSplitGrid;
