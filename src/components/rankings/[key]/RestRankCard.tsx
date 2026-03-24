import { memo, useEffect, useState } from "react";
import { useUserModal } from "@/contexts/UserModalContext";
import { OverrideProps, DistributiveOmit } from "fanyucomponents";
import { GlowText } from "../../GlowText";
import { cn } from "@/utils/className";
import { SupabaseStatsView } from "@/types/backend";
import { VALID_KEYS } from "@/libs/backend";
import { statsData } from "@/libs/rankings";
import { userById } from "@/utils/backend";
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
    const [user, setUser] =
      useState<Awaited<ReturnType<typeof userById>>["data"]>(null);

    useEffect(() => {
      userById(item.user_id).then(({ data }) => {
        if (data) {
          setUser(data);
        }
      });
    }, [item.user_id]);

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
            <MyImage
              src={user?.avatar}
              alt={`${user?.name} 的頭像`}
              className="object-cover w-full h-full"
            />
          </div>

          <span className="font-bold max-w-[14ch] truncate group-hover:text-(--primary) transition-colors">
            {item.user_name}
          </span>
        </button>

        <div className="ms-auto flex items-end gap-1">
          <GlowText className="text-[1.25em] font-bold tabular-nums font-mono shrink-0">
            {item[rankKey]?.toLocaleString() ?? 0}
          </GlowText>
          <span className="text-[0.75em] mb-1 text-(--muted)">
            {statsData[rankKey].unit}
          </span>
        </div>
      </div>
    );
  },
);

RestRankCard.displayName = "RestRankCard";
