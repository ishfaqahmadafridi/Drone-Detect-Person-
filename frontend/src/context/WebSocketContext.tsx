"use client";

import React, { createContext } from "react";
import { useTelemetrySocket } from "@/hooks/useTelemetrySocket";
import { WebSocketContextType, WebSocketProviderProps } from "@/types";

export const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { reconnect } = useTelemetrySocket();

  return (
    <WebSocketContext.Provider value={{ reconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
};
