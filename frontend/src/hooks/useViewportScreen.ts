import { useAppSelector, useAppDispatch } from "@/store";
import { setActiveCamera } from "@/store/slices/telemetrySlice";
import { UseViewportScreenReturn, TacticalCameraChannel } from "@/types";

export const useViewportScreen = (): UseViewportScreenReturn => {
  const dispatch = useAppDispatch();
  const zoomLevel = useAppSelector((state) => state.telemetry.zoom_level ?? 1.0);
  const isNightVision = useAppSelector((state) => state.telemetry.is_night_vision ?? false);
  const activeCameraId = useAppSelector((state) => state.telemetry.active_camera_id ?? "CAM-01");

  const handleSelectCamera = (cam: TacticalCameraChannel) => {
    dispatch(
      setActiveCamera({
        id: cam.id,
        name: cam.name,
        location: cam.location,
      })
    );
  };

  return {
    zoomLevel,
    isNightVision,
    activeCameraId,
    handleSelectCamera,
  };
};

export default useViewportScreen;
