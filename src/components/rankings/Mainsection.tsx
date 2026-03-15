"use client";
import { VALID_KEYS } from "@/libs/backend";
import { GlowText } from "../GlowText";
import Link from "next/link";
import { DollarOutlined, FireOutlined } from "@ant-design/icons";
import { statsData } from "@/libs/rankings";

const RANKING_ICONS: Record<
  string,
  React.ComponentType<{
    className?: string;
  }>
> = {
  play_count: FireOutlined,
  user_coins: DollarOutlined,
};

export const MainSection = () => {
  return (
    <section className="h-full flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center gap-10 px-4">
        <GlowText
          as="h2"
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider text-center"
        >
          排行榜
        </GlowText>

        <div className="flex flex-col gap-4 w-full max-w-sm sm:max-w-md">
          {VALID_KEYS.map((key) => {
            const RankingIcon = RANKING_ICONS[key];
            return (
              <Link
                key={key}
                href={`/rankings/${key}`}
                className="btn primary flex items-center justify-center gap-3 px-8 py-4 rounded-full text-xl sm:text-2xl font-bold"
              >
                <RankingIcon className="text-2xl" />
                {statsData[key].label}
              </Link>
            );
          })}

          <div className="h-2" />

          <Link
            href="/"
            className="btn secondary px-8 py-4 rounded-full text-xl sm:text-2xl font-bold text-center"
          >
            返回首頁
          </Link>
        </div>
      </div>
    </section>
  );
};
