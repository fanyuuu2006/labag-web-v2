import { Pattern, Payout } from "labag";
import { patterns, payouts } from "./backend";


export const getPatternInfo = async (
  id: Pattern["id"],
): Promise<
  (Pattern & {
    payouts: Payout[];
    rate: number;
  }) | null
> => {
  const { data: patternsData } = await patterns();
  const { data: payoutData } = await payouts();

  if (!patternsData || !payoutData) {
    return null;
  }

  const pattern = patternsData.find((p) => p.id === id);
  if (!pattern) {
    return null;
  }

  const patternPayouts = payoutData.filter((p) => p.pattern_id === id);
  const totalWeight = patternsData.reduce(
    (sum, pattern) => sum + pattern.weight,
    0,
  );
  const rate = totalWeight > 0 ? (pattern.weight / totalWeight) * 100 : 0;

  return {
    ...pattern,
    payouts: patternPayouts,
    rate,
  };
};
