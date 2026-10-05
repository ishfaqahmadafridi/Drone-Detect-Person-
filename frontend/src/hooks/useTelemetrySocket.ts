"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTelemetryData, setConnectionStatus } from "@/store/slices/telemetrySlice";
import { useAudioAlert } from "@/hooks/useAudioAlert";
import { isThreatDanger } from "@/utils/threatUtils";
import { getWebSocketTelemetryUrl, NETWORK_CONFIG } from "@/constants/network";
import { TelemetryData } from "@/types";

export function useTelemetrySocket() {
  const dispatch = useAppDispatch();
  const channel = useAppSelector(state => state.telemetry.view_mode) === "ground" ? "ground" : "aerial";
  const { playIntrusionSiren } = useAudioAlert();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectRef = useRef<() => void>(() => {});
  const sirenRef = useRef(playIntrusionSiren);

  useEffect(() => {
    sirenRef.current = playIntrusionSiren;
  }, [playIntrusionSiren]);

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // ignore
      }
    }

    const wsUrl = getWebSocketTelemetryUrl(channel);
    if (!wsUrl) return;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      dispatch(setConnectionStatus(true));
    };

    ws.onmessage = (event) => {
      if (wsRef.current !== ws) return;
      try {
        const data: TelemetryData = JSON.parse(event.data);
        dispatch(setTelemetryData(data));

        if (isThreatDanger(data.threat_level)) {
          sirenRef.current?.();
        }
      } catch (e) {
        console.error("WS Parse error", e);
      }
    };

    ws.onclose = () => {
      if (wsRef.current !== ws) return;
      dispatch(setConnectionStatus(false));
      reconnectTimeoutRef.current = setTimeout(() => {
        connectRef.current();
      }, NETWORK_CONFIG.WS_RECONNECT_INTERVAL_MS);
    };

    ws.onerror = () => {
      try {
        ws.close();
      } catch {
        // ignore
      }
    };
  }, [dispatch, channel]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    connect();
    return () => {
      const socket = wsRef.current;
      wsRef.current = null;
      socket?.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connect]);

  return {
    reconnect: connect,
  };
}
