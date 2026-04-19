import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface ProductsFilter {
  category?: string;
  isFeatured?: boolean;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  limit?: string;
}

export const useGetProducts = (filter: ProductsFilter = {}) => {
  return useQuery({
    queryKey: ["products", filter],
    queryFn: async () => {
      // Build query string object compatible with router schema
      const queryParams: any = {
        limit: filter.limit || "50",
      };

      if (filter.category) {
        queryParams.category = filter.category.toLowerCase();
      }

      if (filter.isFeatured !== undefined) {
        queryParams.isFeatured = String(filter.isFeatured);
      }

      if (filter.search) {
        queryParams.search = filter.search;
      }

      if (filter.sort) {
        queryParams.sort = filter.sort as any;
      }

      const res = await client.products.$get({
        query: queryParams,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const json = await res.json();
      return json;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
