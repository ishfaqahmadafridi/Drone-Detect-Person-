"use client";

import React from "react";
import { CameraWallModalProps } from "@/types";
import { CameraWallModalDialog } from "./dialog";
import { GroundSensorModal } from "./wizard/GroundSensorModal";
import { useCameraFleet } from "@/hooks/useCameraFleet";
import { useAppSelector } from "@/store";
import { useCameraWallModal } from "@/hooks";

export const CameraWallModal: React.FC<CameraWallModalProps> = ({
  isOpen,
  activeSource,
  activeCameraId = "CAM-01",
  connectedCameraIds = ["CAM-01", "CAM-02"],
  onClose,
  onSelectFeed,
  onToggleConnectCamera,
  onConnectAll,
  onConnectRtsp,
  onSetLayout,
}) => {
  const { cameras } = useCameraFleet();
  const viewMode = useAppSelector(state => state.telemetry.view_mode);
  const currentCameras = cameras.filter(camera => camera.viewMode === viewMode);
  const {
    isWizardOpen,
    setIsWizardOpen,
    handleLaunchSplit,
    handleConnectWizard,
  } = useCameraWallModal({ onSetLayout, onClose, onConnectRtsp });

  if (!isOpen) return null;

  return (
    <>
      {/* 1. Tactical Camera Wall Matrix Dialog */}
      <CameraWallModalDialog
        onClose={onClose}
        connectedCount={currentCameras.filter(camera => connectedCameraIds.includes(camera.id)).length}
        totalCount={currentCameras.length}
        onConnectAll={onConnectAll}
        onLaunchSplit={handleLaunchSplit}
        activeSource={activeSource}
        activeCameraId={activeCameraId}
        connectedCameraIds={connectedCameraIds}
        onSelectFeed={onSelectFeed}
        onToggleConnectCamera={onToggleConnectCamera}
        onOpenWizard={() => setIsWizardOpen(true)}
      />

      {/* 2. Standalone Ground Sensor Connection Wizard */}
      <GroundSensorModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onConnect={handleConnectWizard}
      />
    </>
  );
};

export default CameraWallModal;
export * from "./dialog";
export * from "./header";
export * from "./card";
export * from "./grid";
export * from "./wizard/GroundSensorWizard";
export * from "./wizard/GroundSensorModal";
export * from "./legacy";
