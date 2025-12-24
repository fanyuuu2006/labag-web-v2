"use client";
import { game } from "@/libs/game";
import { useCallback, useState } from "react";

export const PlayButton = () => {
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
      className="btn-primary font-bold px-12 py-6 text-4xl rounded-full shadow-[0_0_30px_var(--text-color-primary)] hover:shadow-[0_0_50px_var(--text-color-primary)] transition-all duration-300 scale-100 hover:scale-105 active:scale-95"
      onClick={hanldeStartClick}
    >
      開始
    </button>
  );
};
