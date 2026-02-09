import { Car as CarIcon } from "lucide-react";

type VehicleCardProps = {
  licensePlate: string;
  model: string;
  year: number;
  trailingIcon?: React.ReactNode; // optional icon
};

export function VehicleCard({
  licensePlate,
  model,
  year,
  trailingIcon,
}: VehicleCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
      <CarIcon className="w-8 h-8 text-primary shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-mono font-bold text-m">{licensePlate}</p>
        <p className="text-s text-muted-foreground truncate">
          {model} • {year}
        </p>
      </div>
      {trailingIcon && <div className="shrink-0">{trailingIcon}</div>}
    </div>
  );
}
