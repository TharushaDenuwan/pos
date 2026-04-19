"use server";

import { client } from "@/lib/rpc";

export async function getOrderById(orderId: string) {
  try {
    const orderRes = await client.orders[":id"].$get({
      param: { id: orderId },
    });

    if (!orderRes.ok) {
      throw new Error("Order not found");
    }

    const order = await orderRes.json();

    // Fetch items
    const itemsRes = await client["order-items"].$get({
      query: {
        limit: "100",
        // Assuming API supports filtering by orderId. If not, client side filter.
      },
    });

    let items: any[] = [];
    if (itemsRes.ok) {
        const itemsJson = await itemsRes.json();
        // Filter manually if API doesn't support orderId param in list query
        items = (itemsJson.data || []).filter((i: any) => i.orderId === orderId);

        // Items likely need product info.
        // If API returns joined data, great. If not, separate fetch for products.
        // Assuming API returns items with product details.
    }

    return { order, items };
  } catch (error) {
    console.error("Failed to fetch order:", error);
    throw new Error("Failed to fetch order details");
  }
}
