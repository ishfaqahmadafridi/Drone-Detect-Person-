"use client";

import React from "react";
import { StreamToolbarProps } from "@/types";
import { StreamSourceSelector } from "./StreamSourceSelector";
import { PerspectiveToggle } from "./PerspectiveToggle";
import { StreamUploadForm } from "./StreamUploadForm";
import { StreamRtspForm } from "./StreamRtspForm";

export const StreamToolbar: React.FC<StreamToolbarProps> = ({
  sourceType,
  viewMode = "aerial",
  showUploadField,
  showRtspField,
  isUploading,
  isConnectingRtsp,
  rtspInput,
  fileInputRef,
  onSourceSelect,
  onViewSelect,
  onFileUpload,
  onRtspInputChange,
  onRtspSubmit,
}) => {
  return (
    <div className="p-3 px-4 bg-slate-950/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-4">
        {/* Stream Source Selector */}
        <StreamSourceSelector
          sourceType={sourceType}
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

      {/* Video Upload Field */}
      <StreamUploadForm
        show={showUploadField}
        isUploading={isUploading}
        fileInputRef={fileInputRef}
        onFileUpload={onFileUpload}
      />

      {/* Custom RTSP Stream Field */}
      <StreamRtspForm
        show={showRtspField}
        isConnectingRtsp={isConnectingRtsp}
        rtspInput={rtspInput}
        onRtspInputChange={onRtspInputChange}
        onRtspSubmit={onRtspSubmit}
      />
    </div>
  );
};

export default StreamToolbar;
