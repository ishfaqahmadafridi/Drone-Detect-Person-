"use client";

import React, { createContext } from "react";
import { AudioAlertContextType, AudioAlertProviderProps } from "@/types";
import { useAudioAlertState } from "@/hooks/useAudioAlertState";

export const AudioAlertContext = createContext<AudioAlertContextType | null>(null);

export const AudioAlertProvider: React.FC<AudioAlertProviderProps> = ({ children }) => {
  const value = useAudioAlertState();

  return (
    <AudioAlertContext.Provider value={value}>
      {children}
    </AudioAlertContext.Provider>
  );
};
