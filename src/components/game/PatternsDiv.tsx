"use client";
import { useEffect, useState } from "react";
import { MyImage } from "../MyImage";
import { game } from "@/libs/game";
import { GlowText } from "../GlowText";
import { Pattern } from "labag";
import { playAudio } from "@/utils/audio";

export const PatternsDiv = () => {
  const [patterns, setPatterns] = useState<(Pattern | null)[]>([
    null,
    null,
    null,
  ]);

  useEffect(() => {
    const cleanPatterns = () => {
      setPatterns([null, null, null]);
    };
    const revealPatterns = (g: typeof game) => {
      g.patterns.forEach((p, index) => {
        const name = p?.name;
        if (name) {
          setTimeout(() => {
            setPatterns((prev) => {
              const next = [...prev];
              next[index] = p;
              return next;
            });
            playAudio(`/audios/ding.mp3`);
          }, (index + 1) * 500);
        }
      });
    };
    const updatePatterns = (g: typeof game) => {
      let diffName: string | null = null;
      g.patterns.forEach((p, index) => {
        const currentPattern = patterns[index];
        if (p && (!currentPattern || p.name !== currentPattern.name)) {
          diffName = p.name;
        }
      });
      if (diffName) {
        setTimeout(() => {
          setPatterns(g.patterns);
          playAudio(`/audios/${diffName}On.mp3`);
        }, 3000);
      }
    };
    game.addEventListener("roundStart", cleanPatterns);
    game.addEventListener("roundEnd", revealPatterns);
    game.addEventListener("roundEnd", updatePatterns);
    return () => {
      game.removeEventListener("roundStart", cleanPatterns);
      game.removeEventListener("roundEnd", revealPatterns);
      game.removeEventListener("roundEnd", updatePatterns);
    };
  }, [patterns]);

  return (
    <div className="grid grid-cols-3 w-full gap-2 md:max-w-2xl">
      {patterns.map((pattern, idx) => (
        <div key={idx} className="aspect-3/4 text-[7vh] font-bold card">
          {pattern ? (
            <MyImage
              src={`/images/patterns/${pattern.name}.jpg`}
              alt={`Pattern ${idx + 1}: ${pattern.name}`}
              className="w-full h-auto object-cover scale-105"
              title={pattern.name}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <GlowText className="text-4xl">?</GlowText>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
