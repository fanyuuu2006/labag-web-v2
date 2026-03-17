"use client";

import React, { memo } from "react";
import { site } from "@/libs/site";
import { GlowText } from "@/components/GlowText";
import {
  ThunderboltOutlined,
  GlobalOutlined,
  CloudServerOutlined,
  RocketOutlined,
  CodeOutlined,
  HistoryOutlined,
  UserOutlined,
  GithubOutlined,
  LinkOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  QuestionCircleOutlined,
  StarOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { OutsideLink } from "fanyucomponents";
import { ContentDiv, ContentDivProps } from "./ContentDiv";
import { LeftContentProps, LeftContent } from "./LeftContent";

const TIMELINE_EVENTS = [
  {
    year: "2023",
    date: "6 月 22 日",
    title: "初代啦八機誕生",
    description: (
      <>
        治平高中商務二孝的那個本壘板飯魚正處於很無聊的狀態，於是想到國昌老師教的
        <OutsideLink
          href="https://appinventor.mit.edu/"
          className="text-(--primary) underline underline-offset-4"
        >
          MIT App Inventor 2
        </OutsideLink>{" "}
        的存在，運用以前玩 Minecraft 做紅石機關的邏輯，做出了第一代啦八機。,
      </>
    ),
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
      "飯魚高中畢業即將進入大學，買了人生第一台電腦，開始學習 Python，並嘗試用 Python 還原啦八機，踏入程式學習之路。",
  },
  {
    year: "2025",
    date: "2 月",
    title: "Next.js 重構",
    description:
      "開始接觸前端技術，決定使用 Next.js 重構啦八機，藉由網頁應用呈現更豐富的互動體驗，同時學習現代前端開發最佳實踐。",
  },
  {
    year: "2026",
    date: "3 月 16 日",
    title: "3.0 版本更新",
    description:
      "整個遊戲進行大幅優化與重構，修改了大部分遊戲規則與機制，並新增了金幣系統，讓啦八機成為一個更完整、更有意義的遊戲。",
  },
  {
    year: "2026",
    date: "至今",
    title: "持續優化與更新",
    description:
      "不斷優化遊戲性能與使用者體驗，並根據玩家反饋持續更新內容，讓啦八機成為一個充滿樂趣與挑戰的遊戲。",
  },
] as const;

const FEATURES = [
  {
    title: "極速體驗",
    description: "基於 Next.js 架構，享受極致流暢、無延遲的遊玩體驗。",
    icon: ThunderboltOutlined,
  },
  {
    title: "PWA 支援",
    description: "支援安裝至桌面，免下載即可享受如原生 App 般的順暢體驗。",
    icon: CloudServerOutlined,
  },
  {
    title: "全球排行",
    description: "不斷突破自我紀錄，與全球玩家一較高下，在排行榜留下名字。",
    icon: GlobalOutlined,
  },
  {
    title: "隱私保障",
    description: "僅收集分數、遊玩時間與暱稱作排行顯示，絕不蒐集個人隱私。",
    icon: SafetyCertificateOutlined,
  },
] as const;

const TECH_STACK = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "Express",
  "Vercel",
] as const;

const AUTHOR_INFO = {
  name: "飯魚 FanYu (范余振富)",
  description:
    "就讀於國立臺灣科技大學資訊管理系，一位熱愛程式開發的學生開發者。從 Minecraft 紅石機關啟蒙邏輯思維，高中接觸 App Inventor 後踏入程式領域。目前專注於學習前端與後端技術，熟練使用 Next.js、React、TypeScript 等現代網頁技術。",
  links: [
    {
      name: "GitHub",
      href: "https://github.com/fanyuuu2006",
      icon: GithubOutlined,
    },
    {
      name: "Website",
      href: "https://fanyu.vercel.app/",
      icon: LinkOutlined,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/fan._.yuuu",
      icon: InstagramOutlined,
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@fan_yuuu",
      icon: YoutubeOutlined,
    },
  ],
} as const;

const BACKGROUND_STORY =
  "這是一個始於無聊、終於熱愛的故事。從高中時期的隨手塗鴉，到大學時期的認真重構，啦八機見證了作者飯魚從零開始學習程式的過程。";

const FAQ_ITEMS = [
  {
    q: "為什麼叫「啦八機」？",
    a: "名稱取自「拉霸機」的諧音，同時也隱藏了一個小玩笑：倒過來念就是「雞巴啦」XD，這正是命名的趣味由來。",
  },
  {
    q: "遊戲支援哪些平台？",
    a: "本遊戲採響應式設計 (RWD)，電腦、平板與手機皆可遊玩。推薦手機用戶使用 Chrome 或 Safari，並將網頁「加入主畫面」，即可享有如同 App 般的沈浸式體驗。",
  },
  {
    q: "發現 Bug 或有建議？",
    a: "歡迎透過 Instagram 私訊作者，或至 GitHub 提交 Issue。您的回饋與建議，是遊戲持續進步的最大動力！",
  },
  {
    q: "遊戲的圖案和模式是怎麼設計的？",
    a: "素材大多隨性取材自作者的手機相簿，包含許多生活照；其中最具特色的「阿禾」，則是致敬作者的高中班導師。",
  },
  {
    q: "如何安裝到手機桌面？",
    a: "iOS 用戶請使用 Safari 點擊「分享」按鈕並選擇「加入主畫面」；Android 用戶可透過瀏覽器選單點擊「安裝應用程式」或「加到主畫面」。",
    icon: MobileOutlined,
  },
  {
    q: "遊戲的計分規則是什麼？",
    a: "每個圖案都有不同的分數與出現機率，詳情請點擊「圖案一覽」中的各圖案卡片查看。",
  },
] as const;

