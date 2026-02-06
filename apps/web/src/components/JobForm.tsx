import { useState } from "react";

export function JobForm({ onSubmit }: { onSubmit: (plate: string) => void }) {
  const [plate, setPlate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!plate.trim()) return;
    onSubmit(plate);
    setPlate("");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-2 mb-6">
      <input
        value={plate}
        onChange={(e) => setPlate(e.target.value)}
        placeholder="Enter license plate"
        className="flex-1 border rounded p-3"
      />
      <button className="bg-blue-600 text-white px-4 py-3 rounded">
        Add Job
      </button>
    </form>
  );
}
