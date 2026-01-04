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
const RANK_CLASS: Record<number, string> = {
  0: "bg-yellow-400/50 hover:bg-yellow-400/60", // 🥇
  1: "bg-slate-300/50 hover:bg-slate-300/60", // 🥈
  2: "bg-orange-400/50 hover:bg-orange-400/60", // 🥉
};
export const RankTableRow = memo(
  ({ item, className, index, ...props }: RankTableRowProps) => {
    const modal = useUserModal();
    return (
      <tr
        className={cn(
          "transition-colors border border-white/20 hover:bg-white/10",
          RANK_CLASS[index] || "",
          className
        )}
        key={item.record_id}
        id={item.record_id.toString()}
        {...props}
      >
        <td className="p-2 text-center">
          <RankBadge index={index} />
        </td>
        <td className={cn("text-[0.75em] font-bold p-2")}>
          <span
            role="button"
            tabIndex={0}
            className="max-w-[14ch] truncate block text-center m-auto cursor-pointer"
            onClick={() => {
              modal.open(item.user_id);
            }}
          >
            {item.user_name || "未知玩家"}
          </span>
        </td>
        <td className="p-2 text-center font-extrabold">
          <GlowText>{item.score.toLocaleString()}</GlowText>
        </td>
        <td className="p-2 text-center text-(--text-color-muted) text-[0.5em]">
          <div className="whitespace-pre-line font-mono leading-tight">
            {formatDate("YYYY/MM/DD\nHH:mm", item.created_at)}
          </div>
        </td>
      </tr>
    );
  }
);

RankTableRow.displayName = "RankTableRow";
