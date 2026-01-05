import { memo } from "react";
import { useUserModal } from "@/contexts/UserModalContext";
import { OverrideProps, DistributiveOmit } from "fanyucomponents";
import { GlowText } from "../../GlowText";
import { cn } from "@/utils/className";
import { SupabaseUserStatsViewItem } from "@/types/backend";
import { VALID_KEYS } from "@/libs/backend";
import { statsData } from "@/libs/rankings";

type RestRankCardProps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLDivElement>, "children">,
  {
    item: SupabaseUserStatsViewItem;
    rank: number;
    rankKey: (typeof VALID_KEYS)[number];
  }
>;

export const RestRankCard = memo(
  ({ item, rank, rankKey, className, ...rest }: RestRankCardProps) => {
    const modal = useUserModal();

    return (
      <div
        className={cn("card-primary flex items-center p-4 gap-4", className)}
        {...rest}
      >
        <span className="text-[1.25em] text-(--text-color-muted) font-mono font-semibold shrink-0">
          #{rank}
        </span>

        <span
          role="button"
          tabIndex={0}
          className="font-bold  max-w-[14ch] truncate cursor-pointer hover:text-(--text-color-primary) transition-colors"
          onClick={() => modal.open(item.user_id)}
        >
          {item.user_name}
        </span>

        <div className="ms-auto flex items-end gap-1">
          <GlowText className="text-[1.25em] font-bold tabular-nums font-mono tracking-wider shrink-0">
            {item[rankKey]}
          </GlowText>
          <span className="text-[0.75em] mb-1 text-(--text-color-muted)">
            {statsData[rankKey].unit}
          </span>
        </div>
      </div>
    );
  }
);

RestRankCard.displayName = "RestRankCard";
