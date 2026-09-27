"use client";

import { useContext } from "react";
import { WebSocketContext } from "@/context/WebSocketContext";
import { WebSocketContextType } from "@/types";

export function useWebSocketService(): WebSocketContextType {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketService must be used within a WebSocketProvider");
  }
  return context;
}
