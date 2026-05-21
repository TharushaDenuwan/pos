"use server";

import { env } from "@/lib/env";

export async function getAllSavings() {
  const url = `${env.NEXT_PUBLIC_BACKEND_URL}/api/savings-bank`;
  console.log("Fetching from:", url);
  
  const res = await fetch(url, {
    cache: "no-store",
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to fetch savings. Status:", res.status, "Response:", text);
    throw new Error(`Failed to fetch savings: ${res.status} ${text}`);
  }
  return res.json();
}
