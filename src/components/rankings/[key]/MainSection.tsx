"use client";
import { GlowText } from "../../GlowText";
import { useMemo } from "react";
import { PodiumItem } from "./PodiumItem";
import { RestRankCard } from "./RestRankCard";
import { SupabaseUserStatsViewItem } from "@/types/backend";
import { statsLabels } from "@/libs/backend";

interface MainSectionProps {
  rankKey: keyof SupabaseUserStatsViewItem;
  items: SupabaseUserStatsViewItem[] | null;
  fetchTime: string;
}

export const MainSection = ({
  items,
  fetchTime,
  rankKey,
}: MainSectionProps) => {
  const top3 = useMemo(() => items?.slice(0, 3) || [], [items]);
  const rest = useMemo(() => items?.slice(3) || [], [items]);

  return (
    <section className="h-full">
      <div className="container h-full grid grid-rows-[auto_1fr]">
        {/* 標題*/}
        <div className="flex justify-center">
          <GlowText
            as="h1"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider text-center"
          >
            排行榜 - {statsLabels[rankKey as keyof typeof statsLabels]}
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
            {top3.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-white/50 italic text-xl">
                暫無排行資料
              </div>
            ) : (
              <div className="w-full flex justify-center items-end gap-2 md:gap-4 lg:gap-6">
                {top3.map((item, index) => (
                  <PodiumItem
                    key={index}
                    index={index}
                    item={item}
                    rankKey={rankKey}
                  />
                ))}
              </div>
            )}
          </div>
          {/* 剩餘排行榜列表 */}
          <div className="flex flex-col h-full overflow-hidden p-4">
            <div className="card-secondary w-full h-full overflow-y-auto p-4">
              {rest.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/30 italic gap-3">
                  <div className="text-4xl opacity-50">⏳</div>
                  <div>期待更多玩家加入...</div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-2">
                  {rest.map((item, i) => (
                    <RestRankCard
                      key={item.user_id}
                      rank={i + 4}
                      item={item}
                      rankKey={rankKey}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/** 底部當前資料時間 */}
        <div className="fixed z-9999 bottom-4 left-1/2 -translate-x-1/2">
          <GlowText as="p" className="text-xs md:text-base opacity-70">
            當前資料截至：{fetchTime}
          </GlowText>
        </div>
      </div>
    </section>
  );
};
