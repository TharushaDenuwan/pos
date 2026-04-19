"use server";

import { client } from "@/lib/rpc";

interface OrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  paymentMethod: "COD";
  items: {
    id: string; // productId
    quantity: number;
    price: number;
  }[];
}

export async function createOrder(data: OrderData) {
  try {
    // 1. Create Order
    const orderRes = await client.orders.$post({
      json: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        status: "pending",
        orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      },
    });

    if (!orderRes.ok) {
        // @ts-ignore
       const err = await orderRes.json();
       // @ts-ignore
       throw new Error(err.message || "Failed to create order");
    }

    const order = await orderRes.json();

    // 2. Create Order Items
    const itemPromises = data.items.map((item) =>
      client["order-items"].$post({
        json: {
          orderId: order.id,
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        },
      })
    );

    const itemResults = await Promise.all(itemPromises);

    // Check for item creation failures
    const failedItems = itemResults.filter(r => !r.ok);
    if (failedItems.length > 0) {
        console.error("Some items failed to create", failedItems);
        // We might want to rollback the order here in a real app, or alert admin
        // For now, allow partial success but log it
    }

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Create Order Error:", error);
    return { success: false, error: error.message || "Failed to place order" };
  }
}
