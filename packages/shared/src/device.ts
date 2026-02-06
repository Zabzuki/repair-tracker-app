// Represents a device registered to a shop for license/multi-device support

export interface Device {
  id: string;           // Unique device ID (generated on first launch)
  name: string;         // Human-readable name, e.g., "Front Desk PC" or "Mike's Phone"
  lastSeen?: number;     // Timestamp when device last synced with cloud
  active?: boolean;      // Is device currently active under license
}

/**
 * Generates a UUID v4 string
 * Used for device IDs
 */
export function generateDeviceId(): string {
  return crypto.randomUUID(); // Bun, browsers, Node.js all support this
}
