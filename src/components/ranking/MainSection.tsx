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
      <div className="card w-full max-w-4xl flex flex-col gap-4 md:gap-6 p-4 md:p-8 max-h-full overflow-hidden relative">
        {/* Header with Title and Back Button */}
        <div className="flex items-center justify-between shrink-0 relative">
          <Link
            href="/"
            className="btn-secondary px-4 py-2 rounded-full text-sm md:text-base font-bold z-10"
          >
            ← 返回
          </Link>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <GlowText
              as="h2"
              className="text-2xl sm:text-4xl font-extrabold"
            >
              排行榜
            </GlowText>
          </div>
          <div className="w-[70px] hidden sm:block"></div>{" "}
          {/* Spacer for centering title on larger screens */}
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-y-auto min-h-0 rounded-lg border border-(--border-color) bg-black/20">
          <table className="w-full table-auto border-collapse text-sm md:text-base">
            <thead className="sticky top-0 bg-(--background-color-secondary) z-10 shadow-md">
              <tr>
                <th className="p-3 md:p-4 text-center w-16 md:w-24 text-(--text-color-muted) font-medium">
                  排名
                </th>
                <th className="p-3 md:p-4 text-left text-(--text-color-muted) font-medium">
                  玩家
                </th>
                <th className="p-3 md:p-4 text-right text-(--text-color-muted) font-medium">
                  分數
                </th>
                <th className="p-3 md:p-4 text-right text-(--text-color-muted) font-medium hidden sm:table-cell">
                  時間
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const rank = index + 1;
                let rankColor = "text-(--text-color)";
                if (rank === 1)
                  rankColor =
                    "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]";
                else if (rank === 2)
                  rankColor =
                    "text-gray-300 drop-shadow-[0_0_10px_rgba(209,213,219,0.5)]";
                else if (rank === 3)
                  rankColor =
                    "text-amber-600 drop-shadow-[0_0_10px_rgba(217,119,6,0.5)]";

                return (
                  <tr
                    key={item.user_id}
                    className="border-b border-(--border-color) last:border-0 hover:bg-white/5 transition-colors group"
                  >
                    <td
                      className={cn(
                        "p-3 md:p-4 text-center font-bold text-lg md:text-xl",
                        rankColor
                      )}
                    >
                      {rank}
                    </td>
                    <td className="p-3 md:p-4">
                      <Link
                        href={`/profile/${item.user_id}`}
                        className="group-hover:text-(--text-color-primary) transition-colors flex items-center gap-2"
                      >
                        <span className="truncate max-w-[120px] sm:max-w-[200px] font-medium">
                          {item.user_name}
                        </span>
                      </Link>
                    </td>
                    <td className="p-3 md:p-4 text-right font-mono text-(--text-color-secondary) font-bold text-lg">
                      {item.score.toLocaleString()}
                    </td>
                    <td className="p-3 md:p-4 text-right text-(--text-color-muted) text-xs md:text-sm hidden sm:table-cell">
                      {formatDate("YYYY/MM/DD", item.created_at)}
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-(--text-color-muted)"
                  >
                    暫無資料
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
