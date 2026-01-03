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
  items: SupabaseRankingViewItem[];
}) => {
  const { user } = useUser();
  const orderedItems = useMemo(() => {
    return [...items].sort((a, b) => b.score - a.score);
  }, [items]);
  const userRank = useMemo(() => {
    return orderedItems.find((item) => user && item.user_id === user?.id);
  }, [orderedItems, user]);

  return (
    <section className="h-full flex flex-col items-center justify-center p-4 md:p-6">
      <div className="card w-full max-w-3xl flex flex-col gap-4 p-4 md:p-6 max-h-full overflow-hidden">
        <div className="flex justify-center items-center py-2 shrink-0">
          <GlowText
            as="h2"
            className="text-3xl sm:text-4xl font-extrabold tracking-wider"
          >
            排行榜
          </GlowText>
        </div>

        <div className="w-full rounded-md bg-(--background-color) border-2 border-(--border-color) overflow-y-auto flex-1 min-h-0 relative scrollbar-thin">
          <table className="text-base md:text-lg lg:text-xl w-full table-auto border-collapse">
            <thead className="text-[0.75em] text-(--text-color-muted) sticky top-0 bg-black/50 z-10 backdrop-blur-md">
              <tr>
                <th className="text-center p-2">#</th>
                <th className="text-center p-2">玩家</th>
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
                    className={cn("hover:backdrop-brightness-105", {
                      "border border-(--text-color-primary)/30":
                        user && item.user_id === user?.id,
                    })}
                    index={index}
                  />
                ))
              )}
            </tbody>
            {userRank && (
              <tfoot className="text-base md:text-lg lg:text-xl sticky bottom-0 z-10 backdrop-blur-md">
                <RankTableRow
                  className=" bg-black/50"
                  item={userRank}
                  index={orderedItems.indexOf(userRank)}
                />
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </section>
  );
};
