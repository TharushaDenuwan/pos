import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { jobs } from "@repo/database";

import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./job.routes";

// List jobs route handler
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions (search on jobTitle, description, jobNumber, status, priority)
  const query = db.query.jobs.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, or }) => {
      const conditions = [];
      if (search) {
        conditions.push(
          or(
            ilike(fields.jobTitle, `%${search}%`),
            ilike(fields.description, `%${search}%`),
            ilike(fields.jobNumber, `%${search}%`),
            ilike(fields.status, `%${search}%`),
            ilike(fields.priority, `%${search}%`)
          )
        );
      }
      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) => {
      if (sort.toLowerCase() === "asc") {
        return fields.id;
      }
      return desc(fields.id);
    },
  });

  // Get total count for pagination metadata
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(jobs)
    .where(
      search
        ? or(
            ilike(jobs.jobTitle, `%${search}%`),
            ilike(jobs.description, `%${search}%`),
            ilike(jobs.jobNumber, `%${search}%`),
            ilike(jobs.status, `%${search}%`),
            ilike(jobs.priority, `%${search}%`)
          )
        : undefined
    );

  const [jobEntries, _totalCount] = await Promise.all([query, totalCountQuery]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  // Map and normalize the data to match the expected response type
  const normalizedEntries = jobEntries.map((entry) => ({
    ...entry,
    id: entry.id ?? "",
    jobTitle: entry.jobTitle ?? "",
    address: entry.address ?? null,
    contactDetails: entry.contactDetails ?? null,
    jobNumber: entry.jobNumber ?? "",
    dueDate:
      entry.dueDate instanceof Date
        ? entry.dueDate.toISOString()
        : (entry.dueDate ?? null),
    description: entry.description ?? null,
    estimatedHours: entry.estimatedHours ?? null,
    photos: Array.isArray(entry.photos) ? entry.photos : [],
    status: entry.status ?? "Initiated",
    priority: entry.priority ?? "Medium",
  }));

  return c.json(
    {
      data: normalizedEntries,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
      },
    },
    HttpStatusCodes.OK
  );
};

// List jobs by status route handler
export const listByStatus: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    status,
    search,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const whereClause = (fields: typeof jobs, { ilike, and, or, eq }: any) => {
    const conditions = [];
    if (status) {
      conditions.push(eq(fields.status, status));
    }
    if (search) {
      conditions.push(
        or(
          ilike(fields.jobTitle, `%${search}%`),
          ilike(fields.description, `%${search}%`),
          ilike(fields.jobNumber, `%${search}%`),
          ilike(fields.status, `%${search}%`),
          ilike(fields.priority, `%${search}%`)
        )
      );
    }
    return conditions.length ? and(...conditions) : undefined;
  };

  const query = db.query.jobs.findMany({
    limit: limitNum,
    offset,
    where: whereClause,
    orderBy: (fields) =>
      sort.toLowerCase() === "asc" ? fields.id : desc(fields.id),
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(jobs)
    .where(
      status || search
        ? or(
            status ? eq(jobs.status, status) : undefined,
            search
              ? or(
                  ilike(jobs.jobTitle, `%${search}%`),
                  ilike(jobs.description, `%${search}%`),
                  ilike(jobs.jobNumber, `%${search}%`),
                  ilike(jobs.status, `%${search}%`),
                  ilike(jobs.priority, `%${search}%`)
                )
              : undefined
          )
        : undefined
    );

  const [jobEntries, _totalCount] = await Promise.all([query, totalCountQuery]);
  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  const normalizedEntries = jobEntries.map((entry) => ({
    ...entry,
    id: entry.id ?? "",
    jobTitle: entry.jobTitle ?? "",
    address: entry.address ?? null,
    contactDetails: entry.contactDetails ?? null,
    jobNumber: entry.jobNumber ?? "",
    dueDate:
      entry.dueDate instanceof Date
        ? entry.dueDate.toISOString()
        : (entry.dueDate ?? null),
    description: entry.description ?? null,
    estimatedHours: entry.estimatedHours ?? null,
    photos: Array.isArray(entry.photos) ? entry.photos : [],
    status: entry.status ?? "Initiated",
    priority: entry.priority ?? "Medium",
  }));

  return c.json(
    {
      data: normalizedEntries,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
      },
    },
    HttpStatusCodes.OK
  );
};

