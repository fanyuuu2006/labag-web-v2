"use client";

import { site } from "@/libs/site";
import { GlowText } from "@/components/GlowText";
import { modeDescriptions } from "@/components/gameModeDescriptions";
import { useModeModal } from "@/contexts/ModeModalContext";
import { ModeName, patterns, Pattern } from "labag";
import { usePatternModal } from "@/contexts/PatternModalContext";
import { MyImage } from "@/components/MyImage";
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
  AppstoreOutlined,
} from "@ant-design/icons";
import { OutsideLink } from "fanyucomponents";

const TIMELINE_EVENTS = [
  {
    year: "2023",
    date: "6 月 22 日",
    title: "第一代啦八機誕生",
    description:
      "治平高中商務二孝的那個本壘板飯魚正處於很無聊的狀態，於是想到國昌老師教的 MIT App Inventor 2 的存在，運用以前玩 Minecraft 做紅石機關的邏輯，做出了第一代啦八機。",
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
      "飯魚高中畢業即將進入大學，買了人生第一台電腦，開始學習 Python，並嘗試用 Python 還原啦八機，踏上程式學習之路。",
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
  "Supabase",
  "Express",
  "Vercel",
];

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
};

const BACKGROUND_STORY =
  "這是一個始於無聊、終於熱愛的故事。從高中時期的隨手塗鴉，到大學時期的認真重構，啦八機見證了作者飯魚從零開始學習程式的過程。";

const ModeCard = ({
  modeKey,
  modeData,
}: {
  modeKey: ModeName;
  modeData: { name: string };
}) => {
  const modal = useModeModal();
  return (
    <button
      onClick={() => modal.open(modeKey)}
      className="btn secondary w-full py-8 text-xl sm:text-2xl font-bold rounded-2xl"
      data-theme={modeKey}
    >
      {modeData.name}
    </button>
  );
};

const PatternCard = ({ pattern }: { pattern: Pattern }) => {
  const modal = usePatternModal();
  return (
    <button
      onClick={() => modal.open(pattern)}
      className="btn secondary p-3 sm:p-4 h-full flex flex-col items-center gap-3 rounded-xl"
    >
      <div className="w-full aspect-square rounded-lg overflow-hidden relative">
        <MyImage
          src={`/images/patterns/${pattern.name}.jpg`}
          alt={pattern.name}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="font-bold text-sm sm:text-base">{pattern.name}</span>
    </button>
  );
};

export const MainSection = () => {
  return (
    <section className="min-h-full py-12 px-4">
      <div className="container mx-auto space-y-24 lg:space-y-32">
        {/* 頁首 */}
        <div className="text-center space-y-6">
          <GlowText
            as="h1"
            className="text-4xl lg:text-6xl font-bold tracking-tight"
          >
            關於 {site.title}
          </GlowText>
          <p className="text-lg lg:text-xl text-(--muted) max-w-2xl mx-auto leading-relaxed">
            {site.description}
          </p>
        </div>

        {/* 發展歷程 */}
        <div className="grid lg:grid-cols-2 gap-12 items-start relative">
          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <UserOutlined className="text-(--primary)" />
                <span>關於作者</span>
              </h2>
              <div className="space-y-3">
                <h4 className="text-2xl lg:text-3xl font-bold">
                  {AUTHOR_INFO.name}
                </h4>
                <p className="text-(--muted) leading-relaxed">
                  {AUTHOR_INFO.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  {AUTHOR_INFO.links.map((link) => (
                    <OutsideLink
                      key={link.name}
                      href={link.href}
                      className="card primary rounded-full px-3 py-1 flex items-center gap-2"
                    >
                      <link.icon className="text-xl" />
                      <span>{link.name}</span>
                    </OutsideLink>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-(--border)">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <RocketOutlined className="text-(--primary)" />
                <span>創作背景</span>
              </h3>
              <p className="text-(--muted) text-lg leading-relaxed">
                {BACKGROUND_STORY}
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

          <div className="relative">
            {/* 時間軸線 */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-(--border) lg:left-8 lg:top-4 lg:bottom-4"></div>

            <div className="space-y-12">
              {TIMELINE_EVENTS.map((event, idx) => (
                <div key={idx} className="relative pl-12 lg:pl-20 group">
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
                      <h3 className="text-xl font-bold">
                        {event.title}
                      </h3>
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

        {/* 特色區塊 */}
        <div className="grid lg:grid-cols-3 gap-6">
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
                <p className="text-(--muted) leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 遊戲模式介紹 */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
              <AppstoreOutlined className="text-(--primary)" />
              <span>模式介紹</span>
            </h2>
            <p className="text-(--muted) leading-relaxed max-w-2xl mx-auto">
              {site.title} 擁有多種獨特的遊玩模式，每個模式都有其特殊的觸發條件與計分規則。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {(
              Object.entries(modeDescriptions) as [
                ModeName,
                (typeof modeDescriptions)[ModeName],
              ][]
            ).map(([key, mode]) => (
              <ModeCard key={key} modeKey={key} modeData={mode} />
            ))}
          </div>
        </div>

        {/* 遊戲圖案一覽 */}
        <div className="space-y-8 pb-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
              <AppstoreOutlined className="text-(--primary)" />
              <span>圖案一覽</span>
            </h2>
            <p className="text-(--muted) leading-relaxed max-w-2xl mx-auto">
              點擊圖案可查看詳細計分資訊與出現機率。
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {patterns.map((pattern) => (
              <PatternCard key={pattern.name} pattern={pattern} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
