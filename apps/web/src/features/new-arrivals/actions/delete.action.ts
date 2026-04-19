"use server";

import { getClient } from "@/lib/rpc/server";

export async function deleteNewArrival(id: string) {
  const rpcClient = await getClient();
  const response = await rpcClient.api["new-arrivals"][":id"].$delete({
    param: { id },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete new arrival");
  }

  // delete might return 204 No Content
  if (response.status === 204) return true;
  return await response.json();
}
