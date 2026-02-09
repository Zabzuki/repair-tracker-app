import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function ProblemField({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label>Problem *</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        required
      />
    </div>
  );
}
