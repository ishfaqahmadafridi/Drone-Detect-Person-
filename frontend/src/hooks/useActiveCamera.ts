"use client";

import { useAppSelector } from "@/store";

export interface ActiveCameraInfo {
  camId: string;
  camName: string;
  camLoc: string;
  isGround: boolean;
  isSimulation: boolean;
  sensorTag: string;
}

/**
 * Custom hook providing centralized active camera metadata and dynamic sector tags.
 * Eliminates duplicate selector logic across HUD badges and headers (Strict DRY directive).
 */
export function useActiveCamera(): ActiveCameraInfo {
  const { active_camera_id, camera_name, camera_location, view_mode, source_type } =
    useAppSelector((state) => state.telemetry);

  const isGround = view_mode === "ground";
  const isSimulation = source_type === "synthetic";
  const camId = active_camera_id || (isGround ? "CAM-02" : "CAM-01");
  const camName = camera_name || (isGround ? "Gate 01 Perimeter CCTV" : "UAV-01 Aerial Gimbal");
  const camLoc =
    camera_location || (isGround ? "North Perimeter - Gate 01" : "North Airspace - Sector 04");
  const sensorTag = `${camId} / ${camName.toUpperCase()} / ${camLoc.toUpperCase()}`;

  return {
    camId,
    camName,
    camLoc,
    isGround,
    isSimulation,
    sensorTag,
  };
}
