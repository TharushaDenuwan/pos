import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetStaff = () => {
  return useQuery({
    queryKey: ["staff-profiles"],
    queryFn: async () => {
      const res = await client["staff-profiles"].$get({
        query: {
          limit: "100",
        },
      });

      if (!res.ok) {
        toast.error("Failed to load staff profiles");
        throw new Error("Failed to load staff profiles");
      }

      const json = await res.json();
      return json;
    },
  });
};
