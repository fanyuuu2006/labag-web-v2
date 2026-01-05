"use client";

import { statsLabels } from "@/libs/backend";
import { GlowText } from "../GlowText";
import Link from "next/link";

export const MainSection = () => {
  return (
    <section className="h-full">
      <div className="container h-full flex flex-col items-center justify-center gap-8 md:gap-12">
        <GlowText
          as="h2"
          className="text-4xl md:text-6xl font-extrabold tracking-wider"
        >
          排行榜類別
        </GlowText>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
          {Object.entries(statsLabels).map(([key, label]) => (
            <Link
              key={key}
              href={`/rankings/${key}`}
              className="card-secondary group flex flex-col items-center justify-center p-8 md:p-12 gap-4 transition-all duration-300"
            >
              <GlowText
                as="h3"
                className="text-2xl md:text-4xl font-bold group-hover:scale-110 transition-transform duration-300"
              >
                {label}
              </GlowText>
              <span className="text-white/60 text-sm md:text-base group-hover:text-white/90 transition-colors">
                點擊查看{label}排行
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
