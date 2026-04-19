"use server";

import { client } from "@/lib/rpc";

export async function getApprovedReviewsByProduct(productId: string) {
  try {
    const res = await client.reviews.$get({
      query: { limit: "100" }
    });

    if (!res.ok) {
      return { data: [] };
    }

    const json = await res.json();
    const data = (json.data || []).filter((r: any) =>
      r.productId === productId && r.isApproved === true
    );

    return { data };
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return { data: [] };
  }
}
