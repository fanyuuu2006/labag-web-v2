import { ALLOW_USER_FIELDS } from "@/libs/backend";
import { Pattern, Payout } from "labag";

export type SignBy = "google";

export type BackendResponse<T> = {
  data: T | null;
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
export type SupabaseAllowFieldsUser = Pick<
  SupabaseUser,
  (typeof ALLOW_USER_FIELDS)[number]
>;

export type SupabaseSpin = {
  id: number; // primary key
  created_at: string;
  user_id: SupabaseUser["id"];
  bet: number;
  reward: number;
  reels: Pattern[];
};


export type SupabaseStatsView = {
  user_id: SupabaseUser["id"];
  user_name: SupabaseUser["name"];
  play_count: number;
  user_coins: number;
};


export type PatternWithPayouts = Pattern & {
  probability: number;
  payouts: Payout[];
};