// export const getByStatus: AppRouteHandler<ListRoute> = async (c) => {
//   const {
//     status,
//     page = "1",
//     limit = "10",
//     sort = "asc",
//     search,
//   } = c.req.valid("query");

//   const allowedStatuses = [
//     "Initiated",
//     "Quotation",
//     "Approved",
//     "In Progress",
//     "Completed",
//     "Invoiced",
//   ];

//   if (!status || !allowedStatuses.includes(status)) {
//     throw new Error("Invalid or missing status");
//   }

//   const pageNum = Math.max(1, parseInt(page));
//   const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
//   const offset = (pageNum - 1) * limitNum;

//   const whereClause = (fields: typeof jobs, { ilike, and, or, eq }: any) => {
//     const conditions = [eq(fields.status, status)];
//     if (search) {
//       conditions.push(
//         or(
//           ilike(fields.jobTitle, `%${search}%`),
//           ilike(fields.description, `%${search}%`),
//           ilike(fields.jobNumber, `%${search}%`),
//           ilike(fields.status, `%${search}%`),
//           ilike(fields.priority, `%${search}%`)
//         )
//       );
//     }
//     return and(...conditions);
//   };

//   const jobEntries = await db.query.jobs.findMany({
//     limit: limitNum,
//     offset,
//     where: whereClause,
//     orderBy: (fields) =>
//       sort.toLowerCase() === "asc" ? fields.id : desc(fields.id),
//   });

//   const totalCountQuery = db
//     .select({ count: sql<number>`count(*)` })
//     .from(jobs)
//     .where(
//       and(
//         eq(jobs.status, status),
//         search
//           ? or(
//               ilike(jobs.jobTitle, `%${search}%`),
//               ilike(jobs.description, `%${search}%`),
//               ilike(jobs.jobNumber, `%${search}%`),
//               ilike(jobs.status, `%${search}%`),
//               ilike(jobs.priority, `%${search}%`)
//             )
//           : undefined
//       )
//     );

//   const _totalCount = await totalCountQuery;
//   const totalCount = _totalCount[0]?.count || 0;
//   const totalPages = Math.ceil(totalCount / limitNum);

//   const normalizedEntries = jobEntries.map((entry) => ({
//     ...entry,
//     id: entry.id ?? "",
//     jobTitle: entry.jobTitle ?? "",
//     address: entry.address ?? null,
//     contactDetails: entry.contactDetails ?? null,
//     jobNumber: entry.jobNumber ?? "",
//     dueDate:
//       entry.dueDate instanceof Date
//         ? entry.dueDate.toISOString()
//         : (entry.dueDate ?? null),
//     description: entry.description ?? null,
//     estimatedHours: entry.estimatedHours ?? null,
//     photos: Array.isArray(entry.photos) ? entry.photos : [],
//     status: entry.status ?? "Initiated",
//     priority: entry.priority ?? "Medium",
//   }));

//   return c.json(
//     {
//       data: normalizedEntries,
//       meta: {
//         currentPage: pageNum,
//         totalPages,
//         totalCount,
//         limit: limitNum,
//       },
//     },
//     HttpStatusCodes.OK
//   );
// };

