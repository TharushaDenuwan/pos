import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { activityLogs, roles, staffProfiles, users } from "@repo/database";
import { eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type {
    CreateRoute,
    GetByIdRoute,
    ListRoute,
    RegisterRoute,
    RemoveRoute,
    UpdateRoute,
} from "./staffProfiles.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { page = "1", limit = "10" } = c.req.valid("query");
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const data = await db.query.staffProfiles.findMany({
    limit: limitNum,
    offset,
    with: {
      user: true, // Assuming relation is set up in Drizzle schema for fetching user details
    }
  });

  const [totalCountResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(staffProfiles);

  const totalCount = Number(totalCountResult?.count ?? 0);
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data,
      meta: {
        totalCount,
        limit: limitNum,
        currentPage: pageNum,
        totalPages,
      },
    },
    HttpStatusCodes.OK
  );
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");
  const [inserted] = await db.insert(staffProfiles).values(body).returning();
  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const item = await db.query.staffProfiles.findFirst({
    where: eq(staffProfiles.id, id),
    with: {
        user: true
    }
  });

  if (!item) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(item, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [updated] = await db
    .update(staffProfiles)
    .set(updates)
    .where(eq(staffProfiles.id, id))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [deleted] = await db.delete(staffProfiles).where(eq(staffProfiles.id, id)).returning();

  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Also delete user? Or just profile. Usually keep user for history but suspend.
  // For now just delete profile.

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
  const { name, email, password, position, assignedSection } = c.req.valid("json");

  // Check existing user
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    // If user exists but is not staff?
    // For simplicity, fail.
    return c.json({ message: "Email already exists" }, HttpStatusCodes.CONFLICT);
  }

  // Hash password
  const passwordHash = await Bun.password.hash(password);

  // Get/Create Staff Role
  let role = await db.query.roles.findFirst({
    where: eq(roles.name, "staff"),
  });

  if (!role) {
    const [newRole] = await db.insert(roles).values({ name: "staff", description: "Staff Member" }).returning();
    if (!newRole) {
        return c.json({ message: "Failed to create role" }, HttpStatusCodes.INTERNAL_SERVER_ERROR as any);
    }
    role = newRole;
  }

  // Create User
  const [user] = await db.insert(users).values({
    name,
    email,
    passwordHash,
    roleId: role.id,
    status: "active",
  }).returning();

  if (!user) {
      return c.json({ message: "Failed to create user" }, HttpStatusCodes.INTERNAL_SERVER_ERROR as any);
  }

  // Create Staff Profile
  const [profile] = await db.insert(staffProfiles).values({
    userId: user.id,
    position,
    assignedSection: assignedSection as any, // Cast if enum mismatch
  }).returning();

  if (!profile) {
      return c.json({ message: "Failed to create profile" }, HttpStatusCodes.INTERNAL_SERVER_ERROR as any);
  }

  // Log Activity
  // Note: We don't have current user ID here easily unless passed in headers or context.
  // System log:
  await db.insert(activityLogs).values({
    userId: user.id, // Self-reference for "created account"? Or ideally admin ID.
    action: "STAFF_CREATED",
    targetType: "USER",
    targetId: user.id,
    details: { createdBy: "system_admin_action" }, // Placeholder
  });

  return c.json({ user, profile }, HttpStatusCodes.CREATED);
};
