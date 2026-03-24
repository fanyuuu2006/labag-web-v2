import { memo } from "react";
import { useUserModal } from "@/contexts/UserModalContext";
import { cn } from "@/utils/className";
import { GlowText } from "../../GlowText";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import { SupabaseStatsView } from "@/types/backend";
import { VALID_KEYS } from "@/libs/backend";
import { useUserCache } from "./useUserCache";
import { MyImage } from "@/components/MyImage";

const MEDALS = ["👑", "🥈", "🥉"];
const ORDER_CLASSES = ["order-2", "order-1", "order-3"];
const HEIGHT_CLASSES = ["h-[10em]", "h-[8em]", "h-[6em]"];
const COLOR_CLASSES = [
  "bg-yellow-500/40 border-yellow-300/50 text-yellow-200 shadow-[0_0_25px_rgba(234,179,8,0.6)] saturate-125",
  "bg-slate-400/30 border-slate-300/50 text-slate-100 shadow-[0_0_25px_rgba(148,163,184,0.5)] saturate-125",
  "bg-orange-500/40 border-orange-400/50 text-orange-200 shadow-[0_0_25px_rgba(249,115,22,0.6)] saturate-125",
];
const SCALE_CLASSES = ["scale-100 z-10", "scale-90 z-9", "scale-85 z-8"];

type PodiumItemProps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLDivElement>, "children">,
  {
    item: SupabaseStatsView;
    index: number;
    rankKey: (typeof VALID_KEYS)[number];
  }
>;

export const PodiumItem = memo(
  ({ item, index, rankKey, className, ...rest }: PodiumItemProps) => {
    const modal = useUserModal();
    const user = useUserCache(item.user_id);

    return (
      <div
        className={cn(
          "flex flex-col items-center transition-all duration-500 hover:scale-110",
          ORDER_CLASSES[index],
          SCALE_CLASSES[index],
          className,
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
            className="flex flex-col items-center gap-1 group"
            onClick={() => modal.open(item.user_id)}
            tabIndex={0}
          >
            <div className="card h-[2em] aspect-square overflow-hidden rounded-full">
              {user ? (
                <MyImage
                  src={user.avatar}
                  fallbackSrc={"/default-avatar.jpg"}
                  alt={`${user.name} 的頭像`}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-white/5 skeleton" />
              )}
            </div>

            {user ? (
              <span className="font-bold max-w-[14ch] truncate group-hover:text-(--primary) transition-colors">
                {user.name}
              </span>
            ) : (
              <div className="h-4 w-32 bg-white/5 rounded skeleton" />
            )}
          </button>
          <div className="flex items-end gap-1">
            <GlowText className="text-[1.5em] font-mono font-black tabular-nums">
              {item[rankKey]?.toLocaleString() ?? 0}
            </GlowText>
          </div>
        </div>

        {/** 頒獎台 */}
        <div
          className={cn(
            "w-[6.5em] md:w-[8em] rounded-t-xl border-x-2 border-t-2 backdrop-blur-md flex items-end justify-center relative overflow-hidden group",
            HEIGHT_CLASSES[index],
            COLOR_CLASSES[index],
          )}
        >
          {/** 底部漸層遮罩 */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
      </div>
    );
  },
);
PodiumItem.displayName = "PodiumItem";
