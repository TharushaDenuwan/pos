"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";

export async function deleteTask(id: number) {
  const res = await client.api.tasks[":id"].$delete({
    param: { id }
  });

  // Revalidate the page to show the new task
  revalidatePath("/");
}
