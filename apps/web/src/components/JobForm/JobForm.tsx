import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CustomerSection } from "./CustomerSection";
import { CarSection } from "./CarSection";
import { MechanicSelect } from "./MechanicSelect";
import { ProblemField } from "./ProblemField";
import { PhotoUploader } from "./PhotoUploader";
import { Car, CreateCarInput } from "@garage/shared/src/car";
import { CreateCustomerInput, Customer, Job } from "@garage/shared";
import { Mechanic } from "@garage/shared/src/mechanic";
import { useJobForm } from "@/hooks/useJobForm";

type JobFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (jobData: Omit<Job, "id" | "createdAt" | "updatedAt">) => void;
  customers: Customer[];
  cars: Car[];
  mechanics: Mechanic[];
  getCustomerCars: (customerId: string) => Car[];
  onAddCustomer: (input: CreateCustomerInput) => Customer;
  onAddCar: (input: CreateCarInput) => Car;
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
  const { state, actions } = useJobForm(onSubmit);

  const customerCars = state.selectedCustomerId
    ? getCustomerCars(state.selectedCustomerId)
    : [];

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) actions.reset();
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

        <form onSubmit={actions.submit} className="space-y-5 pb-8">
          {/* Customer Section */}
          <CustomerSection
            customers={customers}
            selectedCustomerId={state.selectedCustomerId}
            onChange={(id) => {
              actions.setSelectedCustomerId(id);
              actions.setSelectedCarId(""); // reset car selection
            }}
            onAddCustomer={onAddCustomer}
          />

          {/* Car Section */}
          {state.selectedCustomerId && (
            <CarSection
              cars={customerCars}
              selectedCarId={state.selectedCarId}
              onChange={actions.setSelectedCarId}
              onAddCar={onAddCar}
              customerId={state.selectedCustomerId}
            />
          )}

          {/* Mechanic Selection */}
          <MechanicSelect
            mechanics={mechanics}
            value={state.selectedMechanicId}
            onChange={actions.setSelectedMechanicId}
          />

          {/* Problem Description */}
          <ProblemField
            value={state.problemDescription}
            onChange={actions.setProblemDescription}
          />

          {/* Photo Upload */}
          <PhotoUploader photos={state.photos} onChange={actions.setPhotos} />

          {/* Submit Buttons */}
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
                !state.selectedCustomerId ||
                !state.selectedCarId ||
                !state.problemDescription
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
}
