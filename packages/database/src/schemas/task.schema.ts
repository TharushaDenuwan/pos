import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { jobs } from "./job.schema";

export const task = pgTable("task", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id")
    .references(() => jobs.id, { onDelete: "cascade" })
    .notNull(), // Foreign key to jobs table
  name: text("name").notNull(), // Task name
  sequence: integer("sequence").notNull(), // Optional: Task sequence
  assignedWorker: text("assigned_worker"), // Optional: Assigned worker or contractor
});
