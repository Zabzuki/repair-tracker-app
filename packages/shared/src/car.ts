export type Car = {
  id: string; // Unique ID for the car
  customerId: string; // Unique ID for the customer
  licensePlate: string; // License plate (uppercase in factory)
  model: string; // Car model
  year: number; // Production Year
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCarInput = {
  customerId: string; // Unique ID for the customer
  licensePlate: string; // license plate (uppercase in factory)
  model: string; // Car model
  year: number; // Production Year
};
