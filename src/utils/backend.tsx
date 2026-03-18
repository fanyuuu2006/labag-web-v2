import {
  BackendResponse,
  SupabaseAllowFieldsUser,
  SupabaseUser,
  SupabaseStatsView,
  SupabaseSpin,
  PatternWithPayouts,
  SupabaseShare,
} from "@/types/backend";
import { fetcher } from "./fetcher";
import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";

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

export const postSpins = (token: string) =>
  fetcher<BackendResponse<SupabaseSpin>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/game/spins`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export const getDefaultBet = () => {
  return fetcher<BackendResponse<number>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/game/spins/default-bet`,
  );
};

export const spinsByUserId = (
  id: SupabaseUser["id"],
  query?: Partial<{ count: `${number}` }>,
) => {
  const param = new URLSearchParams(query || {});
  const queryStr = param.toString();
  return fetcher<BackendResponse<SupabaseSpin[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/users/${id}/spins${queryStr ? `?${queryStr}` : ""}`,
  );
};

export const statsById = (id: SupabaseUser["id"]) =>
  fetcher<BackendResponse<SupabaseStatsView>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/users/${id}/stats`,
  );

export const statsByKey = (
  key: keyof SupabaseStatsView,
  queryParams?: Partial<{
    ascending?: `${boolean}`;
    count?: `${number}`;
  }>,
) => {
  const param = new URLSearchParams(queryParams || {});
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
  return fetcher<BackendResponse<PatternWithPayouts[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/game/patterns`,
  );
};

export const patternById = async (id: PatternWithPayouts["id"]) => {
  return fetcher<BackendResponse<PatternWithPayouts>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/game/patterns/${id}`,
  );
};

export const createShare = (token: string) =>
  fetcher<BackendResponse<SupabaseShare>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/shares`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export const shareClicked = (id: SupabaseShare["id"]) =>
  fetcher<BackendResponse<SupabaseShare>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/shares/${id}`,
    {
      method: "GET",
    },
  );
