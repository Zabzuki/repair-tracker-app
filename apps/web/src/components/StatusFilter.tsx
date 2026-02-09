import { cn } from "@/utils/classNames";
import { JobStatus } from "@garage/shared";
import { Clock, Wrench, Package, CheckCircle2, LayoutGrid } from "lucide-react";

interface StatusFilterProps {
  activeFilter: JobStatus | "all";
  onFilterChange: (filter: JobStatus | "all") => void;
  counts: Record<JobStatus | "all", number>;
}

// Icon mapping
const filterConfig: Record<
  JobStatus | "all",
  { icon: typeof Clock; label: string; shortLabel: string }
> = {
  all: { icon: LayoutGrid, label: "All", shortLabel: "All" },
  waiting: { icon: Clock, label: "Waiting", shortLabel: "Wait" },
  "in-progress": { icon: Wrench, label: "In Progress", shortLabel: "Work" },
  "waiting-for-parts": { icon: Package, label: "Parts", shortLabel: "Parts" },
  done: { icon: CheckCircle2, label: "Done", shortLabel: "Done" },
};

const ACTIVE_BUTTON = "bg-primary text-primary-foreground";

// Badge when active (slightly transparent white)
const ACTIVE_BADGE = "bg-white/20 text-primary-foreground";

export function StatusFilter({
  activeFilter,
  onFilterChange,
  counts,
}: StatusFilterProps) {
  return (
    <div className="flex gap-2 min-w-max">
      {(Object.keys(filterConfig) as Array<JobStatus | "all">).map((filter) => {
        const { icon: Icon, shortLabel } = filterConfig[filter];
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={cn(
              "flex items-center gap-1.5 px-3 h-10 rounded-full text-sm font-medium transition-colors touch-manipulation",
              isActive
                ? ACTIVE_BUTTON
                : "bg-secondary text-secondary-foreground active:bg-secondary/70",
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{shortLabel}</span>

            <span
              className={cn(
                "min-w-5 h-5 px-1 rounded-full flex items-center justify-center text-xs font-bold",
                isActive ? ACTIVE_BADGE : "bg-background text-foreground",
              )}
            >
              {counts[filter] | 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
