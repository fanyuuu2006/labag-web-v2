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
      className="btn-tertiary font-bold px-6 py-3 text-2xl rounded-full"
      onClick={hanldeStartClick}
    >
      開始
    </button>
  );
};
