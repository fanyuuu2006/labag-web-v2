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
  const displayRate = Number(Number(rate).toFixed(1));

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl card p-6 flex flex-col gap-2  animate-pop">
      <div className="flex flex-col sm:flex-row w-full gap-4 items-center">
        {/**左側 */}
        <div className="w-1/3 flex flex-col items-center gap-3">
          <div className="w-full aspect-square rounded-md overflow-hidden">
            <MyImage
              src={`/images/patterns/${name}.jpg`}
              alt={name}
              className="w-full h-full object-cover scale-105"
            />
          </div>
          {/**名稱 */}
          <GlowText
            as="h2"
            className="text-xl md:text-2xl lg:text-3xl font-extrabold"
          >
            {name}
          </GlowText>
        </div>

        {/**右側 */}
        <div className="flex-1 w-full">
          <div className="w-full flex flex-col gap-3">
            {/**機率進度條 */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="text-xs text-(--text-color-muted)">
                  當前出現機率
                </div>
                <div className="text-sm font-bold text-(--text-color-primary)">
                  {displayRate}%
                </div>
              </div>

              <div
                className="w-full h-2 bg-black/40 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={displayRate}
                title={`出現機率 ${displayRate}%`}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(0, Math.min(100, displayRate))}%`,
                    background: `linear-gradient(90deg, var(--text-color-primary), var(--text-color-secondary))`,
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs text-(--text-color-muted)">
                得分 (計分方式請見普通模式說明)
              </span>
              <div className="text-sm flex flex-col gap-1">
                {[
                  {
                    label: "三個相同",
                    score: scores[0],
                  },
                  {
                    label: "兩個相同",
                    score: scores[1],
                  },
                  {
                    label: "單個相同",
                    score: scores[2],
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-black/20 rounded-full px-4 py-1"
                  >
                    <div>{item.label}</div>
                    <div className="text-[1.2em] font-bold">{item.score}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center sm:justify-end">
              <button
                onClick={close}
                className="btn-secondary rounded-full px-4 py-2"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
