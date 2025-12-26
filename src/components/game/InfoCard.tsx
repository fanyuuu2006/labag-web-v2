"use client";
import React, { Fragment, memo, useEffect, useState } from "react";
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
    color: `var(--${mode}-background-color-primary)`,
  };
  return (
    <span
      className="text-lg md:text-xl font-bold mr-1 rounded-full py-0.5 px-3"
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
        "bg-black/40 rounded-md p-4 md:p-8 flex flex-col gap-2 items-center",
        className
      )}
      {...rest}
    >
      <GlowText
        as="h2"
        className="text-xl md:text-2xl font-bold mb-2 tracking-wider"
      >
        遊戲資訊
      </GlowText>

      <div className="flex flex-col gap-3 w-full items-start">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          <div className="flex items-center gap-2">
            <dt className="text-base md:text-lg text-(--text-color-muted)">
              剩餘次數:
            </dt>
            <dd className="text-lg md:text-xl font-bold">
              {info.times.normal}
            </dd>
          </div>

          <div className="flex items-center gap-2">
            <dt className="text-base md:text-lg text-(--text-color-muted)">
              目前分數:
            </dt>
            <dd className="flex items-center gap-2">
              <GlowText as="span" className="text-lg md:text-xl font-bold">
                {info.score}
              </GlowText>
              {info.marginScore !== 0 && (
                <span className="text-yellow-200 font-bold">
                  +{info.marginScore}
                </span>
              )}
            </dd>
          </div>

          <div className="flex items-center gap-2">
            <dt className="text-base md:text-lg text-(--greenwei-text-color-secondary)">
              咖波累積數:
            </dt>
            <dd className="text-lg md:text-xl font-bold text-(--greenwei-text-color-primary)">
              {info.gssCount}
            </dd>
          </div>

          <div className="flex items-center gap-2">
            <dt className="text-base md:text-lg text-(--text-color-muted)">
              當前模式:
            </dt>
            <dd className="flex items-center flex-wrap">
              {info.currentModes.length > 0 ? (
                info.currentModes.map((mode, idx) => (
                  <Fragment key={mode}>
                    <ModeBadge mode={mode} />
                    {idx < info.currentModes.length - 1 && <span>、</span>}
                  </Fragment>
                ))
              ) : (
                <span className="text-lg md:text-xl font-bold">無</span>
              )}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-2 w-full">
          {info.currentModes.includes("superhhh") && (
            <div className="flex items-center gap-2">
              <span className="text-base md:text-lg text-(--text-color-muted)">
                超級阿禾剩餘次數:
              </span>
              <span className="text-lg md:text-xl font-bold">
                {info.times.superhhh}
              </span>
            </div>
          )}

          {info.currentModes.includes("greenwei") && (
            <div className="flex items-center gap-2">
              <span className="text-base md:text-lg text-(--text-color-muted)">
                綠光阿瑋剩餘次數:
              </span>
              <span className="text-lg md:text-xl font-bold">
                {info.times.greenwei}
              </span>
            </div>
          )}

          {info.currentModes.includes("pikachu") && (
            <div className="flex items-center gap-2">
              <span className="text-base md:text-lg text-(--text-color-muted)">
                皮卡丘已觸發次數:
              </span>
              <span className="text-lg md:text-xl font-bold">
                {info.times.pikachu}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

InfoCard.displayName = "InfoCard";
