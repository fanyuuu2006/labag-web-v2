"use client";
import { statsLabels, VALID_KEYS } from "@/libs/backend";
import { GlowText } from "../GlowText";
import Link from "next/link";

export const MainSection = () => {
  return (
    <section className="h-full">
      <div className="container h-full flex flex-col items-center justify-center gap-8 px-4">
        <GlowText
          as="h2"
          className="text-5xl sm:text-6xl md:text-8xl font-bold leading-tight tracking-tight text-center"
        >
          排行榜
        </GlowText>

        <div className="flex flex-col gap-6 w-full max-w-md">
          {VALID_KEYS.map((key) => (
            <Link
              key={key}
              href={`/rankings/${key}`}
              className="btn-primary font-bold px-8 py-4 text-xl sm:text-2xl rounded-full text-center w-full transition-transform hover:scale-105"
            >
              {statsLabels[key]}
            </Link>
          ))}

          <div className="h-4" />

          <Link
            href="/"
            className="btn-secondary font-bold px-8 py-4 text-xl sm:text-2xl rounded-full text-center w-full transition-transform hover:scale-105"
          >
            返回首頁
          </Link>
        </div>
      </div>
    </section>
  );
};
