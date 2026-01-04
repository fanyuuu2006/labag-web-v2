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
        className={cn(
          "card-primary flex items-center p-4 gap-4",
          className
        )}
        {...rest}
      >
        <span className="text-[0.8em] text-(--text-color-muted) font-mono font-semibold shrink-0">
          #{rank}
        </span>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span
            role="button"
            tabIndex={0}
            className="font-bold truncate cursor-pointer hover:text-(--text-color-primary) transition-colors max-w-full"
            onClick={() => modal.open(item.user_id)}
          >
            {item.user_name}
          </span>
          <time
            dateTime={new Date(item.created_at).toISOString()}
            className="text-[0.75em] text-(--text-color-muted) sm:hidden"
          >
            {formatDate("YYYY/MM/DD", item.created_at)}
          </time>
        </div>

        <GlowText className="text-[1.25em] font-bold font-mono tracking-wider shrink-0">
          {item.score}
        </GlowText>

        <time
          dateTime={new Date(item.created_at).toISOString()}
          title={formatDate("YYYY/MM/DD HH:mm:ss", item.created_at)}
          className="text-[0.75em] text-(--text-color-muted) hidden sm:block shrink-0 w-[8em] text-right"
        >
          {formatDate("YYYY/MM/DD", item.created_at)}
        </time>
      </div>
    );
  }
);

RestRankCard.displayName = "RestRankCard";
