import { VALID_KEYS } from "./backend";

export const statsData: Record<
  (typeof VALID_KEYS)[number],
  {
    label: string;
    unit: string;
  }
> = {
  highest_score: { label: "最高紀錄", unit: "分" },
  play_count: { label: "遊玩次數", unit: "次" },
};
