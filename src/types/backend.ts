export type SignBy = "google";

export type BackendResponse<T> = {
  data: T;
  message?: string;
};
export type SupabaseUser = {
  id: number;
  created_at: string;
  name: string;
  email?: string;
  avatar?: string;
  provider_id?: string;
};

export type SupabaseRecord = {
  id: number;
  created_at: string;
  score: number;
  user_id: number;
};
