import { SupabaseUser, SupabaseUserStatsViewItem } from "@/types/backend";

export const ALLOW_USER_FIELDS = [
  "id",
  "created_at",
  "name",
  "avatar",
] satisfies readonly (keyof SupabaseUser)[];

export const VALID_KEYS = [
  "play_count",
  "highest_score",
] satisfies readonly (keyof SupabaseUserStatsViewItem)[];

export const statsLabels: Record<(typeof VALID_KEYS)[number], string> = {
  play_count: "遊玩次數",
  highest_score: "最高分數",
};
