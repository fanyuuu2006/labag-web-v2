"use client";
import { SupabaseRankingViewItem } from "@/types/backend";
import { GlowText } from "../GlowText";
import { useMemo } from "react";
// import { useUser } from "@/contexts/UserContext";
import { PodiumItem } from "./PodiumItem";
import { RestRankCard } from "./RestRankCard";
import { formatDate } from "@/utils/date";

interface MainSectionProps {
  items: SupabaseRankingViewItem[] | null;
}

export const MainSection = ({ items }: MainSectionProps) => {
  //   const { user } = useUser();

  const orderedItems = useMemo(() => {
    if (!items) return [];
    return [...items].sort((a, b) => b.score - a.score);
  }, [items]);

  //   const { userRank, userRankIndex } = useMemo(() => {
  //     if (!user || orderedItems.length === 0)
  //       return { userRank: undefined, userRankIndex: -1 };
  //     const index = orderedItems.findIndex((item) => item.user_id === user.id);
  //     return {
  //       userRankIndex: index,
  //       userRank: index !== -1 ? orderedItems[index] : undefined,
  //     };
  //   }, [orderedItems, user]);

  const currTime = useMemo(() => {
    const now = new Date();
    return formatDate("YYYY/MM/DD HH:mm:ss", now);
  }, []);

  const top3 = orderedItems.slice(0, 3);
  const rest = orderedItems.slice(3);

  return (
    <section className="h-full">
      <div className="container h-full grid grid-rows-[auto_1fr]">
        {/* 標題*/}
        <div className="flex justify-center">
          <GlowText
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-wider"
          >
            排行榜
          </GlowText>
        </div>

        {/** 內容區域 */}
        <div
          className={
            "text-base sm:text-lg md:text-xl lg:text-2xl grid grid-cols-1 lg:grid-cols-2 max-h-full"
          }
        >
          {/* 前三名 */}
          <div className="flex flex-col items-center justify-center p-4">
            {orderedItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-white/50 italic text-xl">
                暫無排行資料
              </div>
            ) : (
              <div className="w-full flex justify-center items-end gap-2 md:gap-4 lg:gap-6">
                {top3.map((item, index) => (
                  <PodiumItem key={index} index={index} item={item} />
                ))}
              </div>
            )}
          </div>
          {/* 剩餘排行榜列表 */}
          <div className="flex flex-col items-center justify-center h-full overflow-hidden">
            <div className="card-secondary w-full max-h-full overflow-y-auto p-4">
              {rest.length === 0 && orderedItems.length <= 3 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/30 italic gap-3">
                  <div className="text-4xl opacity-50">⏳</div>
                  <div>期待更多玩家加入...</div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-2">
                  {rest.map((item, i) => (
                    <RestRankCard
                      key={item.record_id}
                      rank={i + 4}
                      item={item}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/** 底部當前資料時間 */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
          <GlowText
            as="p"
            className="text-xs md:text-base text-(--text-color-muted)"
          >
            當前資料截至：{currTime}
          </GlowText>
        </div>
      </div>
    </section>
  );
};
