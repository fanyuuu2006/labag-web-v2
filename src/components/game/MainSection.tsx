"use client";
import { game, recorder } from "@/libs/game";
import { useEffect } from "react";
import { PlayButton } from "./PlayButton";
import { useRouter } from "next/navigation";
import { PatternsDiv } from "./PatternsDiv";
import { InfoCard } from "./InfoCard";
import { playAudio } from "@/utils/audio";
import { MusicAudio } from "./MusicAudio";
import { useSetting } from "@/contexts/SettingContext";

export const MainSection = () => {
  const router = useRouter();
  const {sound} = useSetting();
  useEffect(() => {
    let timeoutId: number | null = null;

    const handleGameOver = () => {
      timeoutId = window.setTimeout(() => {
        if (sound.value) {
          playAudio(`/audios/ding.mp3`);
        }
        router.replace("/gameover");
      }, 3500);
    };

    game.addEventListener("gameOver", handleGameOver);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      game.removeEventListener("gameOver", handleGameOver);
    };
  }, [router, sound.value]);

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
      <MusicAudio loop preload='auto' />
      
    </section>
  );
};
