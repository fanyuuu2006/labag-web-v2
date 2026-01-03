"use client";
import { SupabaseRankingViewItem } from "@/types/backend";
import { GlowText } from "../GlowText";
import { useMemo } from "react";
import { useUser } from "@/contexts/UserContext";
import { RankTableRow } from "./RankTableRow";
import { cn } from "@/utils/className";

export const MainSection = ({
  items,
}: {
  items: SupabaseRankingViewItem[] | null;
}) => {
  const { user } = useUser();

  const orderedItems = useMemo(() => {
    if (!items) return [];
    return [...items].sort((a, b) => b.score - a.score);
  }, [items]);

  const userRankIndex = useMemo(() => {
    if (!user) return -1;
    return orderedItems.findIndex((item) => item.user_id === user.id);
  }, [orderedItems, user]);

  const userRank =
    userRankIndex !== -1 ? orderedItems[userRankIndex] : undefined;

  return (
    <section className="h-full">
      <div className="container h-full flex flex-col items-center justify-center p-4">
        <div className="card w-full max-w-3xl flex flex-col gap-4 p-4 md:p-6 max-h-full overflow-hidden">
          <div className="flex justify-center items-center py-2 shrink-0">
            <GlowText
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wider"
            >
              排行榜
            </GlowText>
          </div>

          <div className="w-full rounded-md bg-(--background-color) border-2 border-(--border-color) overflow-y-auto flex-1 min-h-0 relative scrollbar-thin">
            <table className="text-base sm:text-lg md:text-xl lg:text-2xl w-full table-auto border-collapse">
              <thead className="text-[0.75em] text-(--text-color-muted) sticky top-0 bg-black/50 z-10 backdrop-blur-md">
                <tr>
                  <th className="text-center p-2">#</th>
                  <th className="text-center p-2">玩家名稱</th>
                  <th className="text-center p-2">分數</th>
                  <th className="text-center p-2">日期</th>
                </tr>
              </thead>
              <tbody>
                {orderedItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 text-center text-(--text-color-muted)"
                    >
                      當前無排行資料
                    </td>
                  </tr>
                ) : (
                  orderedItems.map((item, index) => (
                    <RankTableRow
                      key={item.record_id}
                      item={item}
                      className={cn("hover:backdrop-brightness-125", {})}
                      index={index}
                    />
                  ))
                )}
              </tbody>
              {userRank && (
                <tfoot className="border-t border-(--border-color) sticky bottom-0 z-10 backdrop-blur-md">
                  <RankTableRow
                    className="bg-black/50"
                    item={userRank}
                    index={userRankIndex}
                  />
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
