"use client";

import { GlowText } from "@/components/GlowText";

export const MainSection = () => {
  return (
    <section className="h-full">
      <div className="container h-full flex flex-col items-center justify-center px-4">
        <div className="card rounded-2xl p-6 md:p-10 text-center w-full max-w-lg flex flex-col items-center justify-center gap-4">
          <GlowText className="text-2xl md:text-4xl font-bold leading-normal break-keep"></GlowText>
        </div>
      </div>
    </section>
  );
};
