import { memo } from "react";
import { useUserModal } from "@/contexts/UserModalContext";
import { cn } from "@/utils/className";
import { GlowText } from "../../GlowText";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import { SupabaseUserStatsViewItem } from "@/types/backend";
import { statsData } from "@/libs/rankings";
import { VALID_KEYS } from "@/libs/backend";

const MEDALS = ["🥇", "🥈", "🥉"];
const ORDER_CLASSES = ["order-2", "order-1", "order-3"];
const HEIGHT_CLASSES = ["h-[10em]", "h-[8em]", "h-[6em]"];
const COLOR_CLASSES = [
  "bg-yellow-500/40 border-yellow-300/50 text-yellow-200 shadow-[0_0_25px_rgba(234,179,8,0.6)] saturate-125",
  "bg-slate-400/30 border-slate-300/50 text-slate-100 shadow-[0_0_25px_rgba(148,163,184,0.5)] saturate-125",
  "bg-orange-500/40 border-orange-400/50 text-orange-200 shadow-[0_0_25px_rgba(249,115,22,0.6)] saturate-125",
];
const SCALE_CLASSES = [
  "scale-100 z-10",
  "scale-90 z-9",
  "scale-85 z-8",
];

type PodiumItemProps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLDivElement>, "children">,
  {
    item: SupabaseUserStatsViewItem;
    index: number;
    rankKey: (typeof VALID_KEYS)[number];
  }
>;

export const PodiumItem = memo(
  ({ item, index, rankKey, className, ...rest }: PodiumItemProps) => {
    const modal = useUserModal();

    return (
      <div
        className={cn(
          "flex flex-col items-center transition-all duration-500 hover:scale-110",
          ORDER_CLASSES[index],
          SCALE_CLASSES[index],
          className
        )}
        {...rest}
      >
        <div className="flex flex-col items-center gap-1 mb-[0.75em]">
          <span
            className="text-[2.5em] drop-shadow-lg"
            role="img"
            aria-label={`排行 ${index + 1} 獎牌`}
          >
            {MEDALS[index]}
          </span>
          <button
            type="button"
            className="font-bold max-w-[14ch] truncate hover:text-(--primary)"
            onClick={() => modal.open(item.user_id)}
            title={`查看 ${item.user_name} 的資料`}
          >
            {item.user_name}
          </button>
          <div className="flex items-end gap-1">
            <GlowText className="text-[1.5em] font-mono font-black tabular-nums">
              {item[rankKey].toLocaleString()}
            </GlowText>
            <span className="text-[0.75em] mb-1 text-(--muted)">
              {statsData[rankKey].unit}
            </span>
          </div>
        </div>
        <div
          className={cn(
            "min-w-[6em] w-full rounded-t-xl border-x-2 border-t-2 backdrop-blur-md flex items-end justify-center relative overflow-hidden group mask-[linear-gradient(to_top,transparent,black_25%)]",
            HEIGHT_CLASSES[index],
            COLOR_CLASSES[index]
          )}
        >
          {/** 底部漸層遮罩 */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
          {/** 滑鼠懸停遮罩 */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/5" />
        </div>
      </div>
    );
  }
);
PodiumItem.displayName = "PodiumItem";
