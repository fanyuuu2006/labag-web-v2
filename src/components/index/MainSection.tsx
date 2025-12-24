"use client";

import { game } from "@/libs/game";
import { site } from "@/libs/site";
import Link from "next/link";
import { GlowText } from "../GlowText";

export const MainSection = () => {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center py-20 gap-12">
      <div className="container flex flex-col items-center text-center gap-6">
        <GlowText as="h2" className="text-6xl md:text-7xl font-bold">
          {site.title}
        </GlowText>
        <p className="text-xl md:text-2xl text-(--text-color-muted) max-w-2xl">
          {site.description}
        </p>

        <div className="flex gap-4 mt-8">
          <Link
            href={"/game"}
            className="btn-primary font-bold px-8 py-4 text-2xl rounded-full"
            onClick={() => {
              game.init();
            }}
          >
            開始遊戲
          </Link>
          <Link
            href={"/rankings"}
            className="btn-secondary font-bold px-8 py-4 text-2xl rounded-full"
          >
            排行榜
          </Link>
        </div>
      </div>
    </section>
  );
};
