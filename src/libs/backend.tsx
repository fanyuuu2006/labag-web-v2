import { SupabaseUser, SupabaseStatsView } from "@/types/backend";

export const ALLOW_USER_FIELDS = [
  "id",
  "created_at",
  "name",
  "avatar",
] satisfies readonly (keyof SupabaseUser)[];

export const VALID_KEYS = [
  'user_coins',
  "play_count",
] satisfies readonly (keyof SupabaseStatsView)[];
