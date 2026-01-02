import { ALLOW_USER_FIELDS } from "@/libs/backend";

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
export type SupabaseAllowFieldsUser = Pick<SupabaseUser, (typeof ALLOW_USER_FIELDS)[number]>

export type SupabaseRecord = {
  id: number;
  created_at: string;
  score: number;
  user_id: number;
};

export type SupabaseRankingViewItem = {
  user_id: SupabaseUser["id"];
  user_name: SupabaseUser["name"];
  score: SupabaseRecord["score"];
  record_id: SupabaseRecord["id"];
  created_at: SupabaseRecord["created_at"];
};
export type SupabaseUserStatsViewItem = {
    user_id: SupabaseUser["id"];
    play_count: number;
    highest_score: number;
}