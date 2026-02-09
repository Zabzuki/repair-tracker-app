import { cn } from "@/utils/classNames";
import { JobStatus, statusLabels } from "@garage/shared";
import { Clock, Wrench, Package, CheckCircle2 } from "lucide-react";

type StatusBadgeProps = {
  status: JobStatus;
  className?: string;
};

const statusConfig: Record<
  JobStatus,
  { icon: React.FC<React.SVGProps<SVGSVGElement>>; className: string }
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
  const { icon: Icon, className: statusClass } = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-3xl px-3 py-1.5 text-s font-medium",
        statusClass,
        className,
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {statusLabels[status]}
    </span>
  );
}
