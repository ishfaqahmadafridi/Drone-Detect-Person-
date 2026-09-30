"use client";

import React, { useState } from "react";
import { PerimeterActionGridProps } from "@/types";
import {
  PerimeterZoomControl,
  PerimeterNightVisionButton,
  PerimeterReconnectButton,
  PerimeterSnapshotButton,
} from "./actions";

export const PerimeterActionGrid: React.FC<PerimeterActionGridProps> = ({
  onReconnectStream,
  onSnapshotTrigger,
}) => {
  const [activeZoom, setActiveZoom] = useState<number>(1.0);
  const [irEnabled, setIrEnabled] = useState<boolean>(true);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
      {/* 1. Optical Zoom Presets Selector */}
      <PerimeterZoomControl
        activeZoom={activeZoom}
        onZoomChange={setActiveZoom}
      />

      {/* 2. IR Night Vision Sensor Toggle */}
      <PerimeterNightVisionButton
        isEnabled={irEnabled}
        onToggle={() => setIrEnabled((prev) => !prev)}
      />

      {/* 3. Reconnect Stream / Cycle Connection */}
      <PerimeterReconnectButton onReconnect={onReconnectStream} />

      {/* 4. Forensic Snapshot Trigger */}
      <PerimeterSnapshotButton onSnapshot={onSnapshotTrigger} />
    </div>
  );
};

export default PerimeterActionGrid;
export * from "./actions";
