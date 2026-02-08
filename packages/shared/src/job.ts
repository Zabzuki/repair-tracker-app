// packages/shared/src/job.ts
export type JobStatus =
  | "waiting"
  | "in-progress"
  | "waiting-for-parts"
  | "done";

export type Job = {
  id: string;
  customerName: string;
  customerPhone: string;
  carModel: string;
  carYear: string;
  problemDescription: string;
  photos: string[];
  licensePlate: string; // license plate (uppercase in factory)
  status: JobStatus;
  deviceId: string; // which device created it
  createdAt: number; // timestamp when job was created
  updatedAt: number; // timestamp of last update
};

export type JobFormInput = Omit<
  Job,
  "id" | "createdAt" | "updatedAt" | "deviceId"
>;

export const statusLabels: Record<JobStatus, string> = {
  waiting: "Waiting",
  "in-progress": "In Progress",
  "waiting-for-parts": "Waiting for Parts",
  done: "Done",
};

export const statusOrder: JobStatus[] = [
  "waiting",
  "in-progress",
  "waiting-for-parts",
  "done",
];
