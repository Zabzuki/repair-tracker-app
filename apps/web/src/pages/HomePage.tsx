import { getOrCreateDevice } from "../utils/device";
import { License, isDeviceAllowed } from "@garage/shared";
import { useJobs } from "../hooks/useJobs";
import { DeviceInfo } from "../components/DeviceInfo";
import { JobForm } from "../components/JobForm";
import { JobList } from "../components/JobList";

export function HomePage() {
  const device = getOrCreateDevice("Front Desk PC");

  const license: License = {
    id: "shop-123",
    maxDevices: 3,
    devices: [device.id],
    active: true,
  };

  const allowed = isDeviceAllowed(license, device.id);
  const { jobs, addJob, updateStatus, removeJob } = useJobs(device.id, allowed);

  return (
    <div className="p-8 max-w-xl mx-auto flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-6">Garage App 🚗</h1>

      <DeviceInfo id={device.id} name={device.name} />

      {allowed ? (
        <p className="text-green-600 mb-4">Device authorized ✅</p>
      ) : (
        <p className="text-red-600 mb-4">Device not authorized ❌</p>
      )}

      {allowed && <JobForm onSubmit={addJob} />}

      <JobList jobs={jobs} onStatusChange={updateStatus} onDelete={removeJob} />
    </div>
  );
}
