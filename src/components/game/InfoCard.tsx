"use client";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";
import { game } from "@/libs/game";
import { Fragment, useEffect, useState } from "react";
import { GlowText } from "../GlowText";

type InfoCardProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const InfoCard = ({ className, ...rest }: InfoCardProps) => {
  // 剩餘遊玩次數
  const [played, setPlayed] = useState(game.played);
  const [score, setScore] = useState(game.score);
  const [marginScore, setMarginScore] = useState(game.marginScore);
  const [gssCount, setGssCount] = useState(
    game.getMode("greenwei")?.variable.count || 0
  );
  const [currentModes, setCurrentModes] = useState(
    game.getCurrentConfig().modes.map((mode) => mode.name)
  );

  useEffect(() => {
    const handleRoundStart = () => {
      setMarginScore(0);
    };
    const handleRoundEnd = (g: typeof game) => {
      setTimeout(() => {
        setPlayed(g.played);
        setScore(g.score);
        setMarginScore(g.marginScore);
        setGssCount(g.getMode("greenwei")?.variable.count || 0);
        setCurrentModes(g.getCurrentConfig().modes.map((mode) => mode.name));
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
      <div className="flex flex-col gap-2 w-full items-start">
        <p className="flex items-center gap-2">
          <span className="text-base md:text-lg text-(--text-color-muted)">
            剩餘次數:
          </span>
          <span className="text-lg md:text-xl font-bold">
            {game.times - played}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <span className="text-base md:text-lg text-(--text-color-muted)">
            目前分數:
          </span>
          <GlowText as="span" className="text-lg md:text-xl font-bold">
            {score}
          </GlowText>
          {marginScore !== 0 && (
            <span className="text-yellow-200 font-bold">+{marginScore}</span>
          )}
        </p>
        <p className="flex items-center gap-2">
          <span className="text-base md:text-lg text-(--greenwei-text-color-secondary)">
            咖波累積數:
          </span>
          <span className="text-lg md:text-xl font-bold text-(--greenwei-text-color-primary)">
            {gssCount}
          </span>
        </p>
        <div className="flex flex-col">
          <p className="text-base md:text-lg text-(--text-color-muted)">
            當前模式:
          </p>
          <p>
            {currentModes.length > 0 ? (
              currentModes.map((mode, idx) => (
                <Fragment key={mode}>
                  <span
                    className="text-lg md:text-xl font-bold"
                    style={{
                      color: `var(--${mode}-text-color-primary)`,
                    }}
                  >
                    {mode}
                  </span>
                  {idx < currentModes.length - 1 && <span>、</span>}
                </Fragment>
              ))
            ) : (
              <span className="text-lg md:text-xl font-bold">無</span>
            )}
          </p>
        </div>
        {currentModes.some((m) => m === "superhhh") && (
          <p className="flex items-center gap-2">
            <span className="text-base md:text-lg text-(--text-color-muted)">
              超級阿禾剩餘次數:
            </span>
            <span className="text-lg md:text-xl font-bold">
              {game.getMode("superhhh")?.variable.times || 0}
            </span>
          </p>
        )}
        {currentModes.some((m) => m === "greenwei") && (
          <p className="flex items-center gap-2">
            <span className="text-base md:text-lg text-(--text-color-muted)">
              綠光阿瑋剩餘次數:
            </span>
            <span className="text-lg md:text-xl font-bold">
              {game.getMode("greenwei")?.variable.times || 0}
            </span>
          </p>
        )}
        {currentModes.some((m) => m === "pikachu") && (
          <p className="flex items-center gap-2">
            <span className="text-base md:text-lg text-(--text-color-muted)">
              皮卡丘以觸發次數:
            </span>
            <span className="text-lg md:text-xl font-bold">
              {game.getMode("pikachu")?.variable.times || 0}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
