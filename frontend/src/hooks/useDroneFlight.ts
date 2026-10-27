"use client";

import { useState } from "react";
import { normalizeAvionicsMetrics } from "@/utils/avionicsUtils";
import { DRONE_LINK } from "@/constants/tactical";
import { useMutation } from "@tanstack/react-query";
import { droneApi } from "@/services/api/droneApi";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTelemetryData } from "@/store/slices/telemetrySlice";
import { useStreamMutation } from "@/services/queries/useStreamMutation";

export function useDroneFlight() {
  const dispatch = useAppDispatch();
  const telemetry = useAppSelector((state) => state.telemetry);
  const avionics = telemetry.avionics;
  const metrics = normalizeAvionicsMetrics(avionics);

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
      setTimeout(() => setLastMessage(null), DRONE_LINK.messageDurationMs);
    },
    onError: (err: Error) => {
      setLastMessage(`Command error: ${err.message}`);
      setTimeout(() => setLastMessage(null), DRONE_LINK.messageDurationMs);
    },
  });

  const handleCommand = (action: string) => {
    commandMutation.mutate(action);
  };

  const handleConnectDroneLink = async (droneRtspUrl?: unknown) => {
    const validUrl =
      typeof droneRtspUrl === "string" && droneRtspUrl.trim().length > 0
        ? droneRtspUrl.trim()
        : DRONE_LINK.defaultRtspUrl;
    await switchView.mutateAsync("aerial");
    await switchSource.mutateAsync({
      sourceType: "rtsp",
      sourcePath: validUrl,
      channel: "aerial",
    });
    commandMutation.mutate(DRONE_LINK.connectAction);
  };

  const handleLaunchDroneFlight = async () => {
    await switchView.mutateAsync("aerial");
    await switchSource.mutateAsync({ sourceType: "synthetic", channel: "aerial" });
    commandMutation.mutate("takeoff");
  };

  return {
    avionics,
    flightState: metrics.flightState,
    altitude: metrics.altitude,
    batteryPercent: metrics.battery,
    batteryVoltage: metrics.voltage,
    batteryHealth: metrics.health,
    flightTimeRemaining: metrics.flightTime,
    cameraOnline: metrics.camOnline,
    cameraResolution: metrics.resolution,
    cameraDetecting: metrics.camDetecting,
    isCommandPending: commandMutation.isPending,
    lastMessage,
    handleCommand,
    handleConnectDroneLink,
    handleLaunchDroneFlight,
  };
}
