import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { JobFormInput } from "@garage/shared";
import { Camera, X, Plus } from "lucide-react";
import { Textarea } from "./ui/textarea";

type JobFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (job: JobFormInput) => void;
};

export function JobForm({ open, onOpenChange, onSubmit }: JobFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      customerName,
      customerPhone,
      licensePlate: licensePlate.toUpperCase(),
      carModel,
      carYear,
      problemDescription,
      status: "waiting",
      photos,
    });
    // Reset form
    setCustomerName("");
    setCustomerPhone("");
    setLicensePlate("");
    setCarModel("");
    setCarYear("");
    setProblemDescription("");
    setPhotos([]);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-2xl overflow-y-auto"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl">New Job Card</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pb-8">
          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Customer
            </h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="customerName">Name *</Label>
                <Input
                  id="customerName"
                  placeholder="John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
            </div>
          </div>

          {/* Car Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Vehicle
            </h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate *</Label>
                <Input
                  id="licensePlate"
                  placeholder="ABC-1234"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="h-12 font-mono uppercase text-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="carModel">Model *</Label>
                  <Input
                    id="carModel"
                    placeholder="Toyota Camry"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carYear">Year *</Label>
                  <Input
                    id="carYear"
                    placeholder="2022"
                    value={carYear}
                    onChange={(e) => setCarYear(e.target.value)}
                    className="h-12"
                    inputMode="numeric"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="space-y-2">
            <Label htmlFor="problemDescription">Problem *</Label>
            <Textarea
              id="problemDescription"
              placeholder="Describe the issue..."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              rows={3}
              className="text-base"
              required
            />
          </div>

          {/* Photos */}
          <div className="space-y-3">
            <Label>Photos (Optional)</Label>
            <div className="flex flex-wrap gap-3">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 rounded-lg overflow-hidden"
                >
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-foreground/60 rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-background" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground active:bg-secondary"
              >
                <Camera className="w-6 h-6" />
                <span className="text-xs">Add</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-14 text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-14 text-base font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Job
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
