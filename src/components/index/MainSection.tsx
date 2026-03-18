"use client";
import { site } from "@/libs/site";
import Link from "next/link";
import { GlowText } from "../GlowText";
import { ShareAltOutlined } from "@ant-design/icons";
import { ShareButton } from "../ShareButton";
import { useUser } from "@/contexts/UserContext";

export const MainSection = () => {
  const { user } = useUser();
  return (
    <section className="h-full">
      <div className="container h-full px-4 flex flex-col items-center justify-center text-center gap-4">
        <GlowText
          as="h2"
          className="text-5xl sm:text-6xl md:text-8xl font-bold leading-tight tracking-tight"
        >
          {site.title}
        </GlowText>
        <p className="text-base sm:text-xl md:text-2xl text-(--muted) max-w-xl md:max-w-2xl leading-relaxed">
          {site.description}
        </p>

        <div className="flex gap-4 sm:gap-6 mt-6 justify-center items-center">
          <Link
            href={"/game"}
            className="btn primary shrink-0 font-bold px-8 py-4 text-xl sm:text-2xl rounded-full text-center"
          >
            開始遊戲
          </Link>
          <Link
            href={"/rankings"}
            className="btn secondary shrink-0 font-bold px-8 py-4 text-xl sm:text-2xl rounded-full text-center"
          >
            排行榜
          </Link>
        </div>
      </div>
      <div className="fixed bottom-4 left-4 z-50 flex flex-col items-center">
        <ShareButton className="relative text-4xl p-3">
          <ShareAltOutlined />
        </ShareButton>

        {/* 提示氣泡 */}
        {user && (
          <div className="left-full top-1/2 -translate-y-1/2 absolute z-11">
            <div className="bg-(--background) border-b border-l border-(--secondary) absolute z-10 -left-1 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45"/>
            <div className="bg-(--background) border border-(--secondary) px-3 py-2 rounded-full">
              <p className="text-xs font-bold text-white whitespace-nowrap flex items-center gap-1">
                分享連結被點擊可獲金幣 💰
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
