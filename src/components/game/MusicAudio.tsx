import { useModes } from "@/contexts/ModesContext";
import { useSetting } from "@/contexts/SettingContext";
import { useRef, useEffect } from "react";

type MusicAudioProps = React.AudioHTMLAttributes<HTMLAudioElement>;
export const MusicAudio = ({
  ...rest
}: MusicAudioProps) => {
  const { music } = useSetting();
  const { modes } = useModes();
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    <audio
      id="background-music"
      ref={audioRef}
      {...rest}
    />
  );
};
