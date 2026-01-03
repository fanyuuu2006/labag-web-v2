import { memo } from "react";
import { OverrideProps, DistributiveOmit } from "fanyucomponents";

type RankBadgeProps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLSpanElement>, "children">,
  {
    index: number;
  }
>;

const MEDALS = ["🥇", "🥈", "🥉"];

export const RankBadge = memo(({ index, ...rest }: RankBadgeProps) => {
  const content =
    index < MEDALS.length ? MEDALS[index] : (index + 1).toString();

  return <span {...rest}>{content}</span>;
});

RankBadge.displayName = "RankBadge";
