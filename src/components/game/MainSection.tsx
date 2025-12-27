"use client";
import { game } from "@/libs/game";
import { useEffect } from "react";
import { PlayButton } from "./PlayButton";
import { useRouter } from "next/navigation";
import { PatternsDiv } from "./PatternsDiv";
import { InfoCard } from "./InfoCard";
import { playAudio } from "@/utils/audio";

export const MainSection = () => {
  const router = useRouter();
  useEffect(() => {
    let timeoutId: number | null = null;

    const handleGameOver = () => {
      timeoutId = window.setTimeout(() => {
        playAudio(`/audios/ding.mp3`);
        router.push("/gameover");
      }, 3500);
    };

    game.addEventListener("gameOver", handleGameOver);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      game.removeEventListener("gameOver", handleGameOver);
    };
  }, [router]);

  return (
    <section className="h-full">
      <div className="container h-full flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex items-end lg:items-center justify-center">
          <PatternsDiv />
        </div>
        <aside className="flex-1 flex flex-col justify-center items-center gap-6">
          <InfoCard className="w-full" />
          <PlayButton className="w-3/4" />
        </aside>
      </div>
    </section>
  );
};
