import { useQuery } from "@tanstack/react-query";

import { getUser } from "../actions/get-user";

interface FilterParams {
  userId: string;
}

export const useGetUser = (params: FilterParams) => {
  const { userId } = params;

  const query = useQuery({
    queryKey: ["users", { userId }],
    queryFn: async () => {
      return await getUser({ userId });
    }
  });

  return query;
};
