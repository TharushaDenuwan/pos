"use server";

import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

export async function unbanUser(values: { userId: string }) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  return await authClient.admin.unbanUser(
    {
      userId: values.userId
    },
    {
      headers: {
        ...(cookieHeader && { cookie: cookieHeader })
      }
    }
  );
}
