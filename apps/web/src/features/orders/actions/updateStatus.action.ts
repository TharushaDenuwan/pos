"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const res = await client.orders[":id"].$patch({
      param: { id: orderId },
      json: { status } as any,
    });

    if (!res.ok) {
      throw new Error("Failed to update status");
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw new Error("Failed to update order status");
  }
}
