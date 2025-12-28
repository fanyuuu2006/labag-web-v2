"use client";
import { DistributiveOmit } from "fanyucomponents";
import { cn } from "@/utils/className";
import { useModes } from "@/contexts/ModesContext";
import { useCallback, useRef, useState, useEffect } from "react";

type MusicButtonProps = DistributiveOmit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
>;

export const MusicButton = ({ className, ...rest }: MusicButtonProps) => {
  const { modes } = useModes();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleClick = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // 根據 isPlaying 狀態播放或暫停音樂
    if (isPlaying) {
      audio.src = `/audios/bgm/${modes[0].name}.mp3`;
      audio.play().catch((error) => console.error("無法播放音樂:", error));
    } else {
      audio.pause();
    }
  }, [isPlaying, modes]);

  return (
    <>
      <button
        className={cn(className)}
        onClick={handleClick}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "停止背景音樂" : "播放背景音樂"}
        {...rest}
      >
        {isPlaying ? "停止音樂" : "播放音樂"}
      </button>
      <audio id="background-music" loop preload="auto" ref={audioRef} />
    </>
  );
};
