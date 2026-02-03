import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

export const useGetOrderByID = (id: string) => {
  const query = useQuery({
    queryKey: ["orders", { id }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.orders[":id"].$get({
        param: { id }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }

      const data = await response.json();

      return data;
    }
  });

  return query;
};
