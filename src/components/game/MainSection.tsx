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
    <section  className='h-full'>
      <div className="container h-full grid grid-cols-1 md:grid-cols-2 px-4 gap-4 md:gap-16 items-center justify-center">
        <div className="flex items-center justify-center">
          <PatternsDiv />
        </div>
        <div className="flex flex-col justify-center items-center gap-6 md:gap-8 w-full">
          <InfoCard className="w-full" />
          <PlayButton className="w-full" />
        </div>
      </div>
    </section>
  );
};
