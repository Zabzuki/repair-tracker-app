import { JobStatus } from "@garage/shared";

export function getNextStatus(
  status: JobStatus,
  statusOrder: JobStatus[],
): JobStatus | null {
  const index = statusOrder.indexOf(status);
  return index < statusOrder.length - 1 ? statusOrder[index + 1] : null;
}

export function getNextStatusLabel(nextStatus: JobStatus | null): string {
  if (!nextStatus) return "";
  switch (nextStatus) {
    case "in-progress":
      return "Start Work";
    case "waiting-for-parts":
      return "Waiting Parts";
    case "done":
      return "Mark Done";
    default:
      return "";
  }
}
