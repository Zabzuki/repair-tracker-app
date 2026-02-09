import { JobStatus, JobWithDetails, statusOrder } from "@garage/shared";
import { Phone, ChevronRight, User } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { StatusBadge } from "../StatusBadge";
import { Button } from "../ui/button";
import { getNextStatus, getNextStatusLabel } from "./JobUtils";
import { VehicleCard } from "../VehicleCard";
import { MechanicItem } from "../MechanicItem";

type JobCardProps = {
  job: JobWithDetails;
  onStatusChange: (id: string, status: JobStatus) => void;
  onViewDetails: (job: JobWithDetails) => void;
};

export function JobCard({ job, onStatusChange, onViewDetails }: JobCardProps) {
  const nextStatus = getNextStatus(job.status, statusOrder);

  return (
    <Card className="pt-4" onClick={() => onViewDetails(job)}>
      <CardContent className="p-4 space-y-3">
        {/* Header: Name + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg truncate">
              {job.customer.name}
            </h3>
            <div className="flex items-center gap-1.5 text-m text-muted-foreground mt-0.5">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{job.customer.phone}</span>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>

        {/* Vehicle Card */}
        <VehicleCard
          licensePlate={job.car.licensePlate}
          model={job.car.model}
          year={job.car.year}
          trailingIcon={
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          }
        />

        {/* Mechanic Assignment */}
        {job.mechanic ? (
          <MechanicItem name={job.mechanic.name} color={job.mechanic.color} />
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-5 h-5" />
            <span>Not assigned</span>
          </div>
        )}

        {/* Problem - Truncated */}
        <p className="text-m text-muted-foreground line-clamp-2">
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
            {getNextStatusLabel(nextStatus)}
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
