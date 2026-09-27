"use client";

import { useContext } from "react";
import { AudioAlertContext } from "@/context/AudioAlertContext";
import { AudioAlertContextType } from "@/types";

export function useAudioAlert(): AudioAlertContextType {
  const context = useContext(AudioAlertContext);
  if (!context) {
    throw new Error("useAudioAlert must be used within an AudioAlertProvider");
  }
  return context;
}
