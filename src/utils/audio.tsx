export const playAudio = async (
  src: string,
  option?: {
    volume?: number; // 0-1 or 0-100
  }
): Promise<HTMLAudioElement> => {
  const audio = new Audio(src);
  audio.preload = "auto";

  if (option?.volume !== undefined) {
    let v = Number(option.volume) || 0;
    if (v > 1) v = v / 100;
    v = Math.max(0, Math.min(1, v));
    audio.volume = v;
    audio.muted = v === 0;
  }


  try {
    await audio.play();
  } catch (err) {
    console.warn('playAudio: play() failed', err);
  }

  return audio;
};
