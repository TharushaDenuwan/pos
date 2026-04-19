"use server";

import { getClient } from "@/lib/rpc/server";

export async function getAllNewArrivals(params: { page?: string; limit?: string } = {}) {
  const rpcClient = await getClient();
  const response = await rpcClient.api["new-arrivals"].$get({
    query: params,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch new arrivals");
  }

  return await response.json();
}
