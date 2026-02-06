export interface License {
  id: string;               // Shop license ID
  maxDevices: number;       // Maximum devices allowed
  devices?: string[];       // List of registered device IDs
  active: boolean;          // Is license active
}

export function isDeviceAllowed(license: License, deviceId: string): boolean {
  return license.active && (!license.devices || license.devices.includes(deviceId));
}
