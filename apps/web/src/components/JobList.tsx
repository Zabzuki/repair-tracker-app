import type { Job, JobStatus } from "@garage/shared";

const STATUS_FLOW: JobStatus[] = [
  "waiting",
  "in-progress",
  "waiting-for-parts",
  "done",
];

export function JobList({
  jobs,
  onStatusChange,
  onDelete,
}: {
  jobs: Job[];
  onStatusChange: (id: string, status: JobStatus) => void;
  onDelete: (id: string) => void;
}) {
  function nextStatus(current: JobStatus): JobStatus {
    const index = STATUS_FLOW.indexOf(current);
    return STATUS_FLOW[Math.min(index + 1, STATUS_FLOW.length - 1)];
  }

  return (
    <ul className="w-full space-y-3">
      {jobs.map((job) => {
        const isDone = job.status === "done";

        return (
          <li
            key={job.id}
            className={`border rounded p-4 flex items-center justify-between ${
              isDone ? "bg-green-50 opacity-70" : "bg-white"
            }`}
          >
            {/* licensePlate */}
            <span className="text-xl font-bold tracking-wide">
              {job.licensePlate}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Status button */}
              <button
                onClick={() => onStatusChange(job.id, nextStatus(job.status))}
                disabled={isDone}
                className={`px-3 py-1 rounded text-sm font-medium transition
                  ${
                    job.status === "waiting"
                      ? "bg-gray-200"
                      : job.status === "in-progress"
                        ? "bg-yellow-200"
                        : job.status === "waiting-for-parts"
                          ? "bg-orange-200"
                          : "bg-green-300"
                  }
                  ${isDone ? "cursor-default" : "hover:opacity-80"}
                `}
              >
                {job.status}
              </button>

              {/* Delete */}
              <button
                onClick={() => onDelete(job.id)}
                className="text-red-600 hover:text-red-800 text-lg"
                title="Delete job"
              >
                ✕
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
