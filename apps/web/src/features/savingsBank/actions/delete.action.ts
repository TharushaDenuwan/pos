"use server";

import { env } from "@/lib/env";
import { revalidatePath } from "next/cache";

export async function deleteSaving(id: string) {
  const url = `${env.NEXT_PUBLIC_BACKEND_URL}/api/savings-bank/${id}`;
  const res = await fetch(url, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete saving");
  }

  revalidatePath("/admin/dashboard");
}