const CONTENTS: ContentDivProps[] = [
  {
    icon: StarOutlined,
    title: "網站特色",
    children: (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feat) => (
          <div
            key={feat.title}
            className="card secondary p-8 flex flex-col gap-6 text-center items-center"
          >
            <div className="text-5xl text-(--primary)">
              <feat.icon />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold">{feat.title}</h3>
              <p className="text-(--muted) leading-relaxed">
                {feat.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  // {
  //   title: "圖案一覽",
  //   description: "點擊圖案可查看詳細計分資訊與出現機率",
  //   children: (
  //     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
  //       {DISPLAY_PATTERNS.map((pattern) => {
  //         const isTheme = pattern.name in modeDescriptions;
  //         const [Tag, props]: ComponentCombination = isTheme
  //           ? [
  //               ModeModalButton,
  //               {
  //                 modeName: pattern.name,
  //               },
  //             ]
  //           : [
  //               PatternModalButton,
  //               {
  //                 pattern,
  //               },
  //             ];
  //         return (
  //           <Tag
  //             key={pattern.name}
  //             className={
  //               "btn secondary flex flex-col items-center h-full w-full p-3 rounded-xl"
  //             }
  //             {...props}
  //             data-theme={isTheme ? pattern.name : "normal"}
  //           >
  //             <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
  //               <MyImage
  //                 src={`/images/patterns/${pattern.name}.jpg`}
  //                 alt={pattern.name}
  //                 className="w-full h-full object-cover"
  //               />
  //             </div>

  //             <span className="font-bold text-lg capitalize">
  //               {pattern.name}
  //             </span>
  //           </Tag>
  //         );
  //       })}
  //     </div>
  //   ),
  // },
  {
    title: "常見問題",
    description: "這裡整理了一些關於啦八機的常見疑問",
    icon: QuestionCircleOutlined,
    children: (
      <div className="grid md:grid-cols-2 gap-6">
        {FAQ_ITEMS.map((item) => (
          <div key={item.q} className="card primary p-6 space-y-3">
            <h3 className="text-lg font-bold flex items-start gap-2">
              <span className="text-(--primary) font-mono text-xl">Q.</span>
              {item.q}
            </h3>
            <p className="font-light leading-relaxed pl-7 border-l-2 border-(--border)">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    ),
  },
];

const LEFT_CONTENTS: LeftContentProps[] = [
  {
    title: "關於作者",
    icon: UserOutlined,
    children: (
      <div className="space-y-3">
        <h4 className="text-2xl lg:text-3xl font-bold">{AUTHOR_INFO.name}</h4>
        <p className="text-(--muted) leading-relaxed">
          {AUTHOR_INFO.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {AUTHOR_INFO.links.map((link) => (
            <OutsideLink
              key={link.name}
              href={link.href}
              className="card primary rounded-full px-3 py-1 flex items-center gap-1 text-sm"
            >
              <link.icon />
              <span>{link.name}</span>
            </OutsideLink>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "創作背景",
    icon: RocketOutlined,
    children: (
      <p className="text-(--muted) leading-relaxed">{BACKGROUND_STORY}</p>
    ),
  },
  {
    title: "技術與工具",
    icon: CodeOutlined,
    children: (
      <div className="flex flex-wrap gap-2">
        {TECH_STACK.map((tech) => (
          <span
            key={tech}
            className="card primary px-3 py-1 rounded-full text-sm font-medium"
          >
            {tech}
          </span>
        ))}
      </div>
    ),
  },
];

export const MainSection = memo(() => {
  return (
    <section className="min-h-full py-12 px-4">
      <div className="container mx-auto space-y-24 lg:space-y-32">
        {/* 頁首 Header */}
        <header className="text-center space-y-6">
          <GlowText
            as="h1"
            className="text-4xl lg:text-6xl font-bold tracking-tight"
          >
            關於 {site.title}
          </GlowText>
          <p className="text-lg lg:text-xl text-(--muted) max-w-2xl mx-auto leading-relaxed">
            {site.description}
          </p>
        </header>

        {/* 內容區域 */}
        <div className="grid lg:grid-cols-2 gap-12 items-start relative">
          {/* 左側 */}
          <div className="flex flex-col gap-4 divide-y divide-(--border) lg:sticky lg:top-24">
            {LEFT_CONTENTS.map((content, idx) => (
              <LeftContent key={idx} {...content} />
            ))}
          </div>

          <div className="relative">
            {/* 時間軸線 */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-(--border) lg:left-8 lg:top-4 lg:bottom-4"></div>

            <div className="space-y-12">
              {TIMELINE_EVENTS.map((event) => (
                <div
                  key={event.title}
                  className="relative pl-12 lg:pl-20 group"
                >
                  {/* 時間軸圓點 */}
                  <div className="absolute left-2.75 top-2 w-3 h-3 rounded-full bg-(--primary) lg:left-6.75"></div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm font-mono text-(--muted)">
                      <HistoryOutlined />
                      <span>
                        {event.year} - {event.date}
                      </span>
                    </div>
                    <article className="card secondary p-4 space-y-2">
                      <h3 className="text-xl font-bold">{event.title}</h3>
                      <p className="text-(--muted) leading-relaxed">
                        {event.description}
                      </p>
                    </article>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {CONTENTS.map((content, idx) => (
          <ContentDiv key={idx} {...content} />
        ))}
      </div>
    </section>
  );
});

MainSection.displayName = "MainSection";
