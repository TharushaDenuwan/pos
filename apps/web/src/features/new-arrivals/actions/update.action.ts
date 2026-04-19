"use server";

import { getClient } from "@/lib/rpc/server";
import type { UpdateNewArrival } from "../schemas";

export async function updateNewArrival(id: string, data: UpdateNewArrival) {
  const rpcClient = await getClient();
  const response = await rpcClient.api["new-arrivals"][":id"].$patch({
    param: { id },
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update new arrival");
  }

  return await response.json();
}
