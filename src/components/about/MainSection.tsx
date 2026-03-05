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

const FEATURES = [
  {
    title: "極速體驗",
    description: "採用 Next.js App Router 架構，流暢無比。",
    icon: ThunderboltOutlined,
  },
  {
    title: "PWA 支援",
    description: "支援漸進式網頁應用，離線也能隨時開啟。",
    icon: CloudServerOutlined,
  },
  {
    title: "全球排行",
    description: "挑戰最高分數，在排行榜上留下你的名字。",
    icon: GlobalOutlined,
  },
];

export const MainSection = () => {
  return (
    <section className="min-h-full py-12 md:py-20 px-4">
      <div className="container mx-auto space-y-16 md:space-y-24">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <GlowText
            as="h1"
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            關於 {site.title}
          </GlowText>
          <p className="text-lg md:text-xl text-(--muted) max-w-2xl mx-auto">
            {site.description}
          </p>
        </div>

        {/* Background Story */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <RocketOutlined className="text-(--primary)" />
              <span>創作背景</span>
            </h2>
            <div className="space-y-4 text-(--muted) text-lg leading-relaxed">
              {BACKGROUND_STORY.split("\n\n").map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="h-full min-h-75 card primary flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/patterns/pop/bg.svg')] opacity-10 bg-repeat"></div>
            <GlowText className="text-9xl font-black opacity-20 -rotate-12 select-none">
              ?
            </GlowText>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="card secondary p-6 flex flex-col gap-4 text-center items-center"
            >
              <div className="text-4xl text-(--primary)">
                <feat.icon />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{feat.title}</h3>
                <p className="text-(--muted)">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack & Developer */}
        <div className="card secondary p-8 md:p-12 text-center space-y-8">
          <div className="space-y-6">
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
                  className="card primary px-4 py-2 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-(--border) w-1/2 mx-auto" />

          <div className="space-y-6">
            <p className="text-(--muted)">
              由 <span className="text-(--foreground) font-bold">Fanyu</span>{" "}
              獨立開發與維護
            </p>
            <div className="flex justify-center gap-4">
              <OutsideLink
                href="https://github.com/fanyuuu2006/labag-web-v2"
                className="btn secondary flex items-center gap-2 px-6 py-3 rounded-full font-bold"
                title="GitHub Repo"
              >
                <GithubOutlined className="text-xl" />
                <span>GitHub</span>
              </OutsideLink>
              <Link
                href="/game"
                className="btn primary flex items-center gap-2 px-6 py-3 rounded-full font-bold"
              >
                <PlayCircleOutlined className="text-xl" />
                <span>開始遊戲</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
