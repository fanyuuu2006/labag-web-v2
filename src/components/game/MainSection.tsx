"use client";
import { game } from "@/libs/game";
import { useEffect } from "react";
import { PlayButton } from "./PlayButton";
import { useRouter } from "next/navigation";
import { PatternsDiv } from "./PatternsDiv";
import { InfoCard } from "./InfoCard";
import { playAudio } from "@/utils/audio";
import { recorder } from "@/libs/recorder";

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

  useEffect(() => {
    recorder.init();
    return () => {
      recorder.dispose();
    }
  }, []);

  return (
    <section className="h-full">
      <div className="container h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex items-end lg:items-center justify-center">
          <PatternsDiv />
        </div>
        <aside className="flex flex-col justify-start lg:justify-center items-center gap-4 md:gap-6">
          <InfoCard className="w-full" />
          <PlayButton className="w-3/4" />
        </aside>
      </div>
    </section>
  );
};
