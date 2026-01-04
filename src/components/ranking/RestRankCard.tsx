import { useUserModal } from "@/contexts/UserModalContext";
import { SupabaseRankingViewItem } from "@/types/backend";
import { OverrideProps, DistributiveOmit } from "fanyucomponents";
import { GlowText } from "../GlowText";
import { formatDate } from "@/utils/date";

type RestRankCardProps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLDivElement>, "children">,
  {
    item: SupabaseRankingViewItem;
    rank: number;
  }
>;

export const RestRankCard = ({ item, rank }: RestRankCardProps) => {
  const modal = useUserModal();
  return (
    <div className="card-primary flex items-center p-4 gap-4">
      <span className="text-[0.8em] text-(--text-color-muted) font-semibold">
        #{rank}
      </span>
      <span
        className="font-bold max-w-[14ch] truncate cursor-pointer hover:text-(--text-color-primary) transition-colors"
        onClick={() => modal.open(item.user_id)}
      >
        {item.user_name}
      </span>
      <GlowText className="text-[1.25em] ms-auto font-bold font-mono tracking-wider">
        {item.score}
      </GlowText>
      <time
        dateTime={new Date(item.created_at).toISOString()}
        title={formatDate("YYYY/MM/DD HH:mm:ss", item.created_at)}
        className="text-[0.75em] text-(--text-color-muted)"
      >
        {formatDate("YYYY/MM/DD", item.created_at)}
      </time>
    </div>
  );
};
