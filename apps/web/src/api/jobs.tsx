import { Job, JobStatus } from "@garage/shared";

const API_URL = "http://localhost:3001";

// GET /jobs
export async function fetchJobs(): Promise<Job[]> {
  const res = await fetch(`${API_URL}/jobs`);
  return res.json();
}

// POST /jobs
export async function createJob(job: {
  plate: string;
  deviceId: string;
}): Promise<Job> {
  const res = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
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
  return res.json();
}

// DELETE /jobs/:id
export async function deleteJob(id: string): Promise<Job> {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
