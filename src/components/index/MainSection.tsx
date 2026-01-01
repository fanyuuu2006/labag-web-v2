"use client";

import { game } from "@/libs/game";
import { site } from "@/libs/site";
import Link from "next/link";
import { GlowText } from "../GlowText";

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
        <p className="text-base sm:text-xl md:text-2xl text-(--text-color-muted) max-w-xl md:max-w-2xl leading-relaxed">
          {site.description}
        </p>

        <div className="flex flex-co gap-4 sm:gap-6 mt-6 w-full justify-center items-center">
          <Link
            href={"/game"}
            className="btn-primary font-bold px-8 py-4 text-xl sm:text-2xl rounded-full text-center"
            onClick={() => {
              game.init();
            }}
          >
            開始遊戲
          </Link>
          <Link
            href={"/ranking"}
            className="btn-secondary font-bold px-8 py-4 text-xl sm:text-2xl rounded-full text-center"
          >
            排行榜
          </Link>
        </div>
      </div>
    </section>
  );
};
