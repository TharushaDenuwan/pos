"use server";

import { client } from "@/lib/rpc";

export async function getAllOrders(params: any = {}) {
  // TODO: Add backend filtering support
  const query = {
    limit: "100",
    page: "1",
  };

  const res = await client.orders.$get({ query });

  if (!res.ok) {
    return { data: [] };
  }

  const json = await res.json();

  // Client-side filtering until API updated
  let filtered = json.data || [];

  if (params.status && params.status !== "all") {
    filtered = filtered.filter((o: any) => o.status === params.status);
  }

  if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter((o: any) =>
          (o.orderNumber?.toLowerCase().includes(search)) ||
          (o.customerName?.toLowerCase().includes(search))
      );
  }

  return { data: filtered };
}
