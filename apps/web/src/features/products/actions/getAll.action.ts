"use server";

import { getClient } from "@/lib/rpc/server";

export async function getAllProducts(params: {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  isFeatured?: string;
  sort?: "newest" | "price_asc" | "price_desc";
} = {}) {
  const rpcClient = await getClient();
  const response = await rpcClient.api.products.$get({
    query: {
      ...params,
      isFeatured: params.isFeatured as "true" | "false" | undefined,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch products");
  }

  return await response.json();
}
