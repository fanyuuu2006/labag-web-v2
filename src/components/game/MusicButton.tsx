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
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    } else {
      setIsPlaying(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const src = `/audios/bgm/${modes?.[0]?.name ?? "normal"}.mp3`;
    if (audio.src && audio.src.endsWith(src)) return;
    audio.src = src;
    audio.load();
    if (isPlaying) {
      const p = audio.play();
      if (p instanceof Promise) {
        p.catch(() => setIsPlaying(false));
      }
    }
  }, [modes, isPlaying]);

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
