import { useUserModal } from "@/contexts/UserModalContext";
import { SupabaseRankingViewItem } from "@/types/backend";
import { cn } from "@/utils/className";
import { GlowText } from "../GlowText";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import { formatDate } from "@/utils/date";

const MEDALS = ["🥇", "🥈", "🥉"];
const ORDER_CLASSES = ["order-2", "order-1", "order-3"];
const HEIGHT_CLASSES = ["h-[8em]", "h-[6em]", "h-[4em]"];
const COLOR_CLASSES = [
  "bg-yellow-500/20 border-yellow-500/50 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]",
  "bg-slate-400/20 border-slate-400/50 text-slate-300 shadow-[0_0_20px_rgba(148,163,184,0.2)]",
  "bg-orange-500/20 border-orange-500/50 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.2)]",
];
const SCALE_CLASSES = [
  "scale-100 z-10",
  "scale-90 z-9 mt-[2em]",
  "scale-85 z-8 mt-[4em]",
];

type PodiumItemProps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLDivElement>, "children">,
  {
    item: SupabaseRankingViewItem;
    index: number;
  }
>;
export const PodiumItem = ({
  item,
  index,
  className,
  ...rest
}: PodiumItemProps) => {
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
        <span className="text-[2.5em] drop-shadow-lg">{MEDALS[index]}</span>
        <span
          className="font-bold max-w-[14ch] truncate cursor-pointer hover:text-(--text-color-primary) transition-colors drop-shadow-md"
          onClick={() => modal.open(item.user_id)}
        >
          {item.user_name}
        </span>
        <div className="relative">
          <GlowText className="text-[1.5em] font-mono font-black tabular-nums tracking-wider">
            {item.score}
          </GlowText>
          {/** 日期 */}
          <time
            dateTime={new Date(item.created_at).toISOString()}
            title={formatDate("YYYY/MM/DD HH:mm:ss", item.created_at)}
            className="absolute top-full left-1/2 -translate-x-1/2 text-[0.5em] text-(--text-color-muted)"
          >
            {formatDate("(YYYY/MM/DD)", item.created_at)}
          </time>
        </div>
      </div>
      <div
        className={cn(
          "w-[7em] rounded-t-xl border-x-2 border-t-2 backdrop-blur-md flex items-end justify-center relative overflow-hidden group  mask-[linear-gradient(to_top,transparent,black_25%)]",
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
};
PodiumItem.displayName = "PodiumItem";
