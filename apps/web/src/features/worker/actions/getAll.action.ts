"use server";

import { getClient } from "@/lib/rpc/server";

type GetWorkerParams = {
  page?: string;
  limit?: string;
  sort?: "asc" | "desc";
  search?: string;
};

export async function getAllWorker({
  page = "1",
  limit = "8",
  sort = "desc",
  search = "",
}: GetWorkerParams = {}) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.worker.$get({
    query: {
      page,
      limit,
      sort,
      search,
    },
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const data = await response.json();
  return data;
}
