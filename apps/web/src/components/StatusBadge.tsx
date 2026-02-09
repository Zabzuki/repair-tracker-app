import { cn } from "@/utils/classNames";
import { JobStatus, statusLabels } from "@garage/shared";
import { Clock, Wrench, Package, CheckCircle2 } from "lucide-react";

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

const statusConfig: Record<
  JobStatus,
  { icon: typeof Clock; className: string }
> = {
  waiting: {
    icon: Clock,
    className: "bg-status-waiting text-status-waiting-foreground",
  },
  "in-progress": {
    icon: Wrench,
    className: "bg-status-in-progress text-status-in-progress-foreground",
  },
  "waiting-for-parts": {
    icon: Package,
    className: "bg-status-parts text-status-parts-foreground",
  },
  done: {
    icon: CheckCircle2,
    className: "bg-status-done text-status-done-foreground",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-3xl px-3 py-1.5 text-s font-medium status-badge",
        config.className,
        className,
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {statusLabels[status]}
    </span>
  );
}
