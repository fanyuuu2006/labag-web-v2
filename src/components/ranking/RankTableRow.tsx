import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import Link from "next/link";
import { GlowText } from "../GlowText";
import { RankBadge } from "./RankBadge";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import { SupabaseRankingViewItem } from "@/types/backend";

type RankTableRowProps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLTableRowElement>, "children">,
  {
    item: SupabaseRankingViewItem;
    index: number;
  }
>;

export const RankTableRow = ({ item, className, index }: RankTableRowProps) => {
  return (
    <tr
      className={cn(
        "transition-colors",
        {
          "bg-yellow-400/30": index === 0, // 🥇
          "bg-slate-300/30": index === 1, // 🥈
          "bg-orange-400/30": index === 2, // 🥉
        },
        className
      )}
      key={item.record_id}
      id={item.record_id.toString()}
    >
      <td className="p-2 text-center">
        <RankBadge index={index} />
      </td>
      <td className={cn("p-2 text-center max-w-[8ch] truncate")}>
        <Link
          href={`/profile/${item.user_id}`}
          className="font-semibold hover:underline"
        >
          {item.user_name}
        </Link>
      </td>
      <td className="p-2 text-center font-bold">
        <GlowText>{item.score}</GlowText>
      </td>
      <td className="p-2 text-center text-(--text-color-muted) text-[0.5em]">
        <div className="flex flex-col">
          {formatDate("YYYY/MM/DD\nHH:mm:ss", item.created_at)
            .split("\n")
            .map((line, idx) => (
              <span key={idx}>{line}</span>
            ))}
        </div>
      </td>
    </tr>
  );
};
