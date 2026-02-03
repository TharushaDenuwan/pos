import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum
} from "nuqs/server";

export enum Sort {
  asc = "asc",
  desc = "desc"
}

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  sort: parseAsStringEnum<Sort>(Object.values(Sort)).withDefault(Sort.desc),
  q: parseAsString
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
