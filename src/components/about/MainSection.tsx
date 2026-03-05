"use client";

import { site } from "@/libs/site";
import { GlowText } from "@/components/GlowText";
import {
  ThunderboltOutlined,
  GlobalOutlined,
  CloudServerOutlined,
  RocketOutlined,
  CodeOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

const TIMELINE_EVENTS = [
  {
    year: "2023",
    date: "6 月 22 日",
    title: "第一代啦八機誕生",
    description:
      "治平高中商務二孝的那個本壘板 🍚🐟 正處於很無聊的狀態，於是想到國昌老師教的 MIT App Inventor 2 的存在，運用以前玩 Minecraft 做紅石機關的邏輯，做出了第一代啦八機。",
  },
  {
    year: "2023-2024",
    date: "持續更新",
    title: "新增多種模式",
    description:
      "陸續新增了 超級阿禾模式 (SuperHHH)、綠光阿瑋模式 (GreenWei)、皮卡丘充電模式 (PiKaChu) 等模式，豐富遊戲玩法。",
  },
  {
    year: "2024",
    date: "8 月",
    title: "接觸程式設計",
    description:
      "🍚🐟 高中畢業即將進入大學，買了人生第一台電腦，開始學習 Python，並嘗試用 Python 還原啦八機，踏上程式學習之路。",
  },
  {
    year: "2025",
    date: "2 月",
    title: "Next.js 重構",
    description:
      "開始接觸前端技術，決定使用 Next.js 重構啦八機，藉由網頁應用呈現更豐富的互動體驗，同時學習現代前端開發最佳實踐。",
  },
];

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

const TECH_STACK = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Ant Design",
  "Vercel",
];

export const MainSection = () => {
  return (
    <section className="min-h-full py-12 md:py-20 px-4">
      <div className="container mx-auto space-y-24 md:space-y-32">
        {/* 頁首 */}
        <div className="text-center space-y-6">
          <GlowText
            as="h1"
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            關於 {site.title}
          </GlowText>
          <p className="text-lg md:text-xl text-(--muted) max-w-2xl mx-auto leading-relaxed">
            {site.description}
          </p>
        </div>

        {/* 發展歷程 (Timeline) */}
        <div className="grid lg:grid-cols-12 gap-12 items-start relative">
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <RocketOutlined className="text-(--primary)" />
                <span>創作背景</span>
              </h2>
              <p className="text-(--muted) text-lg leading-relaxed">
                這是一個始於無聊、終於熱愛的故事。從高中時期的隨手塗鴉，到大學時期的認真重構，啦八機見證了作者 🍚🐟 從零開始學習程式的過程。
              </p>
            </div>
            
            {/* 技術棧展示 */}
            <div className="space-y-4 pt-4 border-t border-(--border)">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CodeOutlined className="text-(--secondary)" /> 
                <span>技術與工具</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((tech) => (
                  <span 
                    key={tech} 
                    className="card primary px-3 py-1 rounded-full text-sm font-medium "
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative pl-8 lg:pl-0 border-l border-(--border)/30 lg:border-none">
             {/* Timeline Line (Desktop Only) */}
            <div className="hidden lg:block absolute left-4 top-4 bottom-4 w-0.5 bg-[linear-gradient(to_bottom,var(--primary),var(--secondary),transparent)] opacity-50 md:left-8"></div>
            
            {/* Mobile Timeline Line */}
            <div className="block lg:hidden absolute left-0 top-0 bottom-0 w-0.5 bg-[linear-gradient(to_bottom,var(--primary),var(--secondary),transparent)] opacity-50"></div>

            <div className="space-y-12">
              {TIMELINE_EVENTS.map((event, idx) => (
                <div key={idx} className="relative lg:pl-20 group">
                  {/* Timeline Dot */}
                  <div className="hidden lg:block absolute left-2.75 top-1.5 w-3 h-3 rounded-full bg-(--primary) shadow-[0_0_10px_var(--primary)] md:left-6.75 ring-4 ring-(--background)"></div>
                  
                  {/* Mobile Dot */}
                  <div className="block lg:hidden absolute -left-1.25 top-1.5 w-2.5 h-2.5 rounded-full bg-(--primary) shadow-[0_0_10px_var(--primary)] ring-2 ring-(--background)"></div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm font-mono text-(--primary) opacity-80">
                      <HistoryOutlined />
                      <span>{event.year}</span>
                      <span className="w-1 h-1 bg-current rounded-full"></span>
                      <span>{event.date}</span>
                    </div>
                    <div className="card secondary p-6 space-y-2 relative overflow-hidden group-hover:border-(--primary)/card transition-[border-color] duration-(--transition-normal)">
                      <h3 className="text-xl font-bold text-(--foreground)">
                        {event.title}
                      </h3>
                      <p className="text-(--muted) leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 特色區塊 */}
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="card secondary p-8 flex flex-col gap-6 text-center items-center"
            >
              <div className="text-5xl text-(--primary) opacity-80">
                <feat.icon />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold">{feat.title}</h3>
                <p className="text-(--muted) leading-relaxed">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
