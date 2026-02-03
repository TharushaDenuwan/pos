"use server";

import { getClient } from "@/lib/rpc/server";
import type { InsertWorker } from "../schemas";

export async function createWorker(data: InsertWorker) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.worker.$post({
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error Response:", errorData);

    // Throw an error with full info (stringify if you want)
    throw new Error(
      errorData.message || JSON.stringify(errorData) || "Unknown error"
    );
  }

  const createdWorker = await response.json();

  return createdWorker;
}
