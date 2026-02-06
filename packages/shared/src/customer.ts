// Basic customer information for the repair tracker app

export interface Customer {
  id: string;           // Unique ID for the customer
  name: string;         // Full name
  phone?: string;       // Optional phone number
  email?: string;       // Optional email
  vehiclePlate?: string; // Optional main vehicle plate
  createdAt: number;    // Timestamp
  updatedAt: number;    // Timestamp of last update
}
