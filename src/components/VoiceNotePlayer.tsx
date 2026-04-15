import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type VoiceNotePlayerProps = {
  src: string;
  variant?: "visitor" | "admin";
  className?: string;
};

function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function VoiceNotePlayer({
  src,
  variant = "admin",
  className,
}: VoiceNotePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => setDuration(audio.duration || 0);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration || 0);
    };
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    audio.addEventListener("loadedmetadata", handleLoaded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
    };
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const bars = useMemo(() => [7, 12, 17, 11, 20, 15, 9, 18, 24, 16, 13, 22, 14, 10, 19, 12, 8, 15], []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  };

  const visitor = variant === "visitor";

  return (
    <div
      className={cn(
        "flex min-w-[220px] max-w-[280px] items-center gap-3 rounded-full border px-3 py-2",
        visitor
          ? "border-primary-foreground/15 bg-black/20 text-primary-foreground"
          : "border-white/10 bg-black/25 text-foreground",
        className
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        type="button"
        onClick={() => void togglePlayback()}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
          visitor
            ? "bg-white text-primary hover:bg-white/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
        aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-[3px]">
        {bars.map((height, index) => {
          const activeRatio = bars.length === 1 ? 1 : index / (bars.length - 1);
          const isActive = activeRatio <= progress;
          return (
            <span
              key={`${height}-${index}`}
              className={cn(
                "w-[3px] shrink-0 rounded-full transition-colors duration-200",
                visitor
                  ? isActive
                    ? "bg-white"
                    : "bg-white/35"
                  : isActive
                    ? "bg-primary"
                    : "bg-white/25"
              )}
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>

      <span
        className={cn(
          "shrink-0 font-mono text-[11px] tabular-nums",
          visitor ? "text-primary-foreground/80" : "text-muted-foreground"
        )}
      >
        {formatTime(isPlaying ? currentTime : duration || currentTime)}
      </span>
    </div>
  );
}
