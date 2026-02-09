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
import { JobStatus, JobWithDetails } from "@garage/shared";
import { Phone, Calendar, MessageSquare, Trash2, User } from "lucide-react";
import { format } from "date-fns";
import { Mechanic } from "@garage/shared/src/mechanic";
import { StatusSelect } from "./StatusSelect";
import { MechanicItem } from "./MechanicItem";
import { VehicleCard } from "./VehicleCard";

type JobDetailsProps = {
  job: JobWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: JobStatus) => void;
  onDelete: (id: string) => void;
  mechanics: Mechanic[];
  onAssignMechanic: (jobId: string, mechanicId: string | null) => void;
};

// --- Small Components ---

function MechanicSelect({
  mechanics,
  selectedId,
  onChange,
  assignedMechanic,
}: {
  mechanics: Mechanic[];
  selectedId: string;
  assignedMechanic?: Mechanic | null;
  onChange: (id: string | null) => void;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Assigned Mechanic
      </h3>
      <Select
        value={selectedId || "unassigned"}
        onValueChange={(value) =>
          onChange(value === "unassigned" ? null : value)
        }
      >
        <SelectTrigger className="h-14 text-base">
          <SelectValue placeholder="Select mechanic">
            {assignedMechanic ? (
              <MechanicItem
                name={assignedMechanic.name}
                color={assignedMechanic.color}
              />
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
          {mechanics.map((m) => (
            <SelectItem key={m.id} value={m.id} className="h-12 text-base">
              <MechanicItem name={m.name} color={m.color} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ContactButtons({
  phone,
  customerName,
  carModel,
  licensePlate,
}: {
  phone: string;
  customerName: string;
  carModel: string;
  licensePlate: string;
}) {
  const handleWhatsApp = () => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const message = encodeURIComponent(
      `Hi ${customerName}, this is regarding your ${carModel} (${licensePlate}).`,
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
  };

  const handleCall = () => {
    window.open(`tel:${phone}`);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        className="h-14 text-base font-medium"
        onClick={handleCall}
      >
        <Phone className="w-5 h-5 mr-2" /> Call
      </Button>
      <Button
        variant="outline"
        className="h-14 text-base font-medium border-status-done/30 text-status-done"
        onClick={handleWhatsApp}
      >
        <MessageSquare className="w-5 h-5 mr-2" /> WhatsApp
      </Button>
    </div>
  );
}

function PhotoGrid({ photos }: { photos: string[] }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Photos ({photos.length})
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, i) => (
          <img
            key={i}
            src={photo}
            alt={`Photo ${i + 1}`}
            className="w-full aspect-square object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}

function TimestampInfo({
  createdAt,
  updatedAt,
}: {
  createdAt: Date;
  updatedAt: Date;
}) {
  return (
    <div className="space-y-1 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" /> Created: {format(createdAt, "PPp")}
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" /> Updated: {format(updatedAt, "PPp")}
      </div>
    </div>
  );
}

// --- Main Component ---

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
            <StatusBadge status={job.status} className="mr-10" />
          </div>
        </SheetHeader>

        <div className="space-y-5 pb-8">
          <ContactButtons
            phone={job.customer.phone}
            customerName={job.customer.name}
            carModel={job.car.model}
            licensePlate={job.car.licensePlate}
          />

          <VehicleCard
            licensePlate={job.car.licensePlate}
            model={job.car.model}
            year={job.car.year}
          />

          <MechanicSelect
            mechanics={mechanics}
            selectedId={job.mechanicId || ""}
            assignedMechanic={job.mechanic}
            onChange={(id) => onAssignMechanic(job.id, id)}
          />

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Problem
            </h3>
            <p className="text-base leading-relaxed">
              {job.problemDescription}
            </p>
          </div>

          {job.photos.length > 0 && <PhotoGrid photos={job.photos} />}

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Status
            </h3>
            <StatusSelect
              value={job.status}
              onChange={(status) => onStatusChange(job.id, status)}
            />
          </div>

          <TimestampInfo createdAt={job.createdAt} updatedAt={job.updatedAt} />

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