// Create new job entry route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const insertData = {
    ...body,
  };

  // Ensure estimatedHours is a number, null, or undefined for Drizzle
  if (
    insertData.estimatedHours !== undefined &&
    insertData.estimatedHours !== null
  ) {
    if (typeof insertData.estimatedHours === "string") {
      const parsed = Number(insertData.estimatedHours);
      insertData.estimatedHours = isNaN(parsed) ? null : parsed;
    } else if (typeof insertData.estimatedHours !== "number") {
      insertData.estimatedHours = null;
    }
  }

  // Final type guard: only allow number, null, or undefined
  if (
    insertData.estimatedHours !== undefined &&
    insertData.estimatedHours !== null &&
    typeof insertData.estimatedHours !== "number"
  ) {
    insertData.estimatedHours = null;
  }

  // Patch: allow optional email and workPhoneNumber in contactDetails
  if (insertData.contactDetails) {
    if (typeof insertData.contactDetails !== "object") {
      insertData.contactDetails = null;
    } else {
      // Remove empty string values for optional fields
      if (insertData.contactDetails.email === "") {
        delete insertData.contactDetails.email;
      }
      if (insertData.contactDetails.workPhoneNumber === "") {
        delete insertData.contactDetails.workPhoneNumber;
      }
    }
  }

  // Explicitly cast estimatedHours to string | null | undefined for Drizzle
  const drizzleInsertData = {
    ...insertData,
    estimatedHours:
      insertData.estimatedHours === undefined ||
      insertData.estimatedHours === null
        ? null
        : String(insertData.estimatedHours),
  };

  const [inserted] = await db
    .insert(jobs)
    .values(drizzleInsertData)
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single job entry route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id: idParam } = c.req.valid("param");
  const id = Number(idParam);

  const jobEntry = await db.query.jobs.findFirst({
    where: eq(jobs.id, id),
  });

  if (!jobEntry)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  const normalizedEntry = {
    ...jobEntry,
    id: jobEntry.id ?? "",
    jobTitle: jobEntry.jobTitle ?? "",
    address: jobEntry.address ?? null,
    contactDetails: jobEntry.contactDetails ?? null,
    jobNumber: jobEntry.jobNumber ?? "",
    dueDate:
      jobEntry.dueDate instanceof Date
        ? jobEntry.dueDate.toISOString()
        : (jobEntry.dueDate ?? null),
    description: jobEntry.description ?? null,
    estimatedHours: jobEntry.estimatedHours ?? null,
    photos: Array.isArray(jobEntry.photos) ? jobEntry.photos : [],
    status: jobEntry.status ?? "Initiated",
    priority: jobEntry.priority ?? "Medium",
  };

  return c.json(normalizedEntry, HttpStatusCodes.OK);
};

// Update job entry route handler
export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id: idParam } = c.req.valid("param");
  const id = Number(idParam);
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if job entry exists
  const existingEntry = await db.query.jobs.findFirst({
    where: eq(jobs.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const updateData = {
    ...body,
  };

  // Convert estimatedHours to string, null, or undefined for Drizzle
  if (Object.prototype.hasOwnProperty.call(updateData, "estimatedHours")) {
    if (
      updateData.estimatedHours === undefined ||
      updateData.estimatedHours === null
    ) {
      updateData.estimatedHours = null;
    } else if (typeof updateData.estimatedHours === "number") {
      // keep as number
    } else if (typeof updateData.estimatedHours === "string") {
      const parsed = Number(updateData.estimatedHours);
      updateData.estimatedHours = isNaN(parsed) ? null : parsed;
    } else {
      updateData.estimatedHours = null;
    }
  }

  // Patch: allow optional email and workPhoneNumber in contactDetails
  if (updateData.contactDetails) {
    if (typeof updateData.contactDetails !== "object") {
      updateData.contactDetails = null;
    } else {
      if (updateData.contactDetails.email === "") {
        delete updateData.contactDetails.email;
      }
      if (updateData.contactDetails.workPhoneNumber === "") {
        delete updateData.contactDetails.workPhoneNumber;
      }
    }
  }

  const [updated] = await db
    .update(jobs)
    .set(
      updateData as {
        [key: string]: string | null | undefined;
      }
    )
    .where(eq(jobs.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete job entry route handler
export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id: idParam } = c.req.valid("param");
  const id = Number(idParam);
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if job entry exists
  const existingEntry = await db.query.jobs.findFirst({
    where: eq(jobs.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Delete the job entry
  await db.delete(jobs).where(eq(jobs.id, id));

  return c.json({ message: "Job deleted successfully" }, HttpStatusCodes.OK);
};
