import { SupabaseUser } from "@/types/backend";

export const ALLOW_USER_FIELDS = [
  "id",
  "created_at",
  "name",
  "avatar",
] as const satisfies readonly (keyof SupabaseUser)[];
