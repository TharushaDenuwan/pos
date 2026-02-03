"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function deleteJob(id: string) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.job[":id"].$delete({
    param: { id },
  });

  const result = await response.json();

  // Revalidate the page to show the updated job list
  revalidatePath("/dashboard/job");

  return result;
}
