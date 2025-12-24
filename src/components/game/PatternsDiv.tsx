"use client";
import { useEffect, useState } from "react";
import { MyImage } from "../MyImage";
import { game } from "@/libs/game";
import { GlowText } from "../GlowText";

const Pattrern = ({ index }: { index: number }) => {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    const getPattern = (g: typeof game) => {
      setTimeout(() => {
        if (g.patterns[index]) {
          setSrc(`/images/patterns/${g.patterns[index]?.name}.jpg`);
        } else {
          setSrc(null);
        }
      }, (index + 1) * 500);
    };
    game.addEventListener("roundEnd", getPattern);
    return () => {
      game.removeEventListener("roundEnd", getPattern);
    };
  }, [index]);
  return (
    <div className="aspect-3/4 text-6xl md:text-7xl lg:text-8xl font-bold bg-(--background-color-secondary) border-2 border-(--border-color) overflow-hidden ">
      {src ? (
        <MyImage
          src={src}
          alt={`Pattern ${index + 1}`}
          className="w-full h-auto object-cover"
          onError={() => setSrc(null)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <GlowText>?</GlowText>
        </div>
      )}
    </div>
  );
};
export const PatternsDiv = () => {
  return (
    <div className="grid grid-cols-3 w-full md:max-w-3xl">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Pattrern key={idx} index={idx} />
      ))}
    </div>
  );
};
