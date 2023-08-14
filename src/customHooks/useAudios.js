import { useMemo, useEffect, useState } from "react";

const useAudio = (url, defaultVolum = 1, isLoop = false) => {
  const audio = useMemo(() => new Audio(url), []);
  audio.volume = defaultVolum;
  audio.loop = isLoop;
  const [playing, setPlaying] = useState(false);

  const togglePlay = (status = true) => {
    setPlaying(false);
    setPlaying(status);
  };

  useEffect(() => {
    playing ? audio.play() : audio.pause();
    return () => audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return { togglePlay, audioStatus: playing };
};

export default useAudio;
