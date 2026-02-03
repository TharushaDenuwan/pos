"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function deleteHousing(id: string) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.housing[":id"].$delete({
    param: { id },
  });

  const result = await response.json();

  // Revalidate the page to show the updated housing list
  revalidatePath("/dashboard/housing");

  return result;
}
