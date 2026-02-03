"use server";

import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { FilterParams } from "../api";

export async function listUsers(filterParams: FilterParams) {
  const { page = 1, limit = 10, search = "" } = filterParams;
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  const totalUsers = await authClient.admin.listUsers({
    query: { limit: 1000000 },
    fetchOptions: {
      headers: {
        ...(cookieHeader && { cookie: cookieHeader })
      }
    }
  });

  const { data, error } = await authClient.admin.listUsers({
    query: {
      limit,
      offset: page > 1 ? (page - 1) * limit : 0,
      sortBy: "createdAt",
      sortDirection: "desc",
      ...(search && {
        searchField: "email",
        searchOperator: "contains",
        searchValue: search || undefined
      })
    },
    fetchOptions: {
      headers: {
        ...(cookieHeader && { cookie: cookieHeader })
      }
    }
  });

  if (error) throw new Error(error.message);

  return {
    users: data.users,
    total: totalUsers?.data?.users.length
  };
}
