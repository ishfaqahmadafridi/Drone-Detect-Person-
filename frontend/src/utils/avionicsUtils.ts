import { DOMAIN_BADGE_STYLES, BATTERY_THRESHOLDS } from "@/constants/tactical";
import { DroneAvionics } from "@/types";

/**
 * Returns tactical color styling tokens based on battery percentage level.
 */
export const getBatteryColor = (level: number): string => {
  if (level > BATTERY_THRESHOLDS.healthy) return DOMAIN_BADGE_STYLES.batteryHealthy;
  if (level > BATTERY_THRESHOLDS.warning) return DOMAIN_BADGE_STYLES.batteryWarning;
  return DOMAIN_BADGE_STYLES.batteryCritical;
};

/**
 * Returns tactical badge styling tokens based on UAV flight state.
 */
export const getFlightStateColor = (state: string): string => {
  switch (state.toUpperCase()) {
    case "AIRBORNE":
    case "PATROL":
      return DOMAIN_BADGE_STYLES.flightActive;
    case "HOVER":
      return DOMAIN_BADGE_STYLES.flightHover;
    case "RTL":
    case "LANDED":
      return DOMAIN_BADGE_STYLES.flightLanding;
    default:
      return DOMAIN_BADGE_STYLES.flightUnknown;
  }
};

/**
 * Normalizes avionics telemetry with safe defaults.
 */
export const normalizeAvionicsMetrics = (avionics?: DroneAvionics) => {
  const flightState = avionics?.flight_state || "UNKNOWN";
  const battery = avionics?.battery_percent ?? 0;

  return {
    flightState,
    battery,
    voltage: avionics?.battery_voltage ?? 0,
    health: avionics?.battery_health_percent ?? 0,
    altitude: avionics?.altitude_m ?? 0,
    speed: avionics?.ground_speed_ms ?? 0,
    sats: avionics?.gps_sats ?? 0,
    flightTime: avionics?.flight_time_remaining_min ?? 0,
    resolution: avionics?.camera_resolution ?? "Unknown",
    camOnline: avionics?.camera_online ?? false,
    camDetecting: avionics?.camera_detecting ?? false,
    isAirborne: isFlightAirborne(flightState),
    isBatteryLow: Boolean(avionics) && isBatteryCritical(battery),
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
  return percent < BATTERY_THRESHOLDS.critical;
};

