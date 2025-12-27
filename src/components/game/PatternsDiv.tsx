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
                className="w-full h-auto object-cover scale-105"
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
  const info = getPatternInfo(pattern);
  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg card flex flex-col items-center p-4 sm:p-6 gap-3 animate-pop">
      <GlowText
        as="h3"
        className="text-2xl sm:text-3xl font-extrabold underline-spread"
      >
        {pattern.name}
      </GlowText>
      <div className="p-2 w-full flex justify-center">
        <MyImage
          src={`/images/patterns/${pattern.name}.jpg`}
          alt={pattern.name}
          className="w-auto max-w-full h-auto max-h-[28vh] sm:max-h-[36vh] object-contain rounded-md border border-white/10"
        />
      </div>
      <div className="w-full">
        <div className="w-full bg-white/5 rounded-md p-3 text-sm sm:text-base">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-(--text-color-muted)">出現機率</span>
            <span className="font-extrabold text-base">{info.rate}%</span>
          </div>

          <div className="mb-2">
            <div className="text-xs text-(--text-color-muted) mb-1">
              得分等級（高 / 中 / 低）
            </div>
            <div className="flex gap-2 items-center">
              {info.scores && info.scores.length > 0 ? (
                info.scores.map((s, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 bg-white/10 rounded-md font-semibold"
                  >
                    {s}
                  </div>
                ))
              ) : (
                <span className="text-xs">暫無資料</span>
              )}
            </div>
          </div>

          <div className="text-sm text-(--text-color-muted)">
            此圖案在目前配置中佔比約{" "}
            <strong className="text-white font-semibold">{info.rate}%</strong>
            ，出現時可取得上述分數之一，具體得分依組合計算。
          </div>
        </div>

        <div className="flex w-full justify-center sm:justify-end mt-3">
          <button
            className="btn-tertiary px-4 py-2 rounded-full w-full sm:w-auto text-sm"
            onClick={() => close()}
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};
