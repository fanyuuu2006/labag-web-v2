export const playAudio = async(
  src: string,
  option?: {
    volume?: number; // 0-1
  }
) => {
  const audio = new Audio(src);
  if (option?.volume !== undefined) {
    audio.volume = Math.max(0, Math.min(1, option.volume));
  }
   await audio.play();
};
