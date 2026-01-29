import { useEffect, useState, useRef } from "react";
import { Game } from "../../types/game";
import { ScoreBoard } from "../shared/ScoreBoard";

interface TimerDisplayProps {
  game: Game;
}

export function TimerDisplay({ game }: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const lastWarningTime = useRef<number | null>(null);

  const currentTeam = game.teams[game.currentTeamIndex];

  useEffect(() => {
    if (!game.timerEndTime) {
      setTimeLeft(null);
      return;
    }

    const updateTime = () => {
      const remaining = Math.max(0, Math.ceil((game.timerEndTime! - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 5 && remaining > 0 && remaining !== lastWarningTime.current) {
        lastWarningTime.current = remaining;
        try {
          const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.frequency.value = remaining === 1 ? 880 : 440;
          oscillator.type = "sine";
          gainNode.gain.value = 0.3;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
        } catch {
          // Audio not supported
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, [game.timerEndTime]);

  const isLowTime = timeLeft !== null && timeLeft <= 10;
  const isVeryLowTime = timeLeft !== null && timeLeft <= 5;

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const bgClass = isVeryLowTime
    ? "bg-gradient-to-b from-red-500 to-rose-600"
    : isLowTime
    ? "bg-gradient-to-b from-amber-400 to-orange-500"
    : "bg-gradient-to-b from-blue-500 to-purple-600";

  return (
    <div className={`h-screen flex flex-col p-4 safe-area-top safe-area-bottom transition-all duration-300 ${bgClass}`}>
      {/* Current team */}
      <div className="glass-dark p-3 text-center">
        <p className="text-white/70 text-sm">תור של</p>
        <p className="text-2xl font-bold text-white">{currentTeam.name}</p>
      </div>

      {/* Large timer */}
      <div className="flex-1 flex items-center justify-center">
        <div className={`text-[18vw] sm:text-[22vw] font-mono font-bold leading-none text-white drop-shadow-lg transition-all ${
          isVeryLowTime ? "animate-pulse scale-105" : ""
        }`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Score board */}
      <div className="glass p-4">
        <ScoreBoard
          teams={game.teams}
          currentTeamIndex={game.currentTeamIndex}
          targetScore={game.targetScore}
        />
      </div>
    </div>
  );
}
