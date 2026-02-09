export type Mechanic = {
  id: string; // Unique ID for the mechanic
  name: string; // Full name
  color: string; // For visual identification
  phone: string; // Optional phone number
  email?: string; // Optional email
  createdAt: Date; // Timestamp
  updatedAt: Date; // Timestamp of last update
};
