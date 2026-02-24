"use client";
import { game } from "@/libs/game";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";
import { useCallback, useState } from "react";

type PlayButtonProps = DistributiveOmit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onClick" | "disabled"
>;
export const PlayButton = ({ className, ...rest }: PlayButtonProps) => {
  const [disable, setDisable] = useState(false);
  const handleStartClick = useCallback(() => {
    if (disable) return;
    setDisable(true);
    game.play();
    setTimeout(() => setDisable(false), 3500);
  }, [disable]);
  const handleKey = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleStartClick();
    }
  }, [handleStartClick]);
  return (
    <button
      disabled={disable}
      className={cn(
        "btn primary font-bold px-6 py-3 text-2xl md:text-3xl lg:text-4xl rounded-full",
        className
      )}
      onClick={handleStartClick}
      onKeyDown={handleKey}
      aria-pressed={disable}
      aria-live="polite"
      {...rest}
    >
      開始
    </button>
  );
};
