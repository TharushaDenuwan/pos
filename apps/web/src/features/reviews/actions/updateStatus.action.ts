"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";

export async function approveReview(reviewId: string) {
  try {
    const res = await client.reviews[":id"].$patch({
      param: { id: reviewId },
      json: { isApproved: true } as any,
    });

    if (!res.ok) {
      throw new Error("Failed to approve review");
    }

    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    console.error("Failed to approve review:", error);
    throw new Error("Failed to approve review");
  }
}

export async function rejectReview(reviewId: string) {
  try {
    const res = await client.reviews[":id"].$patch({
      param: { id: reviewId },
      json: { isApproved: false } as any,
    });

    if (!res.ok) {
      throw new Error("Failed to reject review");
    }

    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    console.error("Failed to reject review:", error);
    throw new Error("Failed to reject review");
  }
}
