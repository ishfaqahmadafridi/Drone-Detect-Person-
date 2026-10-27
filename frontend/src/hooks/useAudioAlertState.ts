import { useState, useCallback } from "react";
import { audioSynthesizer } from "@/services/audio/audioSynthesizer";
import type { AudioAlertContextType } from "@/types";

export function useAudioAlertState(): AudioAlertContextType {
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

  return { isMuted, toggleMute, playIntrusionSiren, playWarningBeep };
}
