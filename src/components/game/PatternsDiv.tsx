"use client";
import { useEffect, useState } from "react";
import { MyImage } from "../MyImage";
import { game } from "@/libs/game";
import { GlowText } from "../GlowText";
import { Pattern } from "labag";

const PatternCard = ({ index }: { index: number }) => {
  const [pattern, setPattern] = useState<Pattern | null>(null);
  useEffect(() => {
    const getPattern = (g: typeof game) => {
      const pattern = g.patterns[index];
      const name = pattern?.name;
      setPattern(null);
      if (name) {
        setTimeout(() => setPattern(pattern), (index + 1) * 500);
      }
    };
    const updatePattern = (g: typeof game) => {
      const pattern = g.patterns[index];
      const name = pattern?.name;
      setPattern(null);
      if (name) {
        setTimeout(() => setPattern(pattern), 3000);
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
    <div className="aspect-3/4 text-[7vh] font-bold card">
      {pattern ? (
        <MyImage
          src={`/images/patterns/${pattern.name}.jpg`}
          alt={`Pattern ${index + 1}: ${pattern.name}`}
          className="w-full h-auto object-cover scale-105"
          title={pattern.name}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <GlowText className="text-4xl">?</GlowText>
        </div>
      )}
    </div>
  );
};
export const PatternsDiv = () => {
  return (
    <div className="grid grid-cols-3 w-full gap-2 md:max-w-2xl">
      {Array.from({ length: 3 }).map((_, idx) => (
        <PatternCard key={idx} index={idx} />
      ))}
    </div>
  );
};
