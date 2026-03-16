import { VALID_KEYS } from "./backend";

export const statsData: Record<
  (typeof VALID_KEYS)[number],
  {
    label: string;
    unit: string;
  }
> = {
  user_coins: { label: "總金幣數", unit: "枚" },
  play_count: { label: "轉動次數", unit: "次" },
};
