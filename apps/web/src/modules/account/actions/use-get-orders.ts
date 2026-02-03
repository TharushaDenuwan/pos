import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

export interface FilterParams {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc" | null;
  search?: string | null;
}

export const useGetMyOrders = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["orders", { page, limit, search, sort }],
    queryFn: async () => {
      const queryParams = {
        page: page.toString(),
        limit: limit.toString(),
        sort: sort || "desc",
        ...(search && { search })
      };

      const rpcClient = await getClient();

      const response = await rpcClient.api.orders["my-orders"].$get({
        query: queryParams
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      return data;
    }
  });

  return query;
};
