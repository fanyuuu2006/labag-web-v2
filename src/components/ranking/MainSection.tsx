"use client";
import { SupabaseRankingViewItem } from "@/types/backend";
import { GlowText } from "../GlowText";
import { useMemo } from "react";
import { useUser } from "@/contexts/UserContext";
import { RankTableRow } from "./RankTableRow";

interface MainSectionProps {
  items: SupabaseRankingViewItem[] | null;
}

export const MainSection = ({ items }: MainSectionProps) => {
  const { user } = useUser();

  const orderedItems = useMemo(() => {
    if (!items) return [];
    return [...items].sort((a, b) => b.score - a.score);
  }, [items]);

  const { userRank, userRankIndex } = useMemo(() => {
    if (!user || orderedItems.length === 0)
      return { userRank: undefined, userRankIndex: -1 };
    const index = orderedItems.findIndex((item) => item.user_id === user.id);
    return {
      userRankIndex: index,
      userRank: index !== -1 ? orderedItems[index] : undefined,
    };
  }, [orderedItems, user]);

  return (
    <section className="h-full">
      <div className="container h-full flex flex-col items-center justify-center p-4">
        <div className="card w-full max-w-3xl flex flex-col gap-4 p-4 md:p-6 max-h-full overflow-hidden shadow-2xl">
          <div className="flex justify-center items-center shrink-0">
            <GlowText
              as="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wider"
            >
              排行榜
            </GlowText>
          </div>

          <div className="w-full rounded-md bg-(--background-color) border-2 border-(--border-color) overflow-y-auto flex-1 min-h-0 relative scrollbar-thin shadow-inner">
            <table className="text-base sm:text-lg md:text-xl lg:text-2xl w-full table-auto border-collapse">
              <thead className="text-[0.75em] text-(--text-color-muted) sticky top-0 bg-black/80 z-20 backdrop-blur-md shadow-md">
                <tr>
                  <th
                    className="text-center p-2 font-medium"
                    scope="col"
                  >
                    #
                  </th>
                  <th
                    className="text-center p-2 font-medium"
                    scope="col"
                  >
                    玩家名稱
                  </th>
                  <th
                    className="text-center p-2 font-medium"
                    scope="col"
                  >
                    分數
                  </th>
                  <th
                    className="text-center p-2 font-medium"
                    scope="col"
                  >
                    日期
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderedItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-12 text-center text-(--text-color-muted) italic"
                    >
                      當前無排行資料
                    </td>
                  </tr>
                ) : (
                  orderedItems.map((item, index) => (
                    <RankTableRow
                      key={item.record_id}
                      item={item}
                      className="hover:backdrop-brightness-125 transition-colors duration-200"
                      index={index}
                    />
                  ))
                )}
              </tbody>
              {userRank && (
                <tfoot className="border-t-2 border-(--border-color) sticky bottom-0 z-20 backdrop-blur-md bg-black/80">
                  <RankTableRow item={userRank} index={userRankIndex} />
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
