"use client";

import React from "react";
import { PerimeterActionGridProps } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { setZoomLevel, toggleNightVision } from "@/store/slices/telemetrySlice";
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
  const dispatch = useAppDispatch();
  const activeZoom = useAppSelector((state) => state.telemetry.zoom_level ?? 1.0);
  const irEnabled = useAppSelector((state) => state.telemetry.is_night_vision ?? false);

  const handleZoomChange = (zoom: number) => {
    dispatch(setZoomLevel(zoom));
  };

  const handleToggleIr = () => {
    dispatch(toggleNightVision());
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
      {/* 1. Optical Zoom Presets Selector */}
      <PerimeterZoomControl
        activeZoom={activeZoom}
        onZoomChange={handleZoomChange}
      />

      {/* 2. IR Night Vision Sensor Toggle */}
      <PerimeterNightVisionButton
        isEnabled={irEnabled}
        onToggle={handleToggleIr}
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
