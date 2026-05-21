"use server";

import { env } from "@/lib/env";
import { revalidatePath } from "next/cache";

export async function createSaving(data: { amount: number; date?: string; vehicleType?: string }) {
  const url = `${env.NEXT_PUBLIC_BACKEND_URL}/api/savings-bank`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to create saving:", res.status, text);
    throw new Error(`Failed to create saving: ${res.status} ${text}`);
  }

  revalidatePath("/admin/dashboard");
  return res.json();
}
