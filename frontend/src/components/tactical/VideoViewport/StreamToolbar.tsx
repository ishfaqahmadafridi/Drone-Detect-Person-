"use client";

import React from "react";
import { StreamToolbarProps } from "@/types";
import { StreamSourceSelector } from "./StreamSourceSelector";
import { PerspectiveToggle } from "./PerspectiveToggle";
import { StreamRtspForm } from "./StreamRtspForm";

export const StreamToolbar: React.FC<StreamToolbarProps> = ({
  sourceType,
  viewMode = "aerial",
  showRtspField,
  isConnectingRtsp,
  rtspInput,
  onSourceSelect,
  onViewSelect,
  onRtspInputChange,
  onRtspSubmit,
}) => {
  return (
    <div className="p-3 px-4 bg-slate-950/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-4">
        {/* Stream Source Selector */}
        <StreamSourceSelector
          sourceType={sourceType}
          viewMode={viewMode}
          onSourceSelect={onSourceSelect}
        />

        {/* View Mode Toggle: Aerial vs Ground */}
        {onViewSelect && (
          <PerspectiveToggle
            viewMode={viewMode}
            onViewSelect={onViewSelect}
          />
        )}
      </div>

      {/* Custom RTSP / Phone Stream Field */}
      <StreamRtspForm
        show={showRtspField}
        isConnectingRtsp={isConnectingRtsp}
        rtspInput={rtspInput}
        onRtspInputChange={onRtspInputChange}
        onRtspSubmit={onRtspSubmit}
        placeholder={
          viewMode === "ground"
            ? "http://10.10.20.117:8080 (Phone IP)"
            : "rtsp://drone-ip:8554/live"
        }
        buttonLabel={viewMode === "ground" ? "Connect Phone" : "Connect Drone"}
      />
    </div>
  );
};

export default StreamToolbar;
