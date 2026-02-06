import type { Job, JobStatus } from "@garage/shared"; // type-only import
import { createJob } from "@garage/shared"; // function (runtime import)
import { corsHeaders } from "./cors";

const jobs: Job[] = []; // in-memory job store

const server = Bun.serve({
  port: 3001,
  async fetch(req) {
    const url = new URL(req.url);

    // Handle preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // GET /jobs
    if (url.pathname === "/jobs" && req.method === "GET") {
      return new Response(JSON.stringify(jobs), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // POST /jobs
    if (url.pathname === "/jobs" && req.method === "POST") {
      try {
        const body = await req.json();

        if (!body.plate || !body.deviceId) {
          return new Response(
            JSON.stringify({ error: "plate and deviceId required" }),
            {
              status: 400,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            },
          );
        }

        const job = createJob({
          plate: body.plate,
          deviceId: body.deviceId,
        });

        jobs.push(job);

        return new Response(JSON.stringify(job), {
          status: 201,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }
    }

    // PATCH /jobs/:id
    if (url.pathname.startsWith("/jobs/") && req.method === "PATCH") {
      const id = url.pathname.split("/")[2];
      try {
        const body = await req.json();
        const job = jobs.find((job) => job.id === id);

        if (!job) {
          return new Response(JSON.stringify({ error: "Job not found" }), {
            status: 404,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          });
        }

        // Update only the status field if provided
        if (body.status) {
          job.status = body.status as JobStatus;
          job.updatedAt = Date.now();
        }

        return new Response(JSON.stringify(job), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }
    }

    // DELETE /jobs/:id
    if (url.pathname.startsWith("/jobs/") && req.method === "DELETE") {
      const id = url.pathname.split("/")[2];
      const index = jobs.findIndex((job) => job.id === id);

      if (index === -1) {
        return new Response(JSON.stringify({ error: "Job not found" }), {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }

      const deletedJob = jobs.splice(index, 1)[0];

      return new Response(JSON.stringify(deletedJob), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response("Garage API 🚗 running", {
      headers: corsHeaders,
    });
  },
});

console.log(`API running on http://localhost:${server.port}`);
