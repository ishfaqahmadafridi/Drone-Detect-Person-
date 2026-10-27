"use client";
import type { ActiveCameraInfo } from "@/types";
export type { ActiveCameraInfo } from "@/types";


import { useAppSelector } from "@/store";
import { DEFAULT_TACTICAL_CAMERAS } from "@/constants/tactical";



/**
 * Custom hook providing centralized active camera metadata and dynamic sector tags.
 * Eliminates duplicate selector logic across HUD badges and headers (Strict DRY directive).
 */
export function useActiveCamera(): ActiveCameraInfo {
  const { active_camera_id, camera_name, camera_location, view_mode, source_type } =
    useAppSelector((state) => state.telemetry);

  const isGround = view_mode === "ground";
  const isSimulation = source_type === "synthetic";
  const fallback = DEFAULT_TACTICAL_CAMERAS.find(camera => camera.viewMode === view_mode);
  const camId = active_camera_id || fallback?.id || "";
  const camName = camera_name || fallback?.name || "";
  const camLoc = camera_location || fallback?.location || "";
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
