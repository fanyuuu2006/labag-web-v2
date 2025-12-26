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
    <section className="h-full" >
      <div className="container h-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-center px-2">
          <PatternsDiv />
        </div>
        <aside className="flex flex-col justify-center items-center gap-4 md:gap-6">
          <InfoCard className="w-full" />
          <PlayButton className="w-full" />
        </aside>
      </div>
    </section>
  );
};
