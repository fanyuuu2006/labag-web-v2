"use client";
import { PatternsDiv } from "./PatternsDiv";
import { MusicAudio } from "./MusicAudio";
import { cn } from "@/utils/className";
import { Pattern } from "labag";
import { useState } from "react";

export const MainSection = () => {
  const [patterns, setPatterns] = useState<(Pattern | null)[]>([
    null,
    null,
    null,
  ]);
  return (
    <section className="h-full">
      <div className="container h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex items-end lg:items-center justify-center">
          <PatternsDiv patterns={patterns} className="w-full md:max-w-2xl" />
        </div>
        <aside className="flex flex-col justify-start lg:justify-center items-center gap-4 md:gap-6">
          {/* 開始按鈕 */}
          <button
            className={cn(
              "w-3/4 btn primary font-bold px-6 py-3 text-2xl md:text-3xl lg:text-4xl rounded-full",
            )}
            aria-live="polite"
          >
            開始
          </button>
        </aside>
      </div>
      <MusicAudio loop preload="auto" />
    </section>
  );
};
