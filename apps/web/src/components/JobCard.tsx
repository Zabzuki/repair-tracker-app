import { Job, JobStatus, statusOrder } from "@garage/shared";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Phone, Car, ChevronRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface JobCardProps {
  job: Job;
  onStatusChange: (id: string, status: JobStatus) => void;
  onViewDetails: (job: Job) => void;
}

export function JobCard({ job, onStatusChange, onViewDetails }: JobCardProps) {
  const currentStatusIndex = statusOrder.indexOf(job.status);
  const nextStatus =
    currentStatusIndex < statusOrder.length - 1
      ? statusOrder[currentStatusIndex + 1]
      : null;

  const getNextStatusLabel = () => {
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
  };

  return (
    <Card
      className="glass-card active:scale-[0.98] transition-transform touch-manipulation"
      onClick={() => onViewDetails(job)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header: Name + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base truncate">
              {job.customerName}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>{job.customerPhone}</span>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>

        {/* Car Info - Prominent */}
        <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
          <Car className="w-5 h-5 text-primary shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-mono font-bold text-sm">{job.licensePlate}</p>
            <p className="text-xs text-muted-foreground truncate">
              {job.carModel} • {job.carYear}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
        </div>

        {/* Problem - Truncated */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {job.problemDescription}
        </p>

        {/* Quick Action Button */}
        {nextStatus && job.status !== "done" && (
          <Button
            className="w-full h-12 text-sm font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(job.id, nextStatus);
            }}
          >
            {getNextStatusLabel()}
          </Button>
        )}

        {job.status === "done" && (
          <div className="text-center py-2 text-sm text-status-done font-medium">
            ✓ Ready for Pickup
          </div>
        )}
      </CardContent>
    </Card>
  );
}
