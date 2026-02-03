"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";
import { type UpdateTaskSchema } from "../schemas";

export async function markAsCompleted(id: number, data: UpdateTaskSchema) {
  const res = await client.api.tasks[":id"].$patch({
    json: { done: data.done || false },
    param: { id }
  });

  // Revalidate the page to show the new task
  revalidatePath("/");
}
