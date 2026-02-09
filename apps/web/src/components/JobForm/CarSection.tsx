import { useState } from "react";
import { Car, CreateCarInput } from "@garage/shared/src/car";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, CarIcon } from "lucide-react";

type Props = {
  cars: Car[];
  selectedCarId: string;
  onChange: (id: string) => void;
  onAddCar: (input: CreateCarInput) => Car;
  customerId: string;
};

export function CarSection({
  cars,
  selectedCarId,
  onChange,
  onAddCar,
  customerId,
}: Props) {
  const [showNew, setShowNew] = useState(false);
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const handleAdd = () => {
    if (!plate || !model || !year) return;

    const car = onAddCar({
      customerId,
      licensePlate: plate.toUpperCase(),
      model,
      year: Number(year),
    });

    onChange(car.id);
    setPlate("");
    setModel("");
    setYear("");
    setShowNew(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase">
        Vehicle
      </h3>

      {!showNew ? (
        <div className="space-y-3">
          {cars.length > 0 ? (
            <Select value={selectedCarId} onValueChange={onChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                {cars.map((car) => (
                  <SelectItem key={car.id} value={car.id}>
                    <div className="flex items-center gap-2">
                      <CarIcon className="w-4 h-4" />
                      <span className="font-mono font-bold">
                        {car.licensePlate}
                      </span>
                      <span className="text-muted-foreground">
                        • {car.model}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground p-3 bg-secondary rounded-lg">
              No vehicles for this customer.
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full h-12"
            onClick={() => setShowNew(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Vehicle
          </Button>
        </div>
      ) : (
        <div className="space-y-3 p-4 bg-secondary rounded-lg">
          <div>
            <Label>License Plate *</Label>
            <Input value={plate} onChange={(e) => setPlate(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Model *</Label>
              <Input value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            <div>
              <Label>Year *</Label>
              <Input value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowNew(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              className="flex-1"
              disabled={!plate || !model || !year}
            >
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
