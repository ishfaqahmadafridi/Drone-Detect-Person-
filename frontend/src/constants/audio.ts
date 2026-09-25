/**
 * Tactical Audio Alert Configuration Constants
 */
export const AUDIO_ALERT_CONFIG = {
  INTRUSION_SIREN: {
    COOLDOWN_MS: 2500,
    INITIAL_GAIN: 0.12,
    FINAL_GAIN: 0.01,
    DURATION_SEC: 1.1,
    OSCILLATOR_TYPE: "sawtooth" as OscillatorType,
    FREQUENCIES: [
      { timeOffset: 0.0, freq: 880 },
      { timeOffset: 0.3, freq: 440 },
      { timeOffset: 0.6, freq: 920 },
      { timeOffset: 0.9, freq: 440 },
    ],
  },
  WARNING_BEEP: {
    COOLDOWN_MS: 3000,
    INITIAL_GAIN: 0.08,
    FINAL_GAIN: 0.01,
    DURATION_SEC: 0.4,
    OSCILLATOR_TYPE: "sine" as OscillatorType,
    FREQUENCIES: [
      { timeOffset: 0.0, freq: 587.33 },
      { timeOffset: 0.15, freq: 880.0 },
    ],
  },
} as const;
