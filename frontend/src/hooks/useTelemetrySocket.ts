"use client";

import { useStore } from "react-redux";
import { useEffect, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTelemetryData, setConnectionStatus } from "@/store/slices/telemetrySlice";
import { useAudioAlert } from "@/hooks/useAudioAlert";
import { isThreatDanger } from "@/utils/threatUtils";
import { getWebSocketTelemetryUrl, NETWORK_CONFIG } from "@/constants/network";
import { RootState, TelemetryData } from "@/types";

export function useTelemetrySocket() {
  const dispatch = useAppDispatch();
  const appStore = useStore<RootState>();
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
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    dispatch(setConnectionStatus(false));

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
    const isCurrentSocket = () => wsRef.current === ws && appStore.getState().telemetry.view_mode === channel;

    ws.onopen = () => {
      if (!isCurrentSocket()) return;
      dispatch(setConnectionStatus(true));
    };

    ws.onmessage = (event) => {
      if (!isCurrentSocket()) return;
      try {
        const data: TelemetryData = JSON.parse(event.data);
        if (data.view_mode && data.view_mode !== channel) return;
        dispatch(setTelemetryData(data));

        if (isThreatDanger(data.threat_level)) {
          sirenRef.current?.();
        }
      } catch (e) {
        console.error("WS Parse error", e);
      }
    };

    ws.onclose = () => {
      if (!isCurrentSocket()) return;
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
  }, [dispatch, channel, appStore]);

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
