"use client";
import React, { memo, useEffect, useState } from "react";
import { cn } from "@/utils/className";
import { game } from "@/libs/game";
import { GlowText } from "../GlowText";
import { ModeName } from "labag";
import { description } from "../../libs/game";
import { usePatternModal } from "@/contexts/PatternModalContext";
import { useModeModal } from "@/contexts/ModeModalContext";

type InfoCardProps = React.HTMLAttributes<HTMLDivElement>;

type InfoState = {
  times: Record<ModeName, number>;
  score: number;
  marginScore: number;
  gssCount: number;
  currentModes: ModeName[];
};

const ModeBadge = memo(({ mode }: { mode: ModeName }) => {
  const modal = useModeModal();
  return (
    <>
      <button
        className="btn primary text-xs sm:text-sm md:text-base font-extrabold rounded-full py-1 px-3 flex items-center"
        aria-label={`mode-${mode}`}
        onClick={() => modal.open(mode)}
        data-theme={mode}
      >
        {mode}
      </button>
    </>
  );
});
ModeBadge.displayName = "ModeBadge";

export const InfoCard = memo(({ className, ...rest }: InfoCardProps) => {
  const [info, setInfo] = useState<InfoState>({
    times: {
      superhhh: game.getMode("superhhh")?.variable.times || 0,
      greenwei: game.getMode("greenwei")?.variable.times || 0,
      pikachu: game.getMode("pikachu")?.variable.times || 0,
      normal: game.times - game.played,
    },
    score: game.score,
    marginScore: game.marginScore,
    gssCount: game.getMode("greenwei")?.variable.count || 0,
    currentModes: game.getCurrentConfig().modes.map((m) => m.name as ModeName),
  });
  const patternModal = usePatternModal();

  useEffect(() => {
    const handleRoundStart = () => setInfo((s) => ({ ...s, marginScore: 0 }));

    const handleRoundEnd = (g: typeof game) => {
      setTimeout(() => {
        const times = g.modes.reduce(
          (acc, mode) => {
            acc[mode.name as ModeName] =
              mode.name === "normal"
                ? g.times - g.played
                : mode.variable.times || 0;
            return acc;
          },
          {} as Record<ModeName, number>,
        );
        setInfo({
          times: times,
          score: g.score,
          marginScore: g.marginScore,
          gssCount: g.getMode("greenwei")?.variable.count || 0,
          currentModes: g
            .getCurrentConfig()
            .modes.map((m) => m.name as ModeName),
        });
      }, 3000);
    };

    game.addEventListener("roundEnd", handleRoundEnd);
    game.addEventListener("roundStart", handleRoundStart);
    return () => {
      game.removeEventListener("roundEnd", handleRoundEnd);
      game.removeEventListener("roundStart", handleRoundStart);
    };
  }, []);

  return (
    <div
      className={cn(
        "card secondary rounded-xl p-5 sm:p-6 flex flex-col gap-3 sm:gap-4 items-start",
        className,
      )}
      {...rest}
    >
      <GlowText
        as="h2"
        className="text-base sm:text-lg md:text-2xl font-bold mb-1"
        style={{ color: "var(--primary)" }}
      >
        遊戲資訊
      </GlowText>

      <div className="flex flex-col gap-3 w-full">
        <dl className="grid grid-cols-2 gap-3 lg:gap-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <dt
              className="text-xs sm:text-sm md:text-base"
              style={{ color: "var(--muted)" }}
            >
              剩餘次數
            </dt>
            <dd className="text-base md:text-xl font-extrabold">
              {info.times.normal}
            </dd>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <dt
              className="text-xs sm:text-sm md:text-base"
              style={{ color: "var(--muted)" }}
            >
              目前分數
            </dt>
            <dd className="flex items-center gap-2">
              <GlowText
                as="span"
                className="text-base md:text-xl font-extrabold"
              >
                {info.score}
              </GlowText>
              {info.marginScore !== 0 && (
                <span className="text-yellow-300 font-semibold text-[0.8em]">
                  +{info.marginScore}
                </span>
              )}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt
              className="text-sm md:text-base flex flex-wrap items-center"
              style={{ color: "var(--muted)" }}
            >
              當前模式
              <span
                className="ml-1 text-[0.7em]"
                style={{ color: "var(--muted)" }}
              >
                (點擊模式以查看說明)
              </span>
            </dt>
            <dd className="flex items-center flex-wrap gap-2">
              {info.currentModes.length > 0 ? (
                info.currentModes.map((mode, idx) => (
                  <ModeBadge key={idx} mode={mode} />
                ))
              ) : (
                <span className="text-xs sm:text-sm md:text-base font-semibold">
                  無
                </span>
              )}
            </dd>
          </div>
          <div
            className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
            data-theme="greenwei"
          >
            <dt
              className="text-xs sm:text-sm md:text-base"
              style={{ color: "var(--secondary)" }}
            >
              <button
                onClick={() =>
                  patternModal.open(
                    game.getMode("greenwei")?.variable.bindPattern,
                  )
                }
              >
                {game.getMode("greenwei")?.variable.bindPattern.name}
              </button>{" "}
              累積數
            </dt>
            <dd
              className="text-base md:text-xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              {info.gssCount}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-3 w-full mt-3">
          {info.currentModes
            .filter((mode) => mode !== "normal")
            .map((mode) => {
              return (
                <div
                  key={mode}
                  data-theme={mode}
                  className="card primary flex items-center justify-between gap-3 py-2 px-3 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-(--primary)" />
                    <span
                      className="text-xs sm:text-sm text-(--muted)"
                    >
                      {description[mode].name} 次數
                    </span>
                  </div>

                  <span
                    className="text-sm sm:text-base font-bold text-(--primary) tabular-nums"
                  >
                    {info.times[mode]}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
});

InfoCard.displayName = "InfoCard";
