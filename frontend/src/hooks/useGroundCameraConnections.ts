import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store";
import { setConnectedCameras, setViewportLayout, setActiveCamera } from "@/store/slices/telemetrySlice";
import { cameraApi } from "@/services/api/cameraApi";
import { apiErrorMessage } from "@/utils/apiError";
import { useCameraFleet, CAMERA_FLEET_QUERY_KEY } from "./useCameraFleet";

export function useGroundCameraConnections() {
  const { cameras, error: fleetError } = useCameraFleet();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { connected_camera_ids, active_camera_id } = useAppSelector(state => state.telemetry);
  const groundCameras = cameras.filter(camera => camera.viewMode === "ground");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const connectCamera = (id: string) => {
    const primaryId = groundCameras.some(camera => camera.id === active_camera_id) ? active_camera_id : groundCameras[0]?.id;
    const ids = [...new Set([...connected_camera_ids, ...(primaryId ? [primaryId] : []), id])];
    dispatch(setConnectedCameras(ids));
    dispatch(setViewportLayout("dual"));
    if (!ids.includes(active_camera_id) || !groundCameras.some(camera => camera.id === active_camera_id)) {
      const camera = groundCameras.find(camera => camera.id === primaryId);
      if (camera) dispatch(setActiveCamera(camera));
    }
  };

  const addCamera = async (event: FormEvent) => {
    event.preventDefault();
    if (pending || !url.trim() || !name.trim()) return;
    setPending(true);
    setError("");
    try {
      const camera = await cameraApi.registerCamera({
        name: name.trim(), location: "Ground perimeter", view_mode: "ground", source_type: "rtsp",
        stream_url: url.trim(), device_type: "poe_cctv",
      });
      await queryClient.invalidateQueries({ queryKey: CAMERA_FLEET_QUERY_KEY });
      connectCamera(camera.id);
      setName("");
      setUrl("");
    } catch (failure) { setError(apiErrorMessage(failure)); }
    finally { setPending(false); }
  };

  return { groundCameras, connectedIds: connected_camera_ids, name, setName, url, setUrl, pending,
    error: error || (fleetError ? apiErrorMessage(fleetError) : ""), addCamera, connectCamera };
}
