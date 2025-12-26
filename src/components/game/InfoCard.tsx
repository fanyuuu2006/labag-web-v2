"use client";
import React, { Fragment, memo, useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/className";
import { game } from "@/libs/game";
import { GlowText } from "../GlowText";

type InfoCardProps = React.HTMLAttributes<HTMLDivElement>;

type InfoState = {
  played: number;
  score: number;
  marginScore: number;
  gssCount: number;
  currentModes: string[];
};

const ModeBadge = memo(({ mode }: { mode: string }) => {
  const style: React.CSSProperties = {
    color: `var(--${mode}-text-color-primary)`,
  };
  return (
    <span className="text-lg md:text-xl font-bold" style={style}>
      {mode}
    </span>
  );
});
ModeBadge.displayName = "ModeBadge";

export const InfoCard = memo(({ className, ...rest }: InfoCardProps) => {
  const [info, setInfo] = useState<InfoState>({
    played: game.played,
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
          played: g.played,
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

  const remaining = useMemo(
    () => Math.max(0, game.times - info.played),
    [info.played]
  );

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

      <div className="flex flex-col gap-2 w-full items-start">
        <p className="flex items-center gap-2">
          <span className="text-base md:text-lg text-(--text-color-muted)">
            剩餘次數:
          </span>
          <span className="text-lg md:text-xl font-bold">{remaining}</span>
        </p>

        <p className="flex items-center gap-2">
          <span className="text-base md:text-lg text-(--text-color-muted)">
            目前分數:
          </span>
          <GlowText as="span" className="text-lg md:text-xl font-bold">
            {info.score}
          </GlowText>
          {info.marginScore !== 0 && (
            <span className="text-yellow-200 font-bold">
              +{info.marginScore}
            </span>
          )}
        </p>

        <p className="flex items-center gap-2">
          <span className="text-base md:text-lg text-(--greenwei-text-color-secondary)">
            咖波累積數:
          </span>
          <span className="text-lg md:text-xl font-bold text-(--greenwei-text-color-primary)">
            {info.gssCount}
          </span>
        </p>

        <div className="flex flex-col">
          <p className="text-base md:text-lg text-(--text-color-muted)">
            當前模式:
          </p>
          <p>
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
          </p>
        </div>

        {info.currentModes.includes("superhhh") && (
          <p className="flex items-center gap-2">
            <span className="text-base md:text-lg text-(--text-color-muted)">
              超級阿禾剩餘次數:
            </span>
            <span className="text-lg md:text-xl font-bold">
              {game.getMode("superhhh")?.variable.times || 0}
            </span>
          </p>
        )}

        {info.currentModes.includes("greenwei") && (
          <p className="flex items-center gap-2">
            <span className="text-base md:text-lg text-(--text-color-muted)">
              綠光阿瑋剩餘次數:
            </span>
            <span className="text-lg md:text-xl font-bold">
              {game.getMode("greenwei")?.variable.times || 0}
            </span>
          </p>
        )}

        {info.currentModes.includes("pikachu") && (
          <p className="flex items-center gap-2">
            <span className="text-base md:text-lg text-(--text-color-muted)">
              皮卡丘已觸發次數:
            </span>
            <span className="text-lg md:text-xl font-bold">
              {game.getMode("pikachu")?.variable.times || 0}
            </span>
          </p>
        )}
      </div>
    </div>
  );
});

InfoCard.displayName = "InfoCard";
