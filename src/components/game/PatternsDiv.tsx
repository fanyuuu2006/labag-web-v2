"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { MyImage } from "../MyImage";
import { game } from "@/libs/game";
import { GlowText } from "../GlowText";
import { Pattern } from "labag";
import { playAudio } from "@/utils/audio";
import { useModal } from "@/hooks/useModal";
import { PatternInfoCard } from "./PatternInfoCard";

export const PatternsDiv = () => {
  const modal = useModal({});
  const [patterns, setPatterns] = useState<(Pattern | null)[]>([
    null,
    null,
    null,
  ]);
  const [modalPattern, setModalPattern] = useState<Pattern | null>(null);

  const patternsRef = useRef<(Pattern | null)[]>([null, null, null]);

  const handlePatternClick = useCallback(
    (pattern: Pattern) => {
      modal.open();
      setModalPattern(pattern);
    },
    [modal]
  );

  useEffect(() => {
    const cleanPatterns = () => {
      setPatterns([null, null, null]);
    };
    const timers: ReturnType<typeof setTimeout>[] = [];
    const revealPatterns = (g: typeof game) => {
      patternsRef.current = [...g.patterns];
      g.patterns.forEach((p, index) => {
        const name = p?.name;
        if (name) {
          const id = setTimeout(() => {
            setPatterns((prev) => {
              const next = [...prev];
              next[index] = p;
              return next;
            });
            playAudio(`/audios/ding.mp3`, { volume: 0 });
          }, (index + 1) * 500);
          timers.push(id);
        }
      });
    };
    const updatePatterns = (g: typeof game) => {
      const diffNames: string[] = [];
      for (let index = 0; index < g.patterns.length; index++) {
        const p = g.patterns[index];
        const currentPattern = patternsRef.current[index];
        if (p && (!currentPattern || p.name !== currentPattern.name)) {
          diffNames.push(p.name);
          break;
        }
      }
      if (diffNames.length > 0) {
        const id = setTimeout(() => {
          setPatterns([...g.patterns]);
          diffNames.forEach((name) => {
            playAudio(`/audios/on/${name}.mp3`);
          });
        }, 3000);
        timers.push(id);
      }
    };
    game.addEventListener("roundStart", cleanPatterns);
    game.addEventListener("rollSlots", revealPatterns);
    game.addEventListener("roundEnd", updatePatterns);
    return () => {
      game.removeEventListener("roundStart", cleanPatterns);
      game.removeEventListener("rollSlots", revealPatterns);
      game.removeEventListener("roundEnd", updatePatterns);
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div className="grid grid-cols-3 w-full gap-1 md:max-w-2xl">
      {patterns.map((pattern, idx) => (
        <div key={idx} className="aspect-3/4 text-[7vh] font-bold card">
          {pattern ? (
            <MyImage
              src={`/images/patterns/${pattern.name}.jpg`}
              alt={`Pattern ${idx + 1}: ${pattern.name}`}
              className="w-full h-full object-cover scale-105 cursor-pointer"
              title={pattern.name}
              onClick={() => handlePatternClick(pattern)}
              role="button"
              aria-label={`開啟圖案 ${pattern.name} 詳情`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handlePatternClick(pattern);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <GlowText className="text-8xl">?</GlowText>
            </div>
          )}
        </div>
      ))}
      <modal.Container className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
        {modalPattern && (
          <PatternInfoCard pattern={modalPattern} close={modal.close} />
        )}
      </modal.Container>
    </div>
  );
};
