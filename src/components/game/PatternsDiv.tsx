"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { MyImage } from "../MyImage";
import { game } from "@/libs/game";
import { GlowText } from "../GlowText";
import { Pattern } from "labag";
import { playAudio } from "@/utils/audio";
import { useModal } from "@/hooks/useModal";
import { getPatternInfo } from "@/utils/game";

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
    const timers: NodeJS.Timeout[] = [];
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
            playAudio(`/audios/ding.mp3`);
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
            playAudio(`/audios/${name}On.mp3`);
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
            <>
              <MyImage
                src={`/images/patterns/${pattern.name}.jpg`}
                alt={`Pattern ${idx + 1}: ${pattern.name}`}
                className="w-full h-full object-cover scale-105"
                title={pattern.name}
                onClick={() => handlePatternClick(pattern)}
              />
            </>
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

const PatternInfoCard = ({
  pattern,
  close,
}: {
  pattern: Pattern;
  close: () => void;
}) => {
  const { name, scores, rate } = getPatternInfo(pattern);

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg card p-4 flex flex-col gap-2 sm:gap-3 items-start sm:items-center shadow-md animate-pop">
      <GlowText
        as="h2"
        className="text-base sm:text-lg md:text-2xl font-bold mb-1 tracking-wider"
        style={{ color: "var(--text-color-primary)" }}
      >
        {name}
      </GlowText>

      <div className="flex w-full gap-4 items-start">
        <div className="w-1/3 min-w-30 aspect-square rounded-md overflow-hidden border border-(--border-color)">
          <MyImage
            src={`/images/patterns/${name}.jpg`}
            alt={name}
            className="w-full h-full object-cover scale-105"
          />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="text-xs text-(--text-color-muted)">出現率</div>
            <div className="text-sm font-bold text-(--text-color-primary)">
              {rate}%
            </div>
          </div>

          <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(0, Math.min(100, rate))}%`,
                background: `linear-gradient(90deg, var(--text-color-primary), var(--text-color-secondary))`,
              }}
            />
          </div>

          <div className="flex items-center flex-wrap gap-2 pt-1">
            {scores.map((s, i) => (
              <div
                key={i}
                className="text-xs sm:text-sm md:text-base font-extrabold mr-2 mb-2 rounded-full py-1 px-3 inline-flex items-center"
                style={{
                  background: `linear-gradient(135deg, var(--text-color-primary), var(--text-color-secondary))`,
                  color: `var(--background-color-primary)`,
                }}
              >
                {s}
              </div>
            ))}
          </div>

          <div className="mt-2 flex justify-end">
            <button
              onClick={() => {
                close();
              }}
              className="btn-secondary"
            >
              好的
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
