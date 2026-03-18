"use client";
import { site } from "@/libs/site";
import Link from "next/link";
import { GlowText } from "../GlowText";
import { ShareAltOutlined } from "@ant-design/icons";
import { ShareButton } from '../ShareButton';

export const MainSection = () => {
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
      <ShareButton className="fixed bottom-4 left-4 z-50 text-3xl">
        <ShareAltOutlined />
      </ShareButton>
    </section>
  );
};
