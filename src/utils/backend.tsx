import { BackendResponse, SupabaseRecord, SupabaseUser } from "@/types/backend";
import { fetcher } from "./fetcher";
import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";
import { ALLOW_USER_FIELDS } from "@/libs/backend";

export const userProfile = (token: string) =>
  fetcher<BackendResponse<SupabaseUser>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/users/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const userById = (id: SupabaseUser["id"]) =>
  fetcher<
    BackendResponse<Pick<SupabaseUser, (typeof ALLOW_USER_FIELDS)[number]>>
  >(`${NEXT_PUBLIC_BACKEND_URL}/v1/data/users/${id}`);

export const records = () =>
  fetcher<BackendResponse<SupabaseRecord[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/records`
  );
export const recordsById = (id: SupabaseUser["id"]) =>
  fetcher<BackendResponse<SupabaseRecord[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/records/${id}`
  );
