import { game } from "@/libs/game";
import { Pattern } from "labag";

export const getPatternInfo = (
  pattern: Pattern
): {
  name: string;
  scores: number[];
  rate: number;
} => {
  const { ranges } = game.getCurrentConfig();

  if (ranges.length === 0) {
    return { name: pattern.name, scores: pattern.scores, rate: 0 };
  }

  const index = ranges.findIndex((r) => r.pattern.name === pattern.name);

  if (index === -1) {
    return { name: pattern.name, scores: pattern.scores, rate: 0 };
  }

  const prevThreshold = ranges[index - 1]?.threshold ?? 0;
  const currentThreshold = ranges[index].threshold;
  const totalThreshold = ranges.at(-1)!.threshold;

  const rate = Math.round((currentThreshold - prevThreshold) / totalThreshold * 100);

  return {
    name: pattern.name,
    scores: pattern.scores,
    rate,
  };
};