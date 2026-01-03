import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { GlowText } from "../GlowText";
import { RankBadge } from "./RankBadge";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import { SupabaseRankingViewItem } from "@/types/backend";

import { memo } from "react";
import { useUserModal } from "@/contexts/UserModalContext";

type RankTableRowProps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLTableRowElement>, "children">,
  {
    item: SupabaseRankingViewItem;
    index: number;
  }
>;

export const RankTableRow = memo(
  ({ item, className, index, ...props }: RankTableRowProps) => {
    const modal = useUserModal();
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
        <td className={cn("text-[0.75em] p-2")}>
          <button
            className="max-w-[14ch] truncate block text-center m-auto"
            onClick={() => {
              modal.open(item.user_id);
            }}
          >
            {item.user_name || "未知玩家"}
          </button>
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
  }
);

RankTableRow.displayName = "RankTableRow";
