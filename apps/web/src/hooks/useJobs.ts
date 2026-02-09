import { useCallback, useEffect, useState } from "react";
import type {
  CreateCustomerInput,
  Customer,
  Job,
  JobStatus,
  JobWithDetails,
} from "@garage/shared";
// import { fetchJobs, createJob, updateJobStatus, deleteJob } from "../api/jobs";
import { Mechanic } from "@garage/shared/src/mechanic";
import { Car, CreateCarInput } from "@garage/shared/src/car";

export type JobInput = Omit<Job, "id" | "createdAt" | "updatedAt">;

const JOBS_STORAGE_KEY = "repair-tracker-jobs";
const CUSTOMERS_STORAGE_KEY = "repair-tracker-customers";
const CARS_STORAGE_KEY = "repair-tracker-cars";
const MECHANICS_STORAGE_KEY = "repair-tracker-mechanics";

/* ---------------------------------------------------------------------- */
/*                                SAMPLES                                 */
/* ---------------------------------------------------------------------- */
const sampleMechanics: Mechanic[] = [
  {
    id: "mech-1",
    name: "Carlos Rodriguez",
    color: "#3b82f6",
    phone: "698888888",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mech-2",
    name: "Mike Thompson",
    color: "#10b981",
    phone: "698888888",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mech-3",
    name: "Alex Chen",
    color: "#f59e0b",
    phone: "698888888",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Sample customers for demonstration
const sampleCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Maria Garcia",
    phone: "+1 555 123 4567",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cust-2",
    name: "James Wilson",
    phone: "+1 555 987 6543",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cust-3",
    name: "Sarah Johnson",
    phone: "+1 555 456 7890",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Sample cars (multiple cars per customer)
const sampleCars: Car[] = [
  {
    id: "car-1",
    customerId: "cust-1",
    licensePlate: "ABC-1234",
    model: "Honda Civic",
    year: 2019,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "car-2",
    customerId: "cust-1",
    licensePlate: "DEF-5678",
    model: "Toyota RAV4",
    year: 2021,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "car-3",
    customerId: "cust-2",
    licensePlate: "XYZ-9012",
    model: "Toyota Camry",
    year: 2021,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "car-4",
    customerId: "cust-3",
    licensePlate: "GHI-3456",
    model: "Ford F-150",
    year: 2018,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "car-5",
    customerId: "cust-3",
    licensePlate: "JKL-7890",
    model: "Chevrolet Silverado",
    year: 2020,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Sample jobs
const sampleJobs: Job[] = [
  {
    id: "1",
    customerId: "cust-1",
    carId: "car-1",
    mechanicId: "mech-1",
    problemDescription:
      "Engine making strange noise when accelerating. Customer reports it started two days ago.",
    status: "in-progress",
    photos: [],
    deviceId: "124012951",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    customerId: "cust-2",
    carId: "car-3",
    mechanicId: null,
    problemDescription: "Regular oil change and brake inspection requested.",
    status: "waiting",
    photos: [],
    deviceId: "124012952",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "3",
    customerId: "cust-3",
    carId: "car-4",
    mechanicId: "mech-2",
    problemDescription: "Transmission needs new parts. Ordered from supplier.",
    status: "waiting-for-parts",
    photos: [],
    deviceId: "124012953",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    customerId: "cust-1",
    carId: "car-2",
    mechanicId: "mech-3",
    problemDescription: "Full service completed. Ready for pickup.",
    status: "done",
    photos: [],
    deviceId: "124012954",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];

/* ---------------------------------------------------------------------- */
/*                                LocalStorage Utils                      */
/* ---------------------------------------------------------------------- */
function loadData<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;

  const stored = localStorage.getItem(key);
  if (!stored) return fallback;

  try {
    const parsed = JSON.parse(stored);

    // Convert dates for jobs
    if (key === JOBS_STORAGE_KEY) {
      return parsed.map((item: Job) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));
    }

    return parsed;
  } catch {
    return fallback;
  }
}

/* ---------------------------------------------------------------------- */
/*                                Hook                                    */
/* ---------------------------------------------------------------------- */
export function useJobs() {
  /* --------------------------- Lazy initialization -------------------------- */
  const [jobs, setJobs] = useState<Job[]>(() =>
    loadData(JOBS_STORAGE_KEY, sampleJobs),
  );

  const [customers, setCustomers] = useState<Customer[]>(() =>
    loadData(CUSTOMERS_STORAGE_KEY, sampleCustomers),
  );

  const [cars, setCars] = useState<Car[]>(() =>
    loadData(CARS_STORAGE_KEY, sampleCars),
  );

  const [mechanics] = useState<Mechanic[]>(() =>
    loadData(MECHANICS_STORAGE_KEY, sampleMechanics),
  );

  /* ---------------------------- Persist changes ---------------------------- */

  useEffect(() => {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(cars));
  }, [cars]);

  useEffect(() => {
    localStorage.setItem(MECHANICS_STORAGE_KEY, JSON.stringify(mechanics));
  }, [mechanics]);

  /* -------------------------------------------------------------------------- */
  /*                               Derived Data                                 */
  /* -------------------------------------------------------------------------- */

  const enrichJob = useCallback(
    (job: Job): JobWithDetails | null => {
      const customer = customers.find((c) => c.id === job.customerId);
      const car = cars.find((c) => c.id === job.carId);
      const mechanic = job.mechanicId
        ? mechanics.find((m) => m.id === job.mechanicId)
        : null;

      if (!customer || !car) return null;

      return {
        ...job,
        customer,
        car,
        mechanic: mechanic || null,
      };
    },
    [customers, cars, mechanics],
  );

  const jobsWithDetails = jobs
    .map(enrichJob)
    .filter((job): job is JobWithDetails => job !== null);

  const getCustomerCars = useCallback(
    (customerId: string) => {
      return cars.filter((car) => car.customerId === customerId);
    },
    [cars],
  );

  /* -------------------------------------------------------------------------- */
  /*                                  Actions                                   */
  /* -------------------------------------------------------------------------- */

  const addJob = useCallback(
    (jobData: Omit<Job, "id" | "createdAt" | "updatedAt">) => {
      const newJob: Job = {
        ...jobData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setJobs((prev) => [newJob, ...prev]);
      return newJob;
    },
    [],
  );

  const addCustomer = useCallback((data: CreateCustomerInput) => {
    const newCustomer: Customer = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCustomers((prev) => [...prev, newCustomer]);
    return newCustomer;
  }, []);

  const addCar = useCallback((data: CreateCarInput) => {
    const newCar: Car = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCars((prev) => [...prev, newCar]);
    return newCar;
  }, []);

  const updateJobStatus = useCallback((id: string, status: JobStatus) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, status, updatedAt: new Date() } : job,
      ),
    );
  }, []);

  const assignMechanic = useCallback(
    (jobId: string, mechanicId: string | null) => {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? { ...job, mechanicId, updatedAt: new Date() }
            : job,
        ),
      );
    },
    [],
  );

  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  }, []);

  const getJobCounts = useCallback(() => {
    const counts: Record<JobStatus | "all", number> = {
      all: jobs.length,
      waiting: 0,
      "in-progress": 0,
      "waiting-for-parts": 0,
      done: 0,
    };

    jobs.forEach((job) => {
      counts[job.status]++;
    });

    return counts;
  }, [jobs]);

  /* -------------------------------------------------------------------------- */

  return {
    jobs: jobsWithDetails,
    rawJobs: jobs,
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
  };

  // useEffect(() => {
  //   fetchJobs().then(setJobs);
  // }, []);

  // async function addJob(jobInput: JobInput) {
  //   if (!enabled) return;

  //   const job = await createJob({
  //     licensePlate: jobInput.licensePlate, // map if needed
  //     deviceId,
  //     customerName: jobInput.customerName,
  //     customerPhone: jobInput.customerPhone,
  //     carModel: jobInput.carModel,
  //     carYear: jobInput.carYear,
  //     problemDescription: jobInput.problemDescription,
  //     status: jobInput.status,
  //     photos: jobInput.photos,
  //   });
  //   setJobs((prev) => [job, ...prev]);
  // }

  // async function updateStatus(id: string, status: JobStatus) {
  //   setJobs((prev) =>
  //     prev.map((job) =>
  //       job.id === id ? { ...job, status, updatedAt: Date.now() } : job,
  //     ),
  //   );

  //   try {
  //     await updateJobStatus(id, status);
  //   } catch (err) {
  //     console.error("Failed to update job", err);
  //   }
  // }

  // async function removeJob(id: string) {
  //   await deleteJob(id);
  //   setJobs((prev) => prev.filter((job) => job.id !== id));
  // }

  // return { jobs, addJob, updateStatus, removeJob };
}
