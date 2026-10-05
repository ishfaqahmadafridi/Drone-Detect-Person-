import { useAppSelector, useAppDispatch } from "@/store";
import { setActiveCamera } from "@/store/slices/telemetrySlice";
import { UseViewportScreenReturn, TacticalCameraChannel } from "@/types";
import { useStreamMutation } from "@/services/queries/useStreamMutation";
import { streamApi } from "@/services/api/streamApi";
import { setSuspectPortraits } from "@/store/slices/uiSlice";

export const useViewportScreen = (): UseViewportScreenReturn => {
  const dispatch = useAppDispatch();
  const { switchView } = useStreamMutation();
  const zoomLevel = useAppSelector((state) => state.telemetry.zoom_level ?? 1.0);
  const isNightVision = useAppSelector((state) => state.telemetry.is_night_vision ?? false);
  const activeCameraId = useAppSelector((state) => state.telemetry.active_camera_id ?? "CAM-01");

  const handleSelectCamera = async (cam: TacticalCameraChannel) => {
    await streamApi.selectCamera(cam.id);
    if (cam.viewMode === "ground" && cam.id !== activeCameraId) dispatch(setSuspectPortraits([]));
    await switchView.mutateAsync(cam.viewMode);
    dispatch(
      setActiveCamera({
        id: cam.id,
        name: cam.name,
        location: cam.location,
        viewMode: cam.viewMode,
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
