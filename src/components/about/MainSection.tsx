"use client";

import { site } from "@/libs/site";
import { GlowText } from "@/components/GlowText";
import {
  GithubOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  CloudServerOutlined,
  RocketOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { OutsideLink } from "fanyucomponents";
import Link from "next/link";

export const MainSection = () => {
  return (
    <section className="min-h-full py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl space-y-20">
        {/* Header Section */}
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <GlowText
            as="h1"
            className="text-5xl md:text-7xl font-bold tracking-tight inline-block"
          >
            關於 {site.title}
          </GlowText>
          <p className="text-xl md:text-2xl text-(--muted) max-w-2xl mx-auto font-light">
            {site.description}
          </p>
        </div>

        {/* Origin Story */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <RocketOutlined className="text-(--primary)" />
              <span>起源故事</span>
            </h2>
            <div className="space-y-4 text-(--muted) leading-relaxed text-lg">
              <p>
                這一切始於一個簡單的想法：
                <span className="text-(--foreground) font-medium">
                  「如何在最無聊的時候，找到最純粹的快樂？」
                </span>
              </p>
              <p>
                {site.title}{" "}
                最初只是一個小小的實驗專案，隨著時間推移，我們加入了更多有趣的模式、排行榜系統以及現代化的介面設計，讓這款遊戲成為了打發時間的最佳夥伴。
              </p>
            </div>
          </div>
          <div className="card primary h-64 md:h-80 flex items-center justify-center p-8 overflow-hidden order-1 md:order-2 group relative">
            <div className="absolute inset-0 bg-[url('/images/patterns/pop/bg.svg')] opacity-10 bg-repeat animate-pulse"></div>
            <GlowText className="text-8xl md:text-9xl font-black opacity-20 rotate-12 group-hover:scale-110 transition-transform duration-700 select-none">
              ?
            </GlowText>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "極速體驗",
              description:
                "採用 Next.js App Router 架構，頁面切換流暢無比，即開即玩，無需等待。",
              icon: ThunderboltOutlined,
            },
            {
              title: "PWA 支援",
              description:
                "支援漸進式網頁應用 (PWA)，可安裝至桌面或手機，離線也能隨時開啟。",
              icon: CloudServerOutlined,
            },
            {
              title: "全球排行",
              description:
                "與全世界的玩家一較高下，挑戰最高分數，在排行榜上留下你的名字。",
              icon: GlobalOutlined,
            },
          ].map((feat) => (
            <div
              key={feat.title}
              className="card secondary p-6 flex flex-col items-start gap-4"
            >
              <div className="card primary p-3 rounded-full flex items-center justify-center text-(--primary)">
                <feat.icon className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 ml-1">{feat.title}</h3>
                <p className="text-(--muted) leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack & Developer */}
        <div className="card secondary p-8 md:p-12 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">技術棧</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Next.js 15",
                "React 19",
                "TypeScript",
                "Tailwind CSS 4",
                "PWA",
              ].map((tech) => (
                <span
                  key={tech}
                  className="card primary rounded-full px-3 py-1 flex items-center justify-center"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-(--border)">
            <p className="text-(--muted) mb-6">
              由 <span className="text-(--foreground) font-bold">Fanyu</span>{" "}
              獨立開發與維護，感謝所有遊玩本遊戲的玩家。
            </p>
            <div className="flex justify-center gap-4">
              <OutsideLink
                href="https://github.com/fanyuuu2006/labag-web-v2"
                className="btn secondary flex items-center gap-2 px-6 py-3 rounded-full font-medium"
                title="GitHub Repo"
              >
                <GithubOutlined className="text-xl" />
                <span>GitHub</span>
              </OutsideLink>
              <Link
                href="/game"
                className="btn primary flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg"
              >
                <PlayCircleOutlined className="text-xl" />
                <span>馬上開始</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
