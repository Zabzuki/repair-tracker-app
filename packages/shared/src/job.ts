import type { Car } from "./car";
import type { Customer } from "./customer";
import type { Mechanic } from "./mechanic";

export type JobStatus =
  | "waiting"
  | "in-progress"
  | "waiting-for-parts"
  | "done";

export type Job = {
  id: string;
  customerId: string;
  carId: string;
  mechanicId: string | null;
  problemDescription: string;
  status: JobStatus;
  photos: string[];
  deviceId?: string; // which device created it
  createdAt: Date; // timestamp when job was created
  updatedAt: Date; // timestamp of last update
};

// Enriched job with resolved relationships for display
export type JobWithDetails = Job & {
  customer: Customer;
  car: Car;
  mechanic: Mechanic | null;
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
