"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { droneApi } from "@/services/api/droneApi";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTelemetryData } from "@/store/slices/telemetrySlice";
import { useStreamMutation } from "@/services/queries/useStreamMutation";

export function useDroneFlight() {
  const dispatch = useAppDispatch();
  const telemetry = useAppSelector((state) => state.telemetry);
  const avionics = telemetry.avionics;

  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const { switchSource, switchView } = useStreamMutation();

  const commandMutation = useMutation({
    mutationFn: async (action: string) => {
      const res = await droneApi.sendCommand(action);
      return res;
    },
    onSuccess: (data) => {
      setLastMessage(data.message);
      // Optimistically update avionics in Redux
      if (avionics) {
        dispatch(
          setTelemetryData({
            avionics: {
              ...avionics,
              flight_state: data.flight_state,
              altitude_m: data.altitude_m,
              battery_percent: data.battery_percent,
            },
          })
        );
      }
      setTimeout(() => setLastMessage(null), 4000);
    },
    onError: (err: Error) => {
      setLastMessage(`Command error: ${err.message}`);
      setTimeout(() => setLastMessage(null), 4000);
    },
  });

  const handleCommand = (action: string) => {
    commandMutation.mutate(action);
  };

  const handleConnectDroneLink = async (droneRtspUrl?: unknown) => {
    const validUrl =
      typeof droneRtspUrl === "string" && droneRtspUrl.trim().length > 0
        ? droneRtspUrl.trim()
        : "rtsp://192.168.1.1:8554/live";
    await switchSource.mutateAsync({
      sourceType: "rtsp",
      sourcePath: validUrl,
    });
    await switchView.mutateAsync("aerial");
    commandMutation.mutate("connect_drone_link");
  };

  const handleLaunchDroneFlight = async () => {
    await switchSource.mutateAsync({ sourceType: "synthetic" });
    await switchView.mutateAsync("aerial");
    commandMutation.mutate("takeoff");
  };

  return {
    avionics,
    flightState: avionics?.flight_state || "AIRBORNE",
    altitude: avionics?.altitude_m ?? 42.5,
    batteryPercent: avionics?.battery_percent ?? 88,
    batteryVoltage: avionics?.battery_voltage ?? 24.8,
    batteryHealth: avionics?.battery_health_percent ?? 98,
    flightTimeRemaining: avionics?.flight_time_remaining_min ?? 24,
    cameraOnline: avionics?.camera_online ?? true,
    cameraResolution: avionics?.camera_resolution ?? "1280x720 (HD)",
    cameraDetecting: avionics?.camera_detecting ?? true,
    isCommandPending: commandMutation.isPending,
    lastMessage,
    handleCommand,
    handleConnectDroneLink,
    handleLaunchDroneFlight,
  };
}
