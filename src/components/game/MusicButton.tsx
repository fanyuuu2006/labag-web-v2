"use client";
import { DistributiveOmit } from "fanyucomponents";
import { cn } from "@/utils/className";
import { useModes } from "@/contexts/ModesContext";
import { useCallback, useRef, useState, useEffect } from "react";

type MusicButtonProps = DistributiveOmit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
>;

export const MusicButton = ({
  className,
  onClick,
  ...rest
}: MusicButtonProps) => {
  const { modes } = useModes();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPlaying((prev) => !prev);
      onClick?.(e);
    },
    [onClick]
  );

  /**
   * 根據目前的模式設定音樂來源
   */
  useEffect(() => {
    const audio = audioRef.current;
    const modeName = modes?.[0]?.name;
    if (!audio) return;
    if (!modeName) {
      // 如果沒有 modeName，確保不要播放並移除來源
      try {
        audio.pause();
      } catch {}
      audio.removeAttribute("src");
      return;
    }

    const src = `/audios/bgm/${modeName}.mp3`;
    // 只有在來源不同時才設定，避免不必要的重載
    if (!audio.src || !audio.src.endsWith(src)) {
      audio.src = src;
    }
  }, [modes]);

  // 控制播放 / 暫停，以及組件卸載時清理
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((error) => console.error("無法播放音樂:", error));
    } else {
      try {
        audio.pause();
      } catch (e) {
        console.error("暫停音樂失敗:", e);
      }
    }

    return () => {
      try {
        audio.pause();
      } catch {}
    };
  }, [isPlaying]);

  // 清理 audio 在卸載時
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (!audio) return;
      try {
        audio.pause();
      } catch {}
      try {
        audio.removeAttribute("src");
      } catch {}
      audioRef.current = null;
    };
  }, []);

  return (
    <>
      <button
        className={cn('', className)}
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
