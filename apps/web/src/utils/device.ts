import { Device, generateDeviceId } from "@garage/shared";

const DEVICE_STORAGE_KEY = "garage_device";

export function getOrCreateDevice(name?: string): Device {
  const stored = localStorage.getItem(DEVICE_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored) as Device;
  }

  const newDevice: Device = {
    id: generateDeviceId(),
    name: name || "Unknown Device",
    lastSeen: Date.now(),
    active: true,
  };

  localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(newDevice));

  return newDevice;
}
