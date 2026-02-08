import { useEffect, useState } from "react";
import type { Job, JobStatus } from "@garage/shared";
import { fetchJobs, createJob, updateJobStatus, deleteJob } from "../api/jobs";

export type JobInput = Omit<Job, "id" | "createdAt" | "updatedAt">;

export function useJobs(deviceId: string, enabled: boolean) {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetchJobs().then(setJobs);
  }, []);

  async function addJob(jobInput: JobInput) {
    if (!enabled) return;

    const job = await createJob({
      licensePlate: jobInput.licensePlate, // map if needed
      deviceId,
      customerName: jobInput.customerName,
      customerPhone: jobInput.customerPhone,
      carModel: jobInput.carModel,
      carYear: jobInput.carYear,
      problemDescription: jobInput.problemDescription,
      status: jobInput.status,
      photos: jobInput.photos,
    });
    setJobs((prev) => [job, ...prev]);
  }

  async function updateStatus(id: string, status: JobStatus) {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, status, updatedAt: Date.now() } : job,
      ),
    );

    try {
      await updateJobStatus(id, status);
    } catch (err) {
      console.error("Failed to update job", err);
    }
  }

  async function removeJob(id: string) {
    await deleteJob(id);
    setJobs((prev) => prev.filter((job) => job.id !== id));
  }

  return { jobs, addJob, updateStatus, removeJob };
}
