"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function deleteWorker(id: string) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.worker[":id"].$delete({
    param: { id },
  });

  const result = await response.json();

  // Revalidate the page to show the updated worker list
  revalidatePath("/dashboard/worker");

  return result;
}
