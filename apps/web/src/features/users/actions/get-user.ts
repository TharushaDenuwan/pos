"use server";

import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

export async function getUser(filterParams: { userId: string }) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  const allUsers = await authClient.admin.listUsers({
    query: { limit: 1000000 },
    fetchOptions: {
      headers: {
        ...(cookieHeader && { cookie: cookieHeader })
      }
    }
  });

  if (!allUsers.data) {
    throw new Error(allUsers.error.message || "Failed to fetch users");
  }

  const filteredUsers = allUsers.data.users.filter(
    (user) => user.id === filterParams.userId
  );

  return filteredUsers.length > 0 ? filteredUsers[0] : null;
}
