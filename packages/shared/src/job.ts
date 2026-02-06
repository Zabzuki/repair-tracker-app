// packages/shared/src/job.ts
export type JobStatus = "waiting" | "progress" | "parts" | "done";

export interface Job {
  id: string;
  plate: string;        // license plate (uppercase in factory)
  status: JobStatus;
  deviceId: string;     // which device created it
  createdAt: number;    // timestamp when job was created
  updatedAt: number;    // timestamp of last update
  customerName?: string; // optional, can be added later
}
