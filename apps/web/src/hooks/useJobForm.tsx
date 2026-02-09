import { useState } from "react";
import { Job } from "@garage/shared";

type SubmitFn = (job: Omit<Job, "id" | "createdAt" | "updatedAt">) => void;

export function useJobForm(onSubmit: SubmitFn) {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedCarId, setSelectedCarId] = useState("");
  const [selectedMechanicId, setSelectedMechanicId] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const reset = () => {
    setSelectedCustomerId("");
    setSelectedCarId("");
    setSelectedMechanicId("");
    setProblemDescription("");
    setPhotos([]);
  };

  const submit = (e: React.FormEvent) => {
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

    reset();
  };

  return {
    state: {
      selectedCustomerId,
      selectedCarId,
      selectedMechanicId,
      problemDescription,
      photos,
    },
    actions: {
      setSelectedCustomerId,
      setSelectedCarId,
      setSelectedMechanicId,
      setProblemDescription,
      setPhotos,
      reset,
      submit,
    },
  };
}
