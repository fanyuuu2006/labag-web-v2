"use client";
import { game } from "@/libs/game";
import { useEffect } from "react";
import { PlayButton } from "./PlayButton";
import { useRouter } from "next/navigation";

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
    <section className={"h-full"}>
      <div className="container h-full flex flex-col items-center justify-center">
        <PlayButton />
      </div>
    </section>
  );
};