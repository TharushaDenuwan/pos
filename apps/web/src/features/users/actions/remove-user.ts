"use server";

import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

export async function removeUser(values: { userId: string }) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  return await authClient.admin.removeUser(
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
