import { useMemo } from "react";
import { Mechanic } from "@garage/shared/src/mechanic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

type Props = {
  mechanics: Mechanic[];
  value: string;
  onChange: (id: string) => void;
};

export function MechanicSelect({ mechanics, value, onChange }: Props) {
  const mechanicMap = useMemo(
    () => Object.fromEntries(mechanics.map((m) => [m.id, m])),
    [mechanics],
  );

  const selected = mechanicMap[value];

  return (
    <div className="space-y-2">
      <Label>Assign Mechanic (Optional)</Label>

      <Select
        value={value || "none"}
        onValueChange={(val) => onChange(val === "none" ? "" : val)}
      >
        <SelectTrigger className="h-12">
          <SelectValue>
            {selected ? (
              <span>{selected.name}</span>
            ) : (
              <span className="text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Not assigned
              </span>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="none">Not assigned</SelectItem>
          {mechanics.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
