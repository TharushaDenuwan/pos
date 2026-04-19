"use server";

import { client } from "@/lib/rpc";

export async function getAllReviews(params: any = {}) {
  try {
    const res = await client.reviews.$get({
      query: { limit: "100" }
    });

    if (!res.ok) {
      return { data: [] };
    }

    const json = await res.json();
    let data = json.data || [];

    // Client-side filtering
    if (params.isApproved !== undefined && params.isApproved !== null) {
      data = data.filter((r: any) => r.isApproved === params.isApproved);
    }

    return { data };
  } catch (error) {
    console.error("Error fetching reviews", error);
    return { data: [] };
  }
}
