import { OverrideProps, DistributiveOmit } from "fanyucomponents";

type RankBadgePorps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLSpanElement>, "children">,
  {
    index: number;
  }
>;
export const RankBadge = ({ index, ...rest }: RankBadgePorps) => {
  let children: string;
  switch (index) {
    case 0:
      children = "🥇";
      break;
    case 1:
      children = "🥈";
      break;
    case 2:
      children = "🥉";
      break;
    default:
      children = (index + 1).toString();
  }

  return <span {...rest}>{children}</span>;
};
