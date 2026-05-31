import { useEffect, useState } from "react";

export function useFullScreen() {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    handleFullscreen();

    document.addEventListener("fullscreenchange", handleFullscreen);

    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  const toggleFullScreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {}
  };

  return { isFullscreen, toggleFullScreen };
}
