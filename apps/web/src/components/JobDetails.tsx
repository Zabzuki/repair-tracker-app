import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "./StatusBadge";
import {
  JobStatus,
  JobWithDetails,
  statusLabels,
  statusOrder,
} from "@garage/shared";
import {
  Phone,
  Car,
  Calendar,
  MessageSquare,
  Trash2,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { Mechanic } from "@garage/shared/src/mechanic";

type JobDetailsProps = {
  job: JobWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: JobStatus) => void;
  onDelete: (id: string) => void;
  mechanics: Mechanic[];
  onAssignMechanic: (jobId: string, mechanicId: string | null) => void;
};

export function JobDetails({
  job,
  open,
  onOpenChange,
  onStatusChange,
  onDelete,
  mechanics,
  onAssignMechanic,
}: JobDetailsProps) {
  if (!job) return null;

  const handleWhatsApp = () => {
    const phone = job.customer.phone.replace(/[^0-9]/g, "");
    const message = encodeURIComponent(
      `Hi ${job.customer.name}, this is regarding your ${job.car.model} (${job.car.licensePlate}).`,
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleCall = () => {
    window.open(`tel:${job.customer.phone}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-2xl overflow-y-auto"
      >
        <SheetHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <SheetTitle className="text-xl text-left">
              {job.customer.name}
            </SheetTitle>
            <StatusBadge status={job.status} />
          </div>
        </SheetHeader>

        <div className="space-y-5 pb-8">
          {/* Quick Contact - Large touch targets */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-14 text-base font-medium"
              onClick={handleCall}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call
            </Button>
            <Button
              variant="outline"
              className="h-14 text-base font-medium border-status-done/30 text-status-done"
              onClick={handleWhatsApp}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
          </div>

          {/* Vehicle Card */}
          <div className="p-4 bg-secondary rounded-xl space-y-2">
            <div className="flex items-center gap-3">
              <Car className="w-6 h-6 text-primary" />
              <span className="font-mono font-bold text-lg">
                {job.car.licensePlate}
              </span>
            </div>
            <p className="text-muted-foreground pl-9">
              {job.car.model} • {job.car.year}
            </p>
          </div>

          {/* Mechanic Assignment */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Assigned Mechanic
            </h3>
            <Select
              value={job.mechanicId || "unassigned"}
              onValueChange={(value) =>
                onAssignMechanic(job.id, value === "unassigned" ? null : value)
              }
            >
              <SelectTrigger className="h-14 text-base">
                <SelectValue placeholder="Select mechanic">
                  {job.mechanic ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: job.mechanic.color }}
                      >
                        {job.mechanic.name.charAt(0)}
                      </div>
                      <span>{job.mechanic.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-5 h-5" />
                      <span>Not assigned</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned" className="h-12 text-base">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-5 h-5" />
                    <span>Not assigned</span>
                  </div>
                </SelectItem>
                {mechanics.map((mechanic) => (
                  <SelectItem
                    key={mechanic.id}
                    value={mechanic.id}
                    className="h-12 text-base"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: mechanic.color }}
                      >
                        {mechanic.name.charAt(0)}
                      </div>
                      <span>{mechanic.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Problem */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Problem
            </h3>
            <p className="text-base leading-relaxed">
              {job.problemDescription}
            </p>
          </div>

          {/* Photos */}
          {job.photos.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Photos ({job.photos.length})
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {job.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Status Change */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Status
            </h3>
            <Select
              value={job.status}
              onValueChange={(value) =>
                onStatusChange(job.id, value as JobStatus)
              }
            >
              <SelectTrigger className="h-14 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOrder.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="h-12 text-base"
                  >
                    {statusLabels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timestamps */}
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Created: {format(job.createdAt, "PPp")}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Updated: {format(job.updatedAt, "PPp")}
            </div>
          </div>

          {/* Delete */}
          <Button
            variant="outline"
            className="w-full h-14 text-base text-destructive border-destructive/30"
            onClick={() => {
              onDelete(job.id);
              onOpenChange(false);
            }}
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Delete Job
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
