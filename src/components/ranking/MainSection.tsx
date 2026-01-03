import { SupabaseRankingViewItem } from "@/types/backend";
import { formatDate } from "@/utils/date";
import Link from "next/link";
import { GlowText } from "../GlowText";
import { cn } from "@/utils/className";
import { useMemo } from "react";

export const MainSection = ({
  items,
}: {
  items: SupabaseRankingViewItem[];
}) => {
  const orderedItems = useMemo(() => {
    return items.sort((a, b) => b.score - a.score);
  }, [items]);

  const getRankDisplay = (index: number) => {
    switch (index) {
      case 0:
        return <span className="text-2xl">🥇</span>;
      case 1:
        return <span className="text-2xl">🥈</span>;
      case 2:
        return <span className="text-2xl">🥉</span>;
      default:
        return (
          <span className="text-lg font-bold text-(--text-color-muted)">
            {index + 1}
          </span>
        );
    }
  };

  return (
    <section className="h-full flex flex-col items-center justify-center p-4 md:p-6">
      <div className="card w-full max-w-3xl flex flex-col gap-4 p-4 md:p-6 max-h-full overflow-hidden">
        <div className="flex justify-center items-center py-2">
          <GlowText
            as="h2"
            className="text-3xl sm:text-4xl font-extrabold tracking-wider"
          >
            排行榜
          </GlowText>
        </div>

        {/* Header Row */}
        <div className="grid grid-cols-[3rem_1fr_auto_auto] gap-2 px-4 py-2 border-b border-(--border-color) text-(--text-color-muted) text-sm font-bold">
          <div className="text-center">#</div>
          <div>玩家</div>
          <div className="text-right w-20 md:w-24">分數</div>
          <div className="text-right w-24 md:w-32">日期</div>
        </div>

        {/* List */}
        {orderedItems.length > 0 ? (
          <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1 pr-1">
            {orderedItems.map((item, index) => (
              <div
                key={item.record_id}
                className={cn(
                  "grid grid-cols-[3rem_1fr_auto_auto] gap-2 px-4 py-3 items-center rounded-lg transition-colors",
                  "hover:bg-(--background-color-primary)/20",
                  index % 2 === 0 ? "bg-(--background-color-primary)/5" : ""
                )}
              >
                {/* Rank */}
                <div className="flex justify-center items-center">
                  {getRankDisplay(index)}
                </div>

                {/* Player */}
                <div className="truncate">
                  <Link
                    href={`/profile/${item.user_id}`}
                    className="text-base font-medium hover:text-(--text-color-primary) transition-colors"
                  >
                    {item.user_name}
                  </Link>
                </div>

                {/* Score */}
                <div className="text-right w-20 md:w-24">
                  <span className="font-mono text-lg font-bold text-(--text-color-secondary)">
                    {item.score.toLocaleString()}
                  </span>
                </div>

                {/* Date */}
                <div className="text-right w-24 md:w-32 text-sm text-(--text-color-muted)">
                  {formatDate("YYYY/MM/DD", item.created_at)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 min-h-32 text-(--text-color-muted)">
            <p>暫無排名資料</p>
          </div>
        )}
      </div>
    </section>
  );
};
