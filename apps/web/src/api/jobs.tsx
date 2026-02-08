import { Job, JobStatus } from "@garage/shared";

const API_URL = "http://localhost:3001";

/**
 * Input type for creating a job.
 * Server is responsible for id / timestamps.
 */
export type CreateJobInput = Omit<Job, "id" | "createdAt" | "updatedAt">;

// GET /jobs
export async function fetchJobs(): Promise<Job[]> {
  const res = await fetch(`${API_URL}/jobs`);

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}

// POST /jobs
export async function createJob(job: CreateJobInput): Promise<Job> {
  const res = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });

  if (!res.ok) {
    throw new Error("Failed to create job");
  }

  return res.json();
}

// PATCH /jobs/:id
export async function updateJobStatus(
  id: string,
  status: JobStatus,
): Promise<Job> {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Failed to update job status");
  }

  return res.json();
}

// DELETE /jobs/:id
export async function deleteJob(id: string): Promise<Job> {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete job");
  }

  return res.json();
}
