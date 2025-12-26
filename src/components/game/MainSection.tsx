"use client";
import { game } from "@/libs/game";
import { useEffect } from "react";
import { PlayButton } from "./PlayButton";
import { useRouter } from "next/navigation";
import { PatternsDiv } from "./PatternsDiv";
import { InfoCard } from "./InfoCard";

export const MainSection = () => {
  const router = useRouter();
  useEffect(() => {
    const handleGameOver = () => {
      setTimeout(() => router.push("/gameover"), 3500);
    };
    game.addEventListener("gameOver", handleGameOver);
    return () => {
      game.removeEventListener("gameOver", handleGameOver);
    };
  }, [router]);
  return (
    <section className="h-full py-8" aria-labelledby="game-section-title">
      <div className="container mx-auto h-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
        <div className="flex items-center justify-center px-2">
          <PatternsDiv />
        </div>
        <aside className="flex flex-col justify-center items-center gap-4 md:gap-6 w-full px-2" aria-labelledby="game-info">
          <InfoCard className="w-full" />
          <PlayButton className="w-full" />
        </aside>
      </div>
    </section>
  );
};
