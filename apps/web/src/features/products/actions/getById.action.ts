"use server";

import { client } from "@/lib/rpc";

export async function getProductById(id: string) {
  try {
    const res = await client.products[":id"].$get({
      param: { id },
    });

    if (!res.ok) {
        if (res.status === 404) return { data: null };
        throw new Error("Failed to fetch product");
    }

    const { data } = await res.json();
    return { data };
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return { data: null };
  }
}
