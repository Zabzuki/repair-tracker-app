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
import { CreateCustomerInput, Customer, Job } from "@garage/shared";
import { Camera, X, Plus, CarIcon, User } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Mechanic } from "@garage/shared/src/mechanic";
import { Car, CreateCarInput } from "@garage/shared/src/car";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type JobFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (jobData: Omit<Job, "id" | "createdAt" | "updatedAt">) => void;
  customers: Customer[];
  cars: Car[];
  mechanics: Mechanic[];
  getCustomerCars: (customerId: string) => Car[];
  onAddCustomer: (customer: CreateCustomerInput) => Customer;
  onAddCar: (car: CreateCarInput) => Car;
};

export function JobForm({
  open,
  onOpenChange,
  onSubmit,
  customers,
  mechanics,
  getCustomerCars,
  onAddCustomer,
  onAddCar,
}: JobFormProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedCarId, setSelectedCarId] = useState<string>("");
  const [selectedMechanicId, setSelectedMechanicId] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  // New customer/car form states
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");

  const [showNewCar, setShowNewCar] = useState(false);
  const [newCarLicensePlate, setNewCarLicensePlate] = useState("");
  const [newCarModel, setNewCarModel] = useState("");
  const [newCarYear, setNewCarYear] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get cars for selected customer
  const customerCars = selectedCustomerId
    ? getCustomerCars(selectedCustomerId)
    : [];

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

  const handleAddNewCustomer = () => {
    if (newCustomerName && newCustomerPhone) {
      const customer = onAddCustomer({
        name: newCustomerName,
        phone: newCustomerPhone,
      });
      setSelectedCustomerId(customer.id);
      setNewCustomerName("");
      setNewCustomerPhone("");
      setShowNewCustomer(false);
    }
  };

  const handleAddNewCar = () => {
    if (newCarLicensePlate && newCarModel && newCarYear && selectedCustomerId) {
      const car = onAddCar({
        customerId: selectedCustomerId,
        licensePlate: newCarLicensePlate.toUpperCase(),
        model: newCarModel,
        year: Number(newCarYear),
      });
      setSelectedCarId(car.id);
      setNewCarLicensePlate("");
      setNewCarModel("");
      setNewCarYear("");
      setShowNewCar(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedCarId) return;

    onSubmit({
      customerId: selectedCustomerId,
      carId: selectedCarId,
      mechanicId: selectedMechanicId || null,
      problemDescription,
      status: "waiting",
      photos,
    });

    // Reset form
    setSelectedCustomerId("");
    setSelectedCarId("");
    setSelectedMechanicId("");
    setProblemDescription("");
    setPhotos([]);
    onOpenChange(false);
  };

  const resetForm = () => {
    setSelectedCustomerId("");
    setSelectedCarId("");
    setSelectedMechanicId("");
    setProblemDescription("");
    setPhotos([]);
    setShowNewCustomer(false);
    setShowNewCar(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}
    >
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-2xl overflow-y-auto"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl">New Job Card</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pb-8">
          {/* Customer Selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Customer
            </h3>

            {!showNewCustomer ? (
              <div className="space-y-3">
                <Select
                  value={selectedCustomerId}
                  onValueChange={(value) => {
                    setSelectedCustomerId(value);
                    setSelectedCarId("");
                    setShowNewCar(false);
                  }}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem
                        key={customer.id}
                        value={customer.id}
                        className="h-12 text-base"
                      >
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {customer.phone}
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => setShowNewCustomer(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Customer
                </Button>
              </div>
            ) : (
              <div className="space-y-3 p-4 bg-secondary rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="newCustomerName">Name *</Label>
                  <Input
                    id="newCustomerName"
                    placeholder="John Doe"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newCustomerPhone">Phone *</Label>
                  <Input
                    id="newCustomerPhone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowNewCustomer(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={handleAddNewCustomer}
                    disabled={!newCustomerName || !newCustomerPhone}
                  >
                    Add Customer
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Car Selection (only if customer selected) */}
          {selectedCustomerId && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Vehicle
              </h3>

              {!showNewCar ? (
                <div className="space-y-3">
                  {customerCars.length > 0 && (
                    <Select
                      value={selectedCarId}
                      onValueChange={setSelectedCarId}
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {customerCars.map((car) => (
                          <SelectItem
                            key={car.id}
                            value={car.id}
                            className="h-12 text-base"
                          >
                            <div className="flex items-center gap-2">
                              <CarIcon className="w-4 h-4 text-primary" />
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
                  )}

                  {customerCars.length === 0 && (
                    <p className="text-sm text-muted-foreground p-3 bg-secondary rounded-lg">
                      No vehicles registered for this customer yet.
                    </p>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12"
                    onClick={() => setShowNewCar(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Vehicle
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 p-4 bg-secondary rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="newCarLicensePlate">License Plate *</Label>
                    <Input
                      id="newCarLicensePlate"
                      placeholder="ABC-1234"
                      value={newCarLicensePlate}
                      onChange={(e) => setNewCarLicensePlate(e.target.value)}
                      className="h-12 font-mono uppercase text-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="newCarModel">Model *</Label>
                      <Input
                        id="newCarModel"
                        placeholder="Toyota Camry"
                        value={newCarModel}
                        onChange={(e) => setNewCarModel(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newCarYear">Year *</Label>
                      <Input
                        id="newCarYear"
                        placeholder="2022"
                        value={newCarYear}
                        onChange={(e) => setNewCarYear(e.target.value)}
                        className="h-12"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowNewCar(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      className="flex-1"
                      onClick={handleAddNewCar}
                      disabled={
                        !newCarLicensePlate || !newCarModel || !newCarYear
                      }
                    >
                      Add Vehicle
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mechanic Assignment */}
          <div className="space-y-2">
            <Label>Assign Mechanic (Optional)</Label>
            <Select
              value={selectedMechanicId || "none"}
              onValueChange={(val) =>
                setSelectedMechanicId(val === "none" ? "" : val)
              }
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select mechanic">
                  {selectedMechanicId &&
                  mechanics.find((m) => m.id === selectedMechanicId) ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          backgroundColor: mechanics.find(
                            (m) => m.id === selectedMechanicId,
                          )?.color,
                        }}
                      >
                        {mechanics
                          .find((m) => m.id === selectedMechanicId)
                          ?.name.charAt(0)}
                      </div>
                      <span>
                        {
                          mechanics.find((m) => m.id === selectedMechanicId)
                            ?.name
                        }
                      </span>
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
                <SelectItem value="none" className="h-12 text-base">
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
              disabled={
                !selectedCustomerId || !selectedCarId || !problemDescription
              }
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Job
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
  // const [customerName, setCustomerName] = useState("");
  // const [customerPhone, setCustomerPhone] = useState("");
  // const [licensePlate, setLicensePlate] = useState("");
  // const [carModel, setCarModel] = useState("");
  // const [carYear, setCarYear] = useState("");
  // const [problemDescription, setProblemDescription] = useState("");
  // const [photos, setPhotos] = useState<string[]>([]);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  // const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (!files) return;

  //   Array.from(files).forEach((file) => {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       if (event.target?.result) {
  //         setPhotos((prev) => [...prev, event.target!.result as string]);
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // };

  // const removePhoto = (index: number) => {
  //   setPhotos((prev) => prev.filter((_, i) => i !== index));
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   onSubmit({
  //     customerName,
  //     customerPhone,
  //     licensePlate: licensePlate.toUpperCase(),
  //     carModel,
  //     carYear,
  //     problemDescription,
  //     status: "waiting",
  //     photos,
  //   });
  //   // Reset form
  //   setCustomerName("");
  //   setCustomerPhone("");
  //   setLicensePlate("");
  //   setCarModel("");
  //   setCarYear("");
  //   setProblemDescription("");
  //   setPhotos([]);
  //   onOpenChange(false);
  // };

  // return (
  //   <Sheet open={open} onOpenChange={onOpenChange}>
  //     <SheetContent
  //       side="bottom"
  //       className="h-[90vh] rounded-t-2xl overflow-y-auto"
  //     >
  //       <SheetHeader className="pb-4">
  //         <SheetTitle className="text-xl">New Job Card</SheetTitle>
  //       </SheetHeader>

  //       <form onSubmit={handleSubmit} className="space-y-5 pb-8">
  //         {/* Customer Info */}
  //         <div className="space-y-4">
  //           <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
  //             Customer
  //           </h3>
  //           <div className="space-y-3">
  //             <div className="space-y-2">
  //               <Label htmlFor="customerName">Name *</Label>
  //               <Input
  //                 id="customerName"
  //                 placeholder="John Doe"
  //                 value={customerName}
  //                 onChange={(e) => setCustomerName(e.target.value)}
  //                 className="h-12"
  //                 required
  //               />
  //             </div>
  //             <div className="space-y-2">
  //               <Label htmlFor="customerPhone">Phone *</Label>
  //               <Input
  //                 id="customerPhone"
  //                 type="tel"
  //                 placeholder="+1 234 567 8900"
  //                 value={customerPhone}
  //                 onChange={(e) => setCustomerPhone(e.target.value)}
  //                 className="h-12"
  //                 required
  //               />
  //             </div>
  //           </div>
  //         </div>

  //         {/* Car Info */}
  //         <div className="space-y-4">
  //           <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
  //             Vehicle
  //           </h3>
  //           <div className="space-y-3">
  //             <div className="space-y-2">
  //               <Label htmlFor="licensePlate">License Plate *</Label>
  //               <Input
  //                 id="licensePlate"
  //                 placeholder="ABC-1234"
  //                 value={licensePlate}
  //                 onChange={(e) => setLicensePlate(e.target.value)}
  //                 className="h-12 font-mono uppercase text-lg"
  //                 required
  //               />
  //             </div>
  //             <div className="grid grid-cols-2 gap-3">
  //               <div className="space-y-2">
  //                 <Label htmlFor="carModel">Model *</Label>
  //                 <Input
  //                   id="carModel"
  //                   placeholder="Toyota Camry"
  //                   value={carModel}
  //                   onChange={(e) => setCarModel(e.target.value)}
  //                   className="h-12"
  //                   required
  //                 />
  //               </div>
  //               <div className="space-y-2">
  //                 <Label htmlFor="carYear">Year *</Label>
  //                 <Input
  //                   id="carYear"
  //                   placeholder="2022"
  //                   value={carYear}
  //                   onChange={(e) => setCarYear(e.target.value)}
  //                   className="h-12"
  //                   inputMode="numeric"
  //                   required
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Problem Description */}
  //         <div className="space-y-2">
  //           <Label htmlFor="problemDescription">Problem *</Label>
  //           <Textarea
  //             id="problemDescription"
  //             placeholder="Describe the issue..."
  //             value={problemDescription}
  //             onChange={(e) => setProblemDescription(e.target.value)}
  //             rows={3}
  //             className="text-base"
  //             required
  //           />
  //         </div>

  //         {/* Photos */}
  //         <div className="space-y-3">
  //           <Label>Photos (Optional)</Label>
  //           <div className="flex flex-wrap gap-3">
  //             {photos.map((photo, index) => (
  //               <div
  //                 key={index}
  //                 className="relative w-20 h-20 rounded-lg overflow-hidden"
  //               >
  //                 <img
  //                   src={photo}
  //                   alt={`Photo ${index + 1}`}
  //                   className="w-full h-full object-cover"
  //                 />
  //                 <button
  //                   type="button"
  //                   onClick={() => removePhoto(index)}
  //                   className="absolute top-1 right-1 w-6 h-6 bg-foreground/60 rounded-full flex items-center justify-center"
  //                 >
  //                   <X className="w-4 h-4 text-background" />
  //                 </button>
  //               </div>
  //             ))}
  //             <button
  //               type="button"
  //               onClick={() => fileInputRef.current?.click()}
  //               className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground active:bg-secondary"
  //             >
  //               <Camera className="w-6 h-6" />
  //               <span className="text-xs">Add</span>
  //             </button>
  //             <input
  //               ref={fileInputRef}
  //               type="file"
  //               accept="image/*"
  //               capture="environment"
  //               multiple
  //               onChange={handlePhotoUpload}
  //               className="hidden"
  //             />
  //           </div>
  //         </div>

  //         {/* Submit */}
  //         <div className="flex gap-3 pt-4">
  //           <Button
  //             type="button"
  //             variant="outline"
  //             onClick={() => onOpenChange(false)}
  //             className="flex-1 h-14 text-base"
  //           >
  //             Cancel
  //           </Button>
  //           <Button
  //             type="submit"
  //             className="flex-1 h-14 text-base font-semibold"
  //           >
  //             <Plus className="w-5 h-5 mr-2" />
  //             Create Job
  //           </Button>
  //         </div>
  //       </form>
  //     </SheetContent>
  //   </Sheet>
  // );
}
