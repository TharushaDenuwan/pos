"use server";

import { getClient } from "@/lib/rpc/server";
import type { InsertNewArrival } from "../schemas";

export async function createNewArrival(data: InsertNewArrival) {
  const rpcClient = await getClient();
  const response = await rpcClient.api["new-arrivals"].$post({
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create new arrival");
  }

  return await response.json();
}
