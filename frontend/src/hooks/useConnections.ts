import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store";
import { setActiveCamera, setConnectedCameras, setViewportLayout } from "@/store/slices/telemetrySlice";
import { cameraApi } from "@/services/api/cameraApi";
import { droneControlApi } from "@/services/api/droneControlApi";
import { apiErrorMessage } from "@/utils/apiError";
import { CONNECTIONS_UI } from "@/constants/tactical";
import { useCameraFleet, CAMERA_FLEET_QUERY_KEY } from "./useCameraFleet";
import type { ConnectionDetail } from "@/types";

export const DRONE_STATUS_QUERY_KEY = ["drone-control-status"] as const;

/** Read-only drone status: the flight panel owns the control session, so it is the only place that connects. */
export function useDroneConnectionStatus() {
  const { cameras } = useCameraFleet();
  const query = useQuery({
    queryKey: DRONE_STATUS_QUERY_KEY,
    queryFn: droneControlApi.status,
    refetchInterval: CONNECTIONS_UI.droneStatusPollMs,
  });
  const status = query.data;
  const droneCamera = cameras.find(camera => camera.viewMode === "aerial");
  const battery = status?.telemetry?.battery_percent;
  const details: ConnectionDetail[] = [
    { label: "Mode", value: status ? (status.mode === "tello" ? "Real Tello" : "Simulation") : "—" },
    { label: "Flight", value: status ? (status.flight_state === "airborne" ? "In the air" : status.flight_state === "landed" ? "Landed" : "Unknown") : "—" },
    { label: "Battery", value: battery != null ? `${battery}%` : "—" },
    { label: "Camera feed", value: droneCamera?.name ?? "—" },
  ];
  return {
    connected: Boolean(status?.connected),
    reachable: !query.isError,
    error: query.isError ? apiErrorMessage(query.error) : status?.error || "",
    details,
  };
}

/** Ground cameras shown together on the live page, plus registering new RTSP/HTTP cameras. */
export function useGroundConnections() {
  const { cameras, error: fleetError } = useCameraFleet();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { connected_camera_ids, primary_camera_ids } = useAppSelector(state => state.telemetry);
  const groundCameras = cameras.filter(camera => camera.viewMode === "ground");
  const mainId = primary_camera_ids.ground ?? groundCameras[0]?.id;
  const isConnected = (id: string) => id === mainId || connected_camera_ids.includes(id);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const connect = (id: string) => {
    const ids = [...new Set([...connected_camera_ids, ...(mainId ? [mainId] : []), id])];
    dispatch(setConnectedCameras(ids));
    dispatch(setViewportLayout(ids.length > 2 ? "quad" : "dual"));
    const main = groundCameras.find(camera => camera.id === mainId);
    if (main) dispatch(setActiveCamera(main));
  };

  const disconnect = (id: string) => {
    if (id === mainId) return; // The main view always shows one camera.
    const ids = connected_camera_ids.filter(item => item !== id);
    dispatch(setConnectedCameras(ids));
    dispatch(setViewportLayout(ids.length > 2 ? "quad" : ids.length > 1 ? "dual" : "single"));
  };

  const addCamera = async (event: FormEvent) => {
    event.preventDefault();
    if (pending || !url.trim() || !name.trim()) return;
    setPending(true);
    setError("");
    try {
      const camera = await cameraApi.registerCamera({
        name: name.trim(), location: "Ground perimeter", view_mode: "ground",
        source_type: /^https?:/i.test(url.trim()) ? "http" : "rtsp", stream_url: url.trim(), device_type: "poe_cctv",
      });
      await queryClient.invalidateQueries({ queryKey: CAMERA_FLEET_QUERY_KEY });
      connect(camera.id);
      setName("");
      setUrl("");
    } catch (failure) { setError(apiErrorMessage(failure)); }
    finally { setPending(false); }
  };

  return {
    groundCameras, mainId, isConnected,
    connectedCount: groundCameras.filter(camera => isConnected(camera.id)).length,
    connect, disconnect, addCamera, name, setName, url, setUrl, pending,
    error: error || (fleetError ? apiErrorMessage(fleetError) : ""),
  };
}
