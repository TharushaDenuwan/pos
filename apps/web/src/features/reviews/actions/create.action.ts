"use server";

import { client } from "@/lib/rpc";

interface ReviewData {
  productId: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
}

export async function createReview(data: ReviewData) {
  try {
    const res = await client.reviews.$post({
      json: {
        productId: data.productId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        rating: data.rating,
        comment: data.comment,
        isApproved: false, // Default to pending
      },
    });

    if (!res.ok) {
      // @ts-ignore
      const err = await res.json();
      // @ts-ignore
      throw new Error(err.message || "Failed to submit review");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Create Review Error:", error);
    return { success: false, error: error.message || "Failed to submit review" };
  }
}
