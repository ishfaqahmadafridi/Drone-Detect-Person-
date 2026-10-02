"use client";

import React from "react";
import { TacticalOverlaysProps } from "@/types";
import { CameraWallModal } from "../CameraWallModal";

export const TacticalOverlays: React.FC<TacticalOverlaysProps> = ({ wall }) => {
  return (
    <>
      {/* Multi-Sensor Camera Wall Modal & Simultaneous Stream Overlay */}
      <CameraWallModal
        isOpen={wall.isWallOpen}
        activeSource={wall.activeSource}
        activeCameraId={wall.activeCameraId}
        connectedCameraIds={wall.connectedCameraIds}
        onClose={wall.closeWall}
        onSelectFeed={wall.selectFeed}
        onToggleConnectCamera={wall.toggleConnect}
        onConnectAll={wall.connectAll}
        onConnectRtsp={wall.connectRtsp}
        onSetLayout={wall.setLayout}
      />
    </>
  );
};

export default TacticalOverlays;
