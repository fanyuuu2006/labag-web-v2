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

const BACKGROUND_STORY = `2023 年 6 月 22 日，治平高中商務二孝的那個本壘板 🍚🐟 正處於很無聊的狀態，於是想到國昌老師教的 MIT App Inventor 2 的存在，想無聊做個小遊戲，運用以前玩 Minecraft 做紅石機關的邏輯、從手機相簿裡面隨便找的幾張圖片，以及網路上隨便抓的垃 X 音效與音樂，於是第一代啦八機誕生了。

後續陸續新增了 超級阿禾模式 (SuperHHH)、綠光阿瑋模式 (GreenWei)、皮卡丘充電模式 (PiKaChu) 等模式。

2024 年 8 月，🍚🐟 已經高中畢業，即將進入大學，去買了人生第一台電腦，為了學習 Python，於是一邊透過用 Python 還原啦八機，一邊學習相關知識。

2025 年 2 月，🍚🐟 開始接觸前端技術，決定使用 Next.js 重構啦八機，藉由網頁應用呈現更豐富的互動體驗，同時學習現代前端開發的最佳實踐。`;

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

        {/* Background Story */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <RocketOutlined className="text-(--primary)" />
              <span>創作背景</span>
            </h2>
            <article className="flex flex-col items-start gap-2 text-lg">
              {BACKGROUND_STORY.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </article>
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
