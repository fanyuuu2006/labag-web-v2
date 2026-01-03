import {
  BackendResponse,
  SupabaseAllowFieldsUser,
  SupabaseRankingViewItem,
  SupabaseRecord,
  SupabaseUser,
  SupabaseUserStatsViewItem,
} from "@/types/backend";
import { fetcher } from "./fetcher";
import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";

export const userMe = (token: string) =>
  fetcher<BackendResponse<SupabaseUser>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const userById = (id: SupabaseUser["id"]) =>
  fetcher<BackendResponse<SupabaseAllowFieldsUser>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/users/${id}`
  );

export const records = (queryParams?: Record<"count", string>) => {
  const param = new URLSearchParams(queryParams);
  const query = param.toString();
  return fetcher<BackendResponse<SupabaseRecord[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/records${query ? `?${query}` : ""}`
  );
};
export const recordsById = (
  id: SupabaseUser["id"],
  queryParams?: Record<"count", string>
) => {
  const param = new URLSearchParams(queryParams);
  const query = param.toString();
  return fetcher<BackendResponse<SupabaseRecord[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/users/${id}/records${
      query ? `?${query}` : ""
    }`
  );
};

export const statsById = (id: SupabaseUser["id"]) =>
  fetcher<BackendResponse<SupabaseUserStatsViewItem>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/users/${id}/stats`
  );

export const ranking = () =>
  fetcher<BackendResponse<SupabaseRankingViewItem[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/ranking`
  );
