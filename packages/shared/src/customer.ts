export type Customer = {
  id: string; // Unique ID for the customer
  name: string; // Full name
  phone: string; // Optional phone number
  email?: string; // Optional email
  vehiclePlate?: string; // Optional main vehicle plate
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCustomerInput = {
  name: string; // Full name
  phone: string; // Optional phone number
  email?: string; // Optional email
  vehiclePlate?: string; // Optional main vehicle plate
};
