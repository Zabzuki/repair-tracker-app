import { useState } from "react";
import {
  Job,
  JobStatus,
  JobWithDetails,
  // License,
  // isDeviceAllowed,
} from "@garage/shared";

import { useJobs } from "../hooks/useJobs";
// import { DeviceInfo } from "../components/DeviceInfo";
import { JobCard } from "@/components/JobCard";

import { Button } from "@/components/ui/button";
import { Plus, Wrench, Search, X } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/input";
import { JobDetails } from "@/components/JobDetails";
import { StatusFilter } from "@/components/StatusFilter";
import { JobForm } from "@/components/JobForm/JobForm";

export function HomePage() {
  // Device and license setup
  // const device = getOrCreateDevice("Front Desk PC");
  // const license: License = {
  //   id: "shop-123",
  //   maxDevices: 3,
  //   devices: [device.id],
  //   active: true,
  // };
  // const allowed = isDeviceAllowed(license, device.id);

  // Jobs hook
  const {
    jobs,
    customers,
    cars,
    mechanics,
    addJob,
    addCustomer,
    addCar,
    updateJobStatus,
    assignMechanic,
    deleteJob,
    getJobCounts,
    getCustomerCars,
    // isLoaded,
  } = useJobs();
  const { toast } = useToast();

  // Local state
  const [activeFilter, setActiveFilter] = useState<"all" | Job["status"]>(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobWithDetails | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filtered jobs based on status/search
  const filteredJobs = jobs.filter((job) => {
    const matchesFilter = activeFilter === "all" || job.status === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      job.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.car.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.car.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handlers
  const handleAddJob = (
    jobData: Omit<Job, "id" | "createdAt" | "updatedAt">,
  ) => {
    addJob(jobData);
    const customer = customers.find((c) => c.id === jobData.customerId);
    toast({
      title: "Job Created",
      description: `Job for ${customer?.name || "customer"} has been added.`,
    });
  };

  const handleStatusChange = (id: string, status: JobStatus) => {
    updateJobStatus(id, status);
    const job = jobs.find((j) => j.id === id);
    if (job && status === "done") {
      toast({
        title: "Job Completed! 🎉",
        description: `${job.customer.name}'s car is ready for pickup.`,
      });
    }
  };

  const handleViewDetails = (job: JobWithDetails) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteJob(id);
    toast({
      title: "Job Deleted",
      description: "The job has been removed.",
      variant: "destructive",
    });
  };

  // if (!isLoaded) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-pulse text-muted-foreground text-lg">
  //         Loading...
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Mobile-optimized Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
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
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11"
                onClick={() => setShowSearch(!showSearch)}
              >
                {showSearch ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Expandable Search */}
          {showSearch && (
            <div className="mt-3 animate-slide-in">
              <Input
                placeholder="Search name, plate, model, mechanic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 text-base"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Status Filters - Horizontal scroll on mobile */}
        <div className="px-4 pb-3 overflow-x-auto">
          <StatusFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={getJobCounts()}
          />
        </div>
      </header>

      {/* Main Content */}
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

      {/* Fixed Bottom Action Button - Large touch target */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-linear-to-t from-background via-background to-transparent pointer-events-none">
        <Button
          onClick={() => setIsFormOpen(true)}
          className="w-full h-14 text-base font-semibold shadow-lg pointer-events-auto"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Job
        </Button>
      </div>

      {/* Modals */}
      <JobForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddJob}
        customers={customers}
        cars={cars}
        mechanics={mechanics}
        getCustomerCars={getCustomerCars}
        onAddCustomer={addCustomer}
        onAddCar={addCar}
      />
      <JobDetails
        job={selectedJob}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        mechanics={mechanics}
        onAssignMechanic={assignMechanic}
      />
    </div>
  );
}

export default HomePage;
