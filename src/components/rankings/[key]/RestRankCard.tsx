"use client";
import { memo } from "react";
import { useUserModal } from "@/contexts/UserModalContext";
import { OverrideProps, DistributiveOmit } from "fanyucomponents";
import { GlowText } from "../../GlowText";
import { cn } from "@/utils/className";
import { SupabaseStatsView } from "@/types/backend";
import { VALID_KEYS } from "@/libs/backend";
import { statsData } from "@/libs/rankings";
import { useUserCache } from "./useUserCache";
import { MyImage } from "@/components/MyImage";

type RestRankCardProps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLDivElement>, "children">,
  {
    item: SupabaseStatsView;
    rank: number;
    rankKey: (typeof VALID_KEYS)[number];
  }
>;

export const RestRankCard = memo(
  ({ item, rank, rankKey, className, ...rest }: RestRankCardProps) => {
    const modal = useUserModal();
    const user = useUserCache(item.user_id);

    return (
      <div
        className={cn(
          "card primary rounded-2xl flex items-center p-4 gap-4",
          className,
        )}
        {...rest}
      >
        <span className="text-[1.25em] text-(--muted) font-mono font-semibold shrink-0">
          #{rank}
        </span>

        <button
          className="flex items-center gap-2 group"
          onClick={() => modal.open(item.user_id)}
          tabIndex={0}
        >
          <div className="h-[2em] aspect-square overflow-hidden rounded-full">
            {user ? (
              <MyImage
                src={user.avatar}
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

        <div className="ms-auto flex items-end gap-1">
          {item[rankKey] != null ? (
            <>
              <GlowText className="text-[1.25em] font-bold tabular-nums font-mono shrink-0">
                {item[rankKey]?.toLocaleString() ?? 0}
              </GlowText>
              <span className="text-[0.75em] mb-1 text-(--muted)">
                {statsData[rankKey].unit}
              </span>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-5 w-12 bg-white/5 rounded skeleton" />
              <div className="h-3 w-8 bg-white/5 rounded skeleton" />
            </div>
          )}
        </div>
      </div>
    );
  },
);

RestRankCard.displayName = "RestRankCard";
