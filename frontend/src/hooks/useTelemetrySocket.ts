"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppDispatch } from "@/store";
import { setTelemetryData, setConnectionStatus } from "@/store/slices/telemetrySlice";
import { useAudioAlert } from "@/hooks/useAudioAlert";
import { isThreatDanger, isThreatWarning } from "@/utils/threatUtils";
import { getWebSocketTelemetryUrl, NETWORK_CONFIG } from "@/constants/network";
import { TelemetryData } from "@/types";

export function useTelemetrySocket() {
  const dispatch = useAppDispatch();
  const { playIntrusionSiren, playWarningBeep } = useAudioAlert();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastThreatRef = useRef<string>("CLEAR");
  const connectRef = useRef<() => void>(() => {});

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;

    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsUrl = getWebSocketTelemetryUrl();
    if (!wsUrl) return;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      dispatch(setConnectionStatus(true));
    };

    ws.onmessage = (event) => {
      try {
        const data: TelemetryData = JSON.parse(event.data);
        dispatch(setTelemetryData(data));

        if (isThreatDanger(data.threat_level)) {
          playIntrusionSiren();
        } else if (
          isThreatWarning(data.threat_level) &&
          lastThreatRef.current !== data.threat_level
        ) {
          playWarningBeep();
        }
        lastThreatRef.current = data.threat_level;
      } catch (e) {
        console.error("WS Parse error", e);
      }
    };

    ws.onclose = () => {
      dispatch(setConnectionStatus(false));
      reconnectTimeoutRef.current = setTimeout(() => {
        connectRef.current();
      }, NETWORK_CONFIG.WS_RECONNECT_INTERVAL_MS);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [dispatch, playIntrusionSiren, playWarningBeep]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connect]);

  return {
    reconnect: connect,
  };
}
