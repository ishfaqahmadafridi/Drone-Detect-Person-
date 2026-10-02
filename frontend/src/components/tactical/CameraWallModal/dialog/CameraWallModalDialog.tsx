"use client";

import React from "react";
import { CameraWallModalDialogProps } from "@/types";
import { CameraWallHeader } from "../header";
import { CameraWallGrid } from "../grid";

export const CameraWallModalDialog: React.FC<CameraWallModalDialogProps> = ({
  onClose,
  connectedCount,
  totalCount,
  onConnectAll,
  onLaunchSplit,
  activeSource,
  activeCameraId,
  connectedCameraIds,
  onSelectFeed,
  onToggleConnectCamera,
  onOpenWizard,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-[#0F141F] max-w-5xl w-full rounded-2xl overflow-hidden border border-slate-700/80 flex flex-col max-h-[90vh] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* 1. Modal Tactical Header */}
        <CameraWallHeader
          onClose={onClose}
          connectedCount={connectedCount}
          totalCount={totalCount}
          onConnectAll={onConnectAll}
          onLaunchSplit={onLaunchSplit}
        />

        {/* 2. Tactical Sensor Matrix Grid */}
        <CameraWallGrid
          activeSource={activeSource}
          activeCameraId={activeCameraId}
          connectedCameraIds={connectedCameraIds}
          onSelectFeed={onSelectFeed}
          onToggleConnectCamera={onToggleConnectCamera}
          onLaunchSplit={onLaunchSplit}
          onOpenWizard={onOpenWizard}
        />
      </div>
    </div>
  );
};

export default CameraWallModalDialog;
