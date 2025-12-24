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
  const hanldeStartClick = useCallback(() => {
    setDisable(true);
    game.play();
    setTimeout(() => {
      setDisable(false);
    }, 3500);
  }, []);
  return (
    <button
      disabled={disable}
      className={cn(
        "btn-primary font-bold px-8 py-4 text-2xl md:text-3xl lg:text-4xl rounded-full shadow-[0_0_30px_var(--text-color-primary)] hover:shadow-[0_0_50px_var(--text-color-primary)] transition-all duration-300 scale-100 hover:scale-105 active:scale-95",
        className
      )}
      onClick={hanldeStartClick}
      {...rest}
    >
      開始
    </button>
  );
};
