import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobStatus, statusLabels, statusOrder } from "@garage/shared";

type StatusSelectProps = {
  value: JobStatus;
  onChange: (status: JobStatus) => void;
  className?: string;
};

export function StatusSelect({
  value,
  onChange,
  className,
}: StatusSelectProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as JobStatus)}>
      <SelectTrigger className={`h-14 text-base ${className || ""}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOrder.map((status) => (
          <SelectItem key={status} value={status} className="h-12 text-base">
            {statusLabels[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
