"use server";

import { getClient } from "@/lib/rpc/server";

type GetHousingParams = {
  page?: string;
  limit?: string;
  sort?: "asc" | "desc";
  search?: string;
};

export async function getAllHousing({
  page = "1",
  limit = "8",
  sort = "desc",
  search = "",
}: GetHousingParams = {}) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.housing.$get({
    query: {
      page,
      limit,
      sort,
      search,
    },
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const data = await response.json();
  return data;
}
