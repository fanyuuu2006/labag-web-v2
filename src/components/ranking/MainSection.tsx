import { SupabaseRankingViewItem } from "@/types/backend";
import { formatDate } from "@/utils/date";
import Link from "next/link";
import { GlowText } from "../GlowText";
import { cn } from "@/utils/className";

export const MainSection = ({
  items,
}: {
  items: SupabaseRankingViewItem[];
}) => {
  return (
    <section className="h-full flex flex-col items-center justify-center p-4 md:p-6">
      <div className="card w-full max-w-3xl flex flex-col gap-6 p-6 md:p-8 max-h-full overflow-hidden relative shadow-2xl border-2 border-(--border-color)">
        {/* Title */}
        <div className="text-center shrink-0">
          <GlowText
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wider"
          >
            排行榜
          </GlowText>
          <div className="h-1 w-24 mx-auto mt-4 bg-gradient-to-r from-transparent via-(--text-color-primary) to-transparent opacity-50 rounded-full" />
        </div>

        {/* List Header */}
        <div className="grid grid-cols-[3rem_1fr_auto] sm:grid-cols-[4rem_1fr_auto_auto] gap-4 px-4 py-2 text-(--text-color-muted) text-sm font-bold border-b border-(--border-color) shrink-0">
          <div className="text-center">#</div>
          <div className="text-left">玩家</div>
          <div className="text-right w-24">分數</div>
          <div className="text-right w-24 hidden sm:block">日期</div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-2 px-2 custom-scrollbar space-y-1">
          {items.map((item, index) => {
            const rank = index + 1;
            let rankStyle = "text-(--text-color-muted) font-bold";
            let rowBg = "hover:bg-white/5";
            
            if (rank === 1) {
              rankStyle = "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] text-xl";
              rowBg = "bg-yellow-400/10 hover:bg-yellow-400/20 border-yellow-400/30";
            } else if (rank === 2) {
              rankStyle = "text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.6)] text-xl";
              rowBg = "bg-gray-300/10 hover:bg-gray-300/20 border-gray-300/30";
            } else if (rank === 3) {
              rankStyle = "text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.6)] text-xl";
              rowBg = "bg-amber-600/10 hover:bg-amber-600/20 border-amber-600/30";
            }

            return (
              <Link
                key={item.record_id}
                href={`/profile/${item.user_id}`}
                className={cn(
                  "grid grid-cols-[3rem_1fr_auto] sm:grid-cols-[4rem_1fr_auto_auto] gap-4 px-4 py-3 items-center rounded-lg transition-all duration-200 border border-transparent",
                  rowBg
                )}
              >
                <div className={cn("text-center font-mono", rankStyle)}>
                  {rank}
                </div>
                <div className="text-left truncate font-medium text-(--text-color) group-hover:text-(--text-color-primary) transition-colors">
                  {item.user_name}
                </div>
                <div className="text-right font-mono font-bold text-(--text-color-secondary) w-24">
                  {item.score.toLocaleString()}
                </div>
                <div className="text-right text-xs text-(--text-color-muted) w-24 hidden sm:block">
                  {formatDate("YYYY/MM/DD HH:mm:ss", item.created_at)}
                </div>
              </Link>
            );
          })}
          
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-(--text-color-muted)">
              <p>暫無排名資料</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
