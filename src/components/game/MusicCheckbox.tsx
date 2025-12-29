"use client";
import { useModes } from "@/contexts/ModesContext";
import { useSetting } from "@/contexts/SettingContext";
import { cn } from "@/utils/className";
import { CustomerServiceOutlined } from "@ant-design/icons";
import { useCallback, useRef, useEffect } from "react";

type MusicCheckboxProps = Omit<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  "children"
>;

export const MusicCheckbox = ({ className, ...rest }: MusicCheckboxProps) => {
  const { music } = useSetting();
  const { modes } = useModes();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const handleChange = useCallback(() => music.set((v) => !v), [music]);

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
    if (music.value) {
      audio.play().catch((err) => console.warn("music play blocked:", err));
    }
  }, [modes, music.value]);

  // 播放 / 暫停 控制
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (music.value) {
      audio.play().catch((err) => console.warn("music play blocked:", err));
    } else {
      audio.pause();
    }

    // unmount 時確保暫停
    return () => {
      audio.pause();
    };
  }, [music.value]);

  return (
    <>
      <label
        className={`inline-flex items-center gap-3 ${className ?? ""}`}
        {...rest}
      >
        <input
          type="checkbox"
          className="sr-only peer"
          checked={music.value}
          onChange={handleChange}
          aria-label={music.value ? "停止背景音樂" : "播放背景音樂"}
        />

        {/* 可及性友好的滑動開關樣式 */}
        <div
          className={cn(
            "font-bold flex items-center justify-center h-[2em] aspect-square rounded-full border-2 cursor-pointer transition-all duration-200",
            "bg-radial from-gray-600 to-gray-400 text-black border-black/20",
            "peer-checked:from-green-600 peer-checked:to-green-400 peer-checked:border-green-900/50 peer-checked:text-green-900 peer-checked:drop-shadow-[0_0_10px_green]"
          )}
        >
            <CustomerServiceOutlined />
        </div>
      </label>

      <audio id="background-music" loop preload="auto" ref={audioRef} />
    </>
  );
};
