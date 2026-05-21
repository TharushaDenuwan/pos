"use server";

import { env } from "@/lib/env";
import { revalidatePath } from "next/cache";

export async function updateSaving(id: string, data: { amount?: number; date?: string; vehicleType?: string }) {
  const url = `${env.NEXT_PUBLIC_BACKEND_URL}/api/savings-bank/${id}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to update saving:", res.status, text);
    throw new Error(`Failed to update saving: ${res.status} ${text}`);
  }

  revalidatePath("/admin/dashboard");
  return res.json();
}
