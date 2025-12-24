"use client";
import { useEffect, useState } from "react";
import { MyImage } from "../MyImage";
import { game } from "@/libs/game";
import { GlowText } from "../GlowText";

const Pattrern = ({ index }: { index: number }) => {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    const getPattern = (g: typeof game) => {
      const pattern = g.patterns[index];
      const name = pattern?.name;
      setSrc(null);
      if (name) {
        setTimeout(() => {
          setSrc(`/images/patterns/${name}.jpg`);
        }, (index + 1) * 500);
      }
    };
    const updatePattern = (g: typeof game) => {
      const pattern = g.patterns[index];
      const name = pattern?.name;
      setSrc(null);
      if (name) {
        setTimeout(() => {
          setSrc(`/images/patterns/${name}.jpg`);
        }, 3000);
      }
    };
    game.addEventListener("rollSlots", getPattern);
    game.addEventListener("roundEnd", updatePattern);
    return () => {
      game.removeEventListener("rollSlots", getPattern);
      game.removeEventListener("roundEnd", updatePattern);
    };
  }, [index]);
  return (
    <div className="aspect-3/4 text-6xl md:text-7xl lg:text-8xl font-bold bg-(--background-color) border border-(--text-color-primary) overflow-hidden rounded-md">
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
    <div className="grid grid-cols-3 w-full gap-1 md:max-w-2xl">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Pattrern key={idx} index={idx} />
      ))}
    </div>
  );
};
