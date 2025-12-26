"use client";
import React, {  memo, useEffect, useState } from "react";
import { cn } from "@/utils/className";
import { game } from "@/libs/game";
import { GlowText } from "../GlowText";
import { ModeName } from "labag";

type InfoCardProps = React.HTMLAttributes<HTMLDivElement>;

type InfoState = {
  times: Record<ModeName, number>;
  score: number;
  marginScore: number;
  gssCount: number;
  currentModes: string[];
};

const ModeBadge = memo(({ mode }: { mode: string }) => {
  const style: React.CSSProperties = {
    background: `var(--${mode}-text-color-primary)`,
    color: `var(--${mode}-background-color-secondary)`,
    boxShadow: `0 4px 14px rgba(0,0,0,0.25)`,
  };
  return (
    <span
      className="text-xs sm:text-sm md:text-base font-semibold mr-2 mb-2 rounded-full py-1 px-3 inline-flex items-center"
      style={style}
      aria-label={`mode-${mode}`}
    >
      {mode}
    </span>
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
    currentModes: game.getCurrentConfig().modes.map((m) => m.name),
  });

  useEffect(() => {
    const handleRoundStart = () => setInfo((s) => ({ ...s, marginScore: 0 }));

    const handleRoundEnd = (g: typeof game) => {
      // delay to allow round-end UI/animation to finish
      setTimeout(() => {
        setInfo({
          times: {
            superhhh: g.getMode("superhhh")?.variable.times || 0,
            greenwei: g.getMode("greenwei")?.variable.times || 0,
            pikachu: g.getMode("pikachu")?.variable.times || 0,
            normal: g.times - g.played,
          },
          score: g.score,
          marginScore: g.marginScore,
          gssCount: g.getMode("greenwei")?.variable.count || 0,
          currentModes: g.getCurrentConfig().modes.map((m) => m.name),
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
        "bg-black/40 rounded-md p-3 md:p-6 flex flex-col gap-2 sm:gap-3 items-start sm:items-center shadow-md",
        className
      )}
      {...rest}
    >
      <GlowText
        as="h2"
        className="text-base sm:text-lg md:text-2xl font-bold mb-1 tracking-wider"
        style={{ color: "var(--text-color-primary)" }}
      >
        遊戲資訊
      </GlowText>

      <div className="flex flex-col gap-2 w-full">
        <dl className="grid grid-cols-2 md:grid-cols-2 gap-2 lg:gap-3 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <dt className="text-xs sm:text-sm md:text-base uppercase" style={{ color: "var(--text-color-muted)" }}>
              剩餘次數
            </dt>
            <dd className="text-base md:text-xl font-extrabold">
              {info.times.normal}
            </dd>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <dt className="text-xs sm:text-sm md:text-base" style={{ color: "var(--text-color-muted)" }}>
              目前分數
            </dt>
            <dd className="flex items-center gap-2">
              <GlowText as="span" className="text-base md:text-xl font-extrabold">
                {info.score}
              </GlowText>
              {info.marginScore !== 0 && (
                <span className="text-yellow-300 font-semibold">+{info.marginScore}</span>
              )}
            </dd>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <dt className="text-xs sm:text-sm md:text-base uppercase" style={{ color: "var(--greenwei-text-color-secondary)" }}>
              咖波累積數
            </dt>
            <dd className="text-base md:text-xl font-bold" style={{ color: "var(--greenwei-text-color-primary)" }}>
              {info.gssCount}
            </dd>
          </div>

          <div className="flex flex-col gap-1">
            <dt className="text-sm md:text-base uppercase" style={{ color: "var(--text-color-muted)" }}>當前模式</dt>
            <dd className="flex items-center flex-wrap">
              {info.currentModes.length > 0 ? (
                info.currentModes.map((mode, idx) => (
                  <ModeBadge key={idx} mode={mode} />
                ))
              ) : (
                <span className="text-xs sm:text-sm md:text-base font-semibold">無</span>
              )}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-2 w-full mt-2">
          {info.currentModes.includes("superhhh") && (
            <div className="flex justify-between items-center gap-2 py-2 px-3 bg-white/10 rounded-md">
              <span className="text-xs sm:text-sm" style={{ color: "var(--text-color-muted)" }}>超級阿禾剩餘次數</span>
              <span className="text-sm sm:text-base font-bold">{info.times.superhhh}</span>
            </div>
          )}

          {info.currentModes.includes("greenwei") && (
            <div className="flex justify-between items-center gap-2 py-2 px-3 bg-white/10 rounded-md">
              <span className="text-xs sm:text-sm" style={{ color: "var(--text-color-muted)" }}>綠光阿瑋剩餘次數</span>
              <span className="text-sm sm:text-base font-bold">{info.times.greenwei}</span>
            </div>
          )}

          {info.currentModes.includes("pikachu") && (
            <div className="flex justify-between items-center gap-2 py-2 px-3 bg-white/10 rounded-md">
              <span className="text-xs sm:text-sm" style={{ color: "var(--text-color-muted)" }}>皮卡丘已觸發次數</span>
              <span className="text-sm sm:text-base font-bold">{info.times.pikachu}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

InfoCard.displayName = "InfoCard";
