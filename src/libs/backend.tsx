import { SupabaseUser, SupabaseUserStatsViewItem } from "@/types/backend";

export const ALLOW_USER_FIELDS = [
  "id",
  "created_at",
  "name",
  "avatar",
] satisfies readonly (keyof SupabaseUser)[];

export const VALID_KEYS = [
  "highest_score",
  "play_count",
] satisfies readonly (keyof SupabaseUserStatsViewItem)[];

export const statsLabels: Record<(typeof VALID_KEYS)[number], string> = {
  highest_score: "最高分數",
  play_count: "遊玩次數",
};
