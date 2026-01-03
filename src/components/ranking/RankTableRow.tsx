import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import Link from "next/link";
import { GlowText } from "../GlowText";
import { RankBadge } from "./RankBadge";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import { SupabaseRankingViewItem } from "@/types/backend";

import { memo } from "react";

type RankTableRowProps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLTableRowElement>, "children">,
  {
    item: SupabaseRankingViewItem;
    index: number;
  }
>;

export const RankTableRow = memo(({ item, className, index, ...props }: RankTableRowProps) => {
  return (
    <tr
      className={cn(
        "transition-colors border border-white/25",
        {
          "bg-yellow-400/30": index === 0, // 🥇
          "bg-slate-300/30": index === 1, // 🥈
          "bg-orange-400/30": index === 2, // 🥉
        },
        className
      )}
      key={item.record_id}
      id={item.record_id.toString()}
      {...props}
    >
      <td className="p-2 text-center">
        <RankBadge index={index} />
      </td>
      <td className={cn("p-2 flex items-center justify-center")}>
        <Link
          href={`/profile/${item.user_id}`}
          className="max-w-[14ch] truncate block"
        >
          {item.user_name || "未知玩家"}
        </Link>
      </td>
      <td className="p-2 text-center font-extrabold">
        <GlowText>{item.score}</GlowText>
      </td>
      <td className="p-2 text-center text-(--text-color-muted) text-[0.5em]">
        <div className="whitespace-pre-line leading-tight">
          {formatDate("YYYY/MM/DD\nHH:mm:ss", item.created_at)}
        </div>
      </td>
    </tr>
  );
});

RankTableRow.displayName = "RankTableRow";
