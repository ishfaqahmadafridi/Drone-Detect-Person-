"use client";

import React from "react";
import { useVideoViewport } from "@/hooks";
import { ViewportHeader } from "./ViewportHeader";
import { ViewportScreen } from "./ViewportScreen";
import { StreamToolbar } from "./StreamToolbar";
import { VideoViewportProps } from "@/types";

export const VideoViewport: React.FC<VideoViewportProps> = ({ onSnapshotTrigger }) => {
  const {
    sourceType,
    fps,
    isEditingZone,
    containerRef,
    canvasRef,
    fileInputRef,
    streamKey,
    rtspInput,
    setRtspInput,
    showRtspField,
    showUploadField,
    isUploading,
    isConnectingRtsp,
    toggleFullscreen,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleStartEditing,
    handleSaveAndClose,
    handleResetAndClose,
    handleCancel,
    handleFileUpload,
    handleRtspSubmit,
    handleSourceSelect,
    handleStreamError,
  } = useVideoViewport();

  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col border border-slate-800">
      <ViewportHeader
        sourceType={sourceType}
        isEditingZone={isEditingZone}
        onToggleEditZone={handleStartEditing}
        onSnapshotTrigger={onSnapshotTrigger}
        onToggleFullscreen={toggleFullscreen}
      />

      <ViewportScreen
        containerRef={containerRef}
        canvasRef={canvasRef}
        streamKey={streamKey}
        fps={fps}
        isEditingZone={isEditingZone}
        onStreamError={handleStreamError}
        onCanvasMouseDown={handleMouseDown}
        onCanvasMouseMove={handleMouseMove}
        onCanvasMouseUp={handleMouseUp}
        onSaveZone={handleSaveAndClose}
        onResetZone={handleResetAndClose}
        onCancelZone={handleCancel}
      />

      <StreamToolbar
        sourceType={sourceType}
        showUploadField={showUploadField}
        showRtspField={showRtspField}
        isUploading={isUploading}
        isConnectingRtsp={isConnectingRtsp}
        rtspInput={rtspInput}
        fileInputRef={fileInputRef}
        onSourceSelect={handleSourceSelect}
        onFileUpload={handleFileUpload}
        onRtspInputChange={setRtspInput}
        onRtspSubmit={handleRtspSubmit}
      />
    </div>
  );
};

export default VideoViewport;
