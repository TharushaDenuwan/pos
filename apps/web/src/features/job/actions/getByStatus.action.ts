"use server";

import { getClient } from "@/lib/rpc/server";

export async function getJobsByStatus({
  page = "1",
  limit = "8",
  sort = "desc",
  search = "",
  status = "",
}: {
  page?: string;
  limit?: string;
  sort?: "asc" | "desc";
  search?: string;
  status?: string;
} = {}) {
  const rpcClient = await getClient();
  const response = await rpcClient.api.job.$get({
    query: {
      page,
      limit,
      sort,
      search,
      ...(status && status !== "__all__" ? { status } : {}),
    },
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const data = await response.json();
  return data;
}
