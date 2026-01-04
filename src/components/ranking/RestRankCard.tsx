import { memo } from "react";
import { useUserModal } from "@/contexts/UserModalContext";
import { SupabaseRankingViewItem } from "@/types/backend";
import { OverrideProps, DistributiveOmit } from "fanyucomponents";
import { GlowText } from "../GlowText";
import { formatDate } from "@/utils/date";
import { cn } from "@/utils/className";

type RestRankCardProps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLDivElement>, "children">,
  {
    item: SupabaseRankingViewItem;
    rank: number;
  }
>;

export const RestRankCard = memo(
  ({ item, rank, className, ...rest }: RestRankCardProps) => {
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

        <div className="ms-auto flex flex-col items-end">
          <GlowText className="text-[1.25em] font-bold font-mono tracking-wider shrink-0">
            {item.score}
          </GlowText>

          <time
            dateTime={new Date(item.created_at).toISOString()}
            title={formatDate("YYYY/MM/DD HH:mm:ss", item.created_at)}
            className="text-[0.5em] text-(--text-color-muted) shrink-0"
          >
            {formatDate("YYYY/MM/DD", item.created_at)}
          </time>
        </div>
      </div>
    );
  }
);

RestRankCard.displayName = "RestRankCard";
