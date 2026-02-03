import { useQuery } from "@tanstack/react-query";

import { listUsers } from "../actions/get-users";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
}

export const useGetUsers = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "" } = params;

  const query = useQuery({
    queryKey: ["users", { page, limit, search }],
    queryFn: async () => {
      return await listUsers(params);
    }
  });

  return query;
};
