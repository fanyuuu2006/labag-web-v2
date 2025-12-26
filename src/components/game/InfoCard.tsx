"use client";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";
import { game } from "@/libs/game";
import { useEffect, useState } from "react";
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
        "bg-black/40 rounded-md p-6 md:p-8 flex flex-col gap-2 items-center",
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
      </div>
    </div>
  );
};
