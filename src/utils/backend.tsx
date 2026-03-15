import {
  BackendResponse,
  SupabaseAllowFieldsUser,
  SupabaseUser,
  SupabaseStatsView,
  SupabaseSpin,
} from "@/types/backend";
import { fetcher } from "./fetcher";
import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";
import { Pattern, Payout } from "labag";

export const userMe = (token: string) =>
  fetcher<BackendResponse<SupabaseUser>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export const userById = (id: SupabaseUser["id"]) =>
  fetcher<BackendResponse<SupabaseAllowFieldsUser>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/users/${id}`,
  );

export const spinsByUserId = (id: SupabaseUser["id"]) =>
  fetcher<BackendResponse<SupabaseSpin[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/game/spins/${id}`,
  );

export const statsById = (id: SupabaseUser["id"]) =>
  fetcher<BackendResponse<SupabaseStatsView>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/users/${id}/stats`,
  );

export const statsByKey = (
  key: keyof SupabaseStatsView,
  queryParams?: {
    ascending?: `${boolean}`;
    count?: `${number}`;
  },
) => {
  const param = new URLSearchParams(queryParams);
  const query = param.toString();
  return fetcher<BackendResponse<SupabaseStatsView[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/game/stats/${key}${query ? `?${query}` : ""}`,
  );
};

export const refreshAccessToken = (refreshToken: string) =>
  fetcher<BackendResponse<{ accessToken: string; refreshToken: string }>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/auth/refresh/`,
    {
      method: "POST",
      body: JSON.stringify({ refreshToken: refreshToken }),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

export const patterns = async () => {
  return fetcher<BackendResponse<Pattern[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/game/patterns`,
  );
};

export const payouts = async () => {
  return fetcher<BackendResponse<Payout[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/game/payouts`,
  );
};

export const patternById = async (id: Pattern["id"]) => {
  return fetcher<BackendResponse<Pattern>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/game/patterns/${id}`,
  );
};

export const payoutsByPatternId = async (id: Pattern["id"]) => {
  return fetcher<BackendResponse<number[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/game/patterns/${id}/payouts`,
  );
};
