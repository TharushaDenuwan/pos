"use server";

import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { BanUserSchema } from "../schemas/ban-user";

export async function banUser(values: BanUserSchema) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  return await authClient.admin.banUser(
    {
      userId: values.userId,
      ...(values.banReason && { banReason: values.banReason }),
      ...(values.banExpiresIn && { banExpiresIn: values.banExpiresIn })
    },
    {
      headers: {
        ...(cookieHeader && { cookie: cookieHeader })
      }
    }
  );
}
