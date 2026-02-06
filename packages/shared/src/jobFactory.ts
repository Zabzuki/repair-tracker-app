import type { Job } from "./job";

export function createJob(params: { plate: string; deviceId: string }): Job {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    plate: params.plate.toUpperCase(),
    deviceId: params.deviceId,
    status: "waiting",
    createdAt: now,
    updatedAt: now,
  };
}
