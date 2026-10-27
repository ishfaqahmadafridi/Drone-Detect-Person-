"use client";

import React from "react";
import type { ChildrenProps } from "@/types";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";
import { QueryProvider } from "./QueryProvider";
import { AudioAlertProvider } from "@/context/AudioAlertContext";
import { WebSocketProvider } from "@/context/WebSocketContext";

export const AppProviders: React.FC<ChildrenProps> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <QueryProvider>
        <AudioAlertProvider>
          <WebSocketProvider>{children}</WebSocketProvider>
        </AudioAlertProvider>
      </QueryProvider>
    </ReduxProvider>
  );
};
