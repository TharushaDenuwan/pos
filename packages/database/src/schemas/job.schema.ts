import {
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  jobTitle: text("job_title").notNull(), // Compulsory: Job Title
  address: jsonb("address").notNull().$type<{
    formattedAddress: string; // Compulsory: Human-readable address from Google Places
    latitude: number; // Compulsory: Latitude for map integration
    longitude: number; // Compulsory: Longitude for map integration
  }>(), // Compulsory: Structured address details
  contactDetails: jsonb("contact_details").notNull().$type<{
    phoneNumber: string; // Compulsory: Primary phone number
    email: string; // Compulsory: Email address
    workPhoneNumber: string; // Compulsory: Work phone number
  }>(), // Compulsory: Structured contact details
  jobNumber: varchar("job_number", { length: 50 }).notNull().unique(), // Compulsory: Auto-generated unique job number
  dueDate: timestamp("due_date"), // Optional: Due Date
  description: text("description"), // Optional: Description
  estimatedHours: numeric("estimated_hours"), // Optional: Estimated Hours
  photos: jsonb("photos").default([]), // Optional: Array of photo URLs or references
  status: varchar("status", { length: 20 }).notNull().default("Initiated"), // Status (Initiated, Quotation, Approved, In Progress, Completed, Invoiced)
  priority: varchar("priority", { length: 20 })
    .notNull()
    .default("Medium")
    .$type<"Low" | "Medium" | "High" | "Urgent">(), // Priority level with default
});
