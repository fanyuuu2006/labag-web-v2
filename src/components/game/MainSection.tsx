"use client";
import { PatternsDiv } from "./PatternsDiv";
import { MusicAudio } from "./MusicAudio";
import { cn } from "@/utils/className";
import { Pattern } from "labag";
import { useCallback, useState } from "react";
import { postSpins } from "@/utils/backend";
import { ACCESS_TOKEN_KEY } from "@/contexts/UserContext";
import { useSetting } from "@/contexts/SettingContext";
import { playAudio } from "@/utils/audio";

export const MainSection = () => {
  const { settings } = useSetting();
  const [spinDisabled, setSpinDisabled] = useState<boolean>(false);
  const [patterns, setPatterns] = useState<(Pattern | null)[]>([
    null,
    null,
    null,
  ]);

  const handleSpin = useCallback(async () => {
    if (spinDisabled) return;

    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      alert("請先登入以進行遊戲");
      return;
    }

    setSpinDisabled(true);
    setPatterns([null, null, null]);

    try {
      const response = await postSpins(token);
      if (!response.data) {
        alert(response.message || "轉動失敗，請稍後再試");
        return;
      }

      response.data.reels.forEach((pattern, index) => {
        setTimeout(
          () => {
            setPatterns((prev) => {
              const newPatterns = [...prev];
              newPatterns[index] = pattern;
              return newPatterns;
            });
            if (settings.sound) {
              playAudio("/audios/ding.mp3", {
                volume: 0.5,
              });
            }
          },
          (index + 1) * 500,
        );
      });
    } catch (error) {
      console.error(error);
      alert("發生錯誤，請稍後再試");
    } finally {
      setTimeout(() => {
        setSpinDisabled(false);
      }, 3500);
    }
  }, [settings.sound, spinDisabled]);

  return (
    <section className="h-full">
      <div className="container h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex items-end lg:items-center justify-center">
          <PatternsDiv patterns={patterns} className="w-full md:max-w-2xl" />
        </div>
        <aside className="flex flex-col justify-start lg:justify-center items-center gap-4 md:gap-6">
          {/* 轉動按鈕 */}
          <button
            disabled={spinDisabled}
            onClick={handleSpin}
            className={cn(
              "w-3/4 btn primary font-bold px-6 py-3 text-2xl md:text-3xl lg:text-4xl rounded-full",
            )}
            aria-live="polite"
          >
            轉動
          </button>
        </aside>
      </div>
      <MusicAudio loop preload="auto" />
    </section>
  );
};
