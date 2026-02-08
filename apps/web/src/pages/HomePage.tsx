import { useState } from "react";
import { getOrCreateDevice } from "../utils/device";
import { Job, JobFormInput, License, isDeviceAllowed } from "@garage/shared";

import { useJobs } from "../hooks/useJobs";
import { DeviceInfo } from "../components/DeviceInfo";
import { JobCard } from "@/components/JobCard";
import { JobForm } from "@/components/JobForm";

import { Button } from "@/components/ui/button";
import { Plus, Wrench, Search, X } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/input";
import { JobDetails } from "@/components/JobDetails";
import { StatusFilter } from "@/components/StatusFilter";

export function HomePage() {
  // Device and license setup
  const device = getOrCreateDevice("Front Desk PC");
  const license: License = {
    id: "shop-123",
    maxDevices: 3,
    devices: [device.id],
    active: true,
  };
  const allowed = isDeviceAllowed(license, device.id);

  // Jobs hook
  const { jobs, addJob, updateStatus, removeJob } = useJobs(device.id, allowed);
  const { toast } = useToast();

  // Local state
  const [activeFilter, setActiveFilter] = useState<"all" | Job["status"]>(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filtered jobs based on status/search
  const filteredJobs = jobs.filter((job) => {
    const matchesFilter = activeFilter === "all" || job.status === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.carModel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handlers
  const handleAddJob = (jobData: JobFormInput) => {
    addJob({ ...jobData, deviceId: device.id });
    toast({
      title: "Job Created",
      description: `Job for ${jobData.customerName} has been added.`,
    });
  };

  const handleStatusChange = (id: string, status: Job["status"]) => {
    updateStatus(id, status);
    const job = jobs.find((j) => j.id === id);
    if (job && status === "done") {
      toast({
        title: "Job Completed! 🎉",
        description: `${job.customerName}'s car is ready for pickup.`,
      });
    }
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const handleDelete = (id: string) => {
    removeJob(id);
    toast({
      title: "Job Deleted",
      description: "The job has been removed.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <Wrench className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">
                Repair Tracker
              </h1>
              <p className="text-xs text-muted-foreground">
                {jobs.length} job{jobs.length !== 1 ? "s" : ""}
              </p>
              <DeviceInfo id={device.id} name={device.name} />
              {allowed ? (
                <p className="text-green-600 text-xs">Device authorized ✅</p>
              ) : (
                <p className="text-red-600 text-xs">Device not authorized ❌</p>
              )}
            </div>
          </div>

          {/* Search toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
          >
            {showSearch ? (
              <X className="w-5 h-5" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Search input */}
        {showSearch && (
          <div className="px-4 pb-3 animate-slide-in">
            <Input
              placeholder="Search name, plate, model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 text-base"
              autoFocus
            />
          </div>
        )}

        {/* Status filters */}
        <div className="px-4 pb-3 overflow-x-auto">
          <StatusFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={jobs.reduce(
              (acc, job) => {
                acc[job.status] = (acc[job.status] || 0) + 1;
                acc.all = (acc.all || 0) + 1; // total jobs
                return acc;
              },
              {} as Record<Job["status"] | "all", number>,
            )}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 py-4 space-y-3">
        {filteredJobs.length > 0 ? (
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Wrench className="w-10 h-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">No jobs found</h3>
              <p className="text-muted-foreground">
                {searchQuery || activeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Tap the button below to create one"}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Fixed bottom action button */}
      {allowed && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-linear-to-t from-background via-background test-primary-foreground to-transparent pointer-events-none">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="w-full h-14 text-base font-semibold shadow-lg pointer-events-auto text-primary-foreground bg-primary"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Job
          </Button>
        </div>
      )}

      {/* Modals */}
      <JobForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddJob}
      />
      <JobDetails
        job={selectedJob}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default HomePage;
