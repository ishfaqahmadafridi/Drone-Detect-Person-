import { DroneAvionics } from "@/types";

/**
 * Returns tactical color styling tokens based on battery percentage level.
 */
export const getBatteryColor = (level: number): string => {
  if (level > 50) return "text-emerald-400 bg-emerald-500/20 border-emerald-500/40";
  if (level > 20) return "text-amber-400 bg-amber-500/20 border-amber-500/40";
  return "text-red-400 bg-red-500/20 border-red-500/40 animate-pulse";
};

/**
 * Returns tactical badge styling tokens based on UAV flight state.
 */
export const getFlightStateColor = (state: string): string => {
  switch (state.toUpperCase()) {
    case "AIRBORNE":
    case "PATROL":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
    case "HOVER":
      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/40";
    case "RTL":
    case "LANDED":
      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    default:
      return "bg-slate-800 text-slate-300 border-slate-700";
  }
};

/**
 * Normalizes avionics telemetry with safe defaults.
 */
export const normalizeAvionicsMetrics = (avionics?: DroneAvionics) => {
  const flightState = avionics?.flight_state || "AIRBORNE";
  const battery = avionics?.battery_percent ?? 88;

  return {
    flightState,
    battery,
    voltage: avionics?.battery_voltage ?? 24.8,
    health: avionics?.battery_health_percent ?? 98,
    altitude: avionics?.altitude_m ?? 42.5,
    speed: avionics?.ground_speed_ms ?? 8.4,
    sats: avionics?.gps_sats ?? 16,
    flightTime: avionics?.flight_time_remaining_min ?? 24,
    camOnline: avionics?.camera_online ?? true,
    camDetecting: avionics?.camera_detecting ?? true,
    isAirborne: isFlightAirborne(flightState),
    isBatteryLow: isBatteryCritical(battery),
  };
};

/**
 * Checks if the drone is currently airborne or on active patrol.
 */
export const isFlightAirborne = (state: string): boolean => {
  const s = state.toUpperCase();
  return s === "AIRBORNE" || s === "PATROL";
};

/**
 * Checks if the battery is in a low/critical condition (< 25%).
 */
export const isBatteryCritical = (percent: number): boolean => {
  return percent < 25;
};

