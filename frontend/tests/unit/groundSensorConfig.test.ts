import { expect, it } from "vitest";
import { GROUND_SENSOR_DEFAULTS, GROUND_PHONE_PRESET } from "@/constants/tactical";
import { groundSensorUrl, groundSensorValidity } from "@/utils/groundSensorConfig";

it("shares network validation and rejects invalid ports", () => {
  expect(groundSensorValidity(GROUND_SENSOR_DEFAULTS).valid).toBe(true);
  expect(groundSensorValidity({ ...GROUND_SENSOR_DEFAULTS, port: 65536 }).valid).toBe(false);
  expect(groundSensorValidity({ ...GROUND_SENSOR_DEFAULTS, port: 2.5 }).valid).toBe(false);
});

it("uses USB device paths without requiring network fields", () => {
  const config = { ...GROUND_SENSOR_DEFAULTS, wiredSubtype: "usb_direct" as const, host: "", port: 0 };
  expect(groundSensorValidity(config).valid).toBe(true);
  expect(groundSensorUrl(config)).toBe(config.usbDeviceIndex);
});

it("encodes credentials and builds phone URLs from the configured preset", () => {
  const config = { ...GROUND_SENSOR_DEFAULTS, username: "user@local", password: "p:a/ss" };
  expect(groundSensorUrl(config)).toContain("user%40local:p%3Aa%2Fss@");
  const phone = { ...GROUND_SENSOR_DEFAULTS, ...GROUND_PHONE_PRESET, deviceCategory: "mobile_phone" as const };
  expect(groundSensorUrl(phone)).toBe(`http://${phone.host}:${phone.port}${phone.streamPath}`);
});
