import { GROUND_SENSOR_DEFAULTS, GROUND_PHONE_PRESET } from "@/constants/tactical";
import type { GroundSensorConfigState } from "@/types";

export function groundSensorValidity(config: GroundSensorConfigState) {
  const isUsb = config.connectionType === "wired" && config.wiredSubtype === "usb_direct";
  const host = Boolean(config.host?.trim());
  const port = Number.isInteger(Number(config.port)) && Number(config.port) >= 1 && Number(config.port) <= 65535;
  const streamPath = Boolean(config.streamPath?.trim());
  const usb = !isUsb || Boolean(config.usbDeviceIndex?.trim());
  return { isUsb, host, port, streamPath, usb, valid: isUsb ? usb : host && port && streamPath };
}

export function groundSensorUrl(config: GroundSensorConfigState): string {
  if (groundSensorValidity(config).isUsb) return config.usbDeviceIndex || GROUND_SENSOR_DEFAULTS.usbDeviceIndex;
  const phone = config.deviceCategory === "mobile_phone";
  const port = config.port || (phone ? GROUND_PHONE_PRESET.port : GROUND_SENSOR_DEFAULTS.port);
  const path = config.streamPath.startsWith("/") ? config.streamPath : `/${config.streamPath}`;
  const auth = !phone && config.username
    ? `${encodeURIComponent(config.username)}${config.password ? `:${encodeURIComponent(config.password)}` : ""}@` : "";
  return `${phone ? "http" : "rtsp"}://${auth}${config.host}:${port}${path}`;
}
