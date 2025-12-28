"use client";
import { useModes } from "@/contexts/ModesContext";
import { useCallback, useRef, useState, useEffect } from "react";

type MusicCheckboxProps = Omit<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  "children"
>;

export const MusicCheckbox = ({ className, ...rest }: MusicCheckboxProps) => {
  const { modes } = useModes();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // 切換播放狀態
  const handleChange = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // 當 mode 改變時，設定音檔來源；使用 dataset 作為來源紀錄，避免與絕對 URL 比對錯誤
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const modeName = modes?.[0]?.name;

    // 若無 mode，清除來源並暫停播放
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

  // 當 isPlaying 改變時，執行播放或暫停
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
      <label className={className} {...rest}>
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isPlaying}
          onChange={handleChange}
          aria-label={isPlaying ? "停止背景音樂" : "播放背景音樂"}
        />
        {/* 可替換為圖示或文字，這裡保留簡單的占位 */}
        <div className="bg-gray-500 rounded-full w-8 h-8 flex items-center justify-center">
          音
        </div>
      </label>
      <audio id="background-music" loop preload="auto" ref={audioRef} />
    </>
  );
};
