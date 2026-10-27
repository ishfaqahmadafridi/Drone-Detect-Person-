import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setActiveCamera, setViewportLayout } from "@/store/slices/telemetrySlice";
import { useStreamMutation } from "@/services/queries/useStreamMutation";
import { useCameraFleet } from "./useCameraFleet";
import type { StreamChannel } from "@/types";

export function usePerspectiveSelection() {
  const dispatch = useAppDispatch();
  const { primary_camera_ids, connected_camera_ids } = useAppSelector(state => state.telemetry);
  const { cameras } = useCameraFleet();
  const { switchView } = useStreamMutation();
  return useCallback(async (view: StreamChannel) => {
    await switchView.mutateAsync(view);
    const camera = cameras.find(item => item.id === primary_camera_ids[view]);
    if (camera) dispatch(setActiveCamera(camera));
    const count = cameras.filter(item => item.viewMode === view && connected_camera_ids.includes(item.id)).length;
    dispatch(setViewportLayout(count > 1 ? "dual" : "single"));
  }, [cameras, connected_camera_ids, dispatch, primary_camera_ids, switchView]);
}
