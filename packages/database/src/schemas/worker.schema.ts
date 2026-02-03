import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const worker = pgTable("workers", {
  id: serial("id").primaryKey(), // Unique identifier for each worker
  name: text("name"), // Optional: Worker name
  email: text("email"), // Optional: Worker email
  phoneNumber: text("phone_number"), // Optional: Worker phone number
  availability: varchar("availability", { length: 20 })
    .notNull()
    .default("Full Time")
    .$type<"Full Time" | "Part Time" | "On Call">(), // Required: Availability with default
  notes: text("notes"), // Optional: Additional notes about the worker
});

export const worker_categories = pgTable("worker_categories", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id")
    .references(() => worker.id, { onDelete: "cascade" })
    .notNull(), // Foreign key to workers
  category: varchar("category", { length: 50 }).notNull(), // Category (e.g., Plumber, Electrician)
});

export const worker_skills = pgTable("worker_skills", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id")
    .references(() => worker.id, { onDelete: "cascade" })
    .notNull(), // Foreign key to workers
  skill: varchar("skill", { length: 50 }).notNull(), // Skill (e.g., Pipe Repair, Wiring)
});
