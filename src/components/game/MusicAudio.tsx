"use client";
import { useSetting } from "@/contexts/SettingContext";
import { useRef, useEffect } from "react";

type MusicAudioProps = React.AudioHTMLAttributes<HTMLAudioElement>;
export const MusicAudio = ({ ...rest }: MusicAudioProps) => {
  const { settings } = useSetting();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const theme = settings.theme;

    if (!theme) {
      audio.pause();
      audio.removeAttribute("src");
      delete audio.dataset.src;
      return;
    }

    const src = `/audios/bgm/${theme}.mp3`;
    if (audio.dataset.src === src) return; // 若相同來源，跳過

    audio.dataset.src = src; // 紀錄目前來源
    audio.src = src;
    // 若當前為播放狀態，嘗試播放（瀏覽器若無使用者互動會拒絕，這裡以 catch 處理）
    if (settings.music) {
      audio.play().catch((err) => console.warn("music play blocked:", err));
    }
  }, [settings.music, settings.theme]);

  // 播放 / 暫停 控制
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (settings.music) {
      audio.play().catch((err) => console.warn("music play blocked:", err));
    } else {
      audio.pause();
    }

    // unmount 時確保暫停
    return () => {
      audio.pause();
    };
  }, [settings.music]);

  return <audio id="background-music" ref={audioRef} {...rest} />;
};
