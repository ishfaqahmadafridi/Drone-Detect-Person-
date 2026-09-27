import { AUDIO_ALERT_CONFIG } from "@/constants/audio";

class AudioSynthesizer {
  private audioCtx: AudioContext | null = null;
  private lastIntrusionTime = 0;
  private lastWarningTime = 0;

  public initializeContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.audioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }

    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }

    return this.audioCtx;
  }

  public playIntrusionSiren(isMuted: boolean): void {
    if (isMuted) return;
    const now = Date.now();
    const config = AUDIO_ALERT_CONFIG.INTRUSION_SIREN;

    if (now - this.lastIntrusionTime < config.COOLDOWN_MS) return;
    this.lastIntrusionTime = now;

    const ctx = this.initializeContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = config.OSCILLATOR_TYPE;
      const t = ctx.currentTime;

      config.FREQUENCIES.forEach((point) => {
        if (point.timeOffset === 0) {
          osc.frequency.setValueAtTime(point.freq, t);
        } else {
          osc.frequency.exponentialRampToValueAtTime(point.freq, t + point.timeOffset);
        }
      });

      gain.gain.setValueAtTime(config.INITIAL_GAIN, t);
      gain.gain.exponentialRampToValueAtTime(config.FINAL_GAIN, t + config.DURATION_SEC);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + config.DURATION_SEC);
    } catch (e) {
      console.warn("Intrusion siren synthesis error", e);
    }
  }

  public playWarningBeep(isMuted: boolean): void {
    if (isMuted) return;
    const now = Date.now();
    const config = AUDIO_ALERT_CONFIG.WARNING_BEEP;

    if (now - this.lastWarningTime < config.COOLDOWN_MS) return;
    this.lastWarningTime = now;

    const ctx = this.initializeContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = config.OSCILLATOR_TYPE;
      const t = ctx.currentTime;

      config.FREQUENCIES.forEach((point) => {
        osc.frequency.setValueAtTime(point.freq, t + point.timeOffset);
      });

      gain.gain.setValueAtTime(config.INITIAL_GAIN, t);
      gain.gain.exponentialRampToValueAtTime(config.FINAL_GAIN, t + config.DURATION_SEC);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + config.DURATION_SEC);
    } catch (e) {
      console.warn("Warning beep synthesis error", e);
    }
  }
}

export const audioSynthesizer = new AudioSynthesizer();
