"use client";
import { useModes } from "@/contexts/ModesContext";
import { cn } from "@/utils/className";
import { useCallback, useRef, useState, useEffect } from "react";

type MusicCheckboxProps = Omit<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  "children"
>;

export const MusicCheckbox = ({ className, ...rest }: MusicCheckboxProps) => {
  const { modes } = useModes();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const handleChange = useCallback(() => setIsPlaying((v) => !v), []);

  // 更新音檔來源（只在 mode 變更時更新），並在 isPlaying 時嘗試播放
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const modeName = modes?.[0]?.name;
    if (!modeName) {
      audio.pause();
      audio.removeAttribute("src");
      delete audio.dataset.src;
      return;
    }

    const src = `/audios/bgm/${modeName}.mp3`;
    if (audio.dataset.src === src) return; // 若相同來源，跳過

    audio.dataset.src = src; // 紀錄目前來源
    audio.src = src;
    // 若當前為播放狀態，嘗試播放（瀏覽器若無使用者互動會拒絕，這裡以 catch 處理）
    if (isPlaying) {
      audio.play().catch((err) => console.warn("music play blocked:", err));
    }
  }, [modes, isPlaying]);

  // 播放 / 暫停 控制
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => console.warn("music play blocked:", err));
    } else {
      audio.pause();
    }

    // unmount 時確保暫停
    return () => {
      audio.pause();
    };
  }, [isPlaying]);

  return (
    <>
      <label
        className={`inline-flex items-center gap-3 ${className ?? ""}`}
        {...rest}
      >
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isPlaying}
          onChange={handleChange}
          aria-label={isPlaying ? "停止背景音樂" : "播放背景音樂"}
        />

        {/* 可及性友好的滑動開關樣式 */}
        <div
          className={cn(
            "font-bold flex items-center justify-center h-[2em] aspect-square rounded-full border-2 cursor-pointer transition-all duration-200",
            "bg-gray-500 text-black border-black/20",
            "peer-checked:bg-green-500 peer-checked:border-green-950/20 peer-checked:text-green-950 peer-checked:drop-shadow-[0_0_5px_green]"
          )}
        >
          <span>{isPlaying ? "關" : "開"}</span>
        </div>
      </label>

      <audio id="background-music" loop preload="auto" ref={audioRef} />
    </>
  );
};
