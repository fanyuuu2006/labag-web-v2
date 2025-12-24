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
        "btn-primary font-bold px-8 py-4 text-2xl md:text-3xl lg:text-4xl rounded-full",
        className
      )}
      onClick={hanldeStartClick}
      {...rest}
    >
      開始
    </button>
  );
};
