"use client";
import { GlowText } from "../../GlowText";
import { useMemo } from "react";
import { PodiumItem } from "./PodiumItem";
import { RestRankCard } from "./RestRankCard";
import { SupabaseStatsView } from "@/types/backend";
import { statsData } from "@/libs/rankings";
import { VALID_KEYS } from "@/libs/backend";

interface MainSectionProps {
  rankKey: (typeof VALID_KEYS)[number];
  items: SupabaseStatsView[] | null;
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
    <section className="h-full flex flex-col items-center py-8">
      <div className="container flex flex-col gap-8 lg:gap-12 px-4">
        {/* 標題*/}
        <div className="flex flex-col items-center justify-center">
          <span className="text-(--muted) text-sm md:text-base tracking-[0.2em] mb-2 uppercase">
            — 排行榜 —
          </span>
          <GlowText
            as="h1"
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-center"
          >
            {statsData[rankKey]?.label ?? "排行榜"}
          </GlowText>
        </div>

        {/** 內容區域 */}
        <div className="w-full text-base sm:text-lg md:text-xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-24">
           {/* 前三名 */}
          <div className="lg:sticky lg:top-24 self-start w-full flex flex-col items-center justify-center z-10">
            {top3.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-(--muted) italic text-xl min-h-[50vh]">
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
          <div className="flex flex-col">
            <div className="card secondary w-full p-4 lg:p-6 mb-8">
              {rest.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-(--muted) italic gap-3">
                  <div className="text-4xl opacity-50">⏳</div>
                  <div>期待更多玩家加入...</div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {rest.map((item, i) => (
                    <RestRankCard
                      key={`${i}-${item.user_id}`}
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
        <div className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <GlowText as="p" className="text-xs md:text-base text-(--muted)">
            當前資料截至：{fetchTime}
          </GlowText>
        </div>
      </div>
    </section>
  );
};
