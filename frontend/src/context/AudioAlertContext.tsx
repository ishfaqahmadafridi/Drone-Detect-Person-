"use client";

import React, { createContext, useState, useCallback } from "react";
import { AudioAlertContextType, AudioAlertProviderProps } from "@/types";
import { audioSynthesizer } from "@/services/audio/audioSynthesizer";

export const AudioAlertContext = createContext<AudioAlertContextType | null>(null);

export const AudioAlertProvider: React.FC<AudioAlertProviderProps> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
    audioSynthesizer.initializeContext();
  }, []);

  const playIntrusionSiren = useCallback(() => {
    audioSynthesizer.playIntrusionSiren(isMuted);
  }, [isMuted]);

  const playWarningBeep = useCallback(() => {
    audioSynthesizer.playWarningBeep(isMuted);
  }, [isMuted]);

  return (
    <AudioAlertContext.Provider value={{ isMuted, toggleMute, playIntrusionSiren, playWarningBeep }}>
      {children}
    </AudioAlertContext.Provider>
  );
};
