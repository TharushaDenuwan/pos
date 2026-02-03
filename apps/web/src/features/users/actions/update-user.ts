"use server";

import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

import { UpdateUserSchema } from "../schemas/update-user";

export async function updateUser(values: UpdateUserSchema) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  return await authClient.admin.setRole(
    {
      userId: values.userId,
      role: values.role
    },
    {
      headers: {
        ...(cookieHeader && { cookie: cookieHeader })
      }
    }
  );
}
