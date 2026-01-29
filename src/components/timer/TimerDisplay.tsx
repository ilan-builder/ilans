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
    if (seconds === null) return "--";
    return seconds.toString();
  };

  return (
    <div className={`mobile-screen flex flex-col p-4 pt-16 transition-colors duration-300 ${
      isVeryLowTime ? "bg-red-50" : isLowTime ? "bg-amber-50" : "bg-white"
    }`}>
      {/* Current team */}
      <div className="doodle-card p-3 text-center">
        <p className="text-gray-500 text-sm">תור של</p>
        <p className="text-2xl font-bold text-indigo-600">{currentTeam.name}</p>
      </div>

      {/* Large timer */}
      <div className="flex-1 flex items-center justify-center">
        <div className={`text-[35vw] font-mono font-bold leading-none transition-all ${
          isVeryLowTime ? "text-red-500 animate-wiggle" :
          isLowTime ? "text-amber-500" :
          "text-gray-800"
        }`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Score board */}
      <div className="doodle-card p-4">
        <ScoreBoard
          teams={game.teams}
          currentTeamIndex={game.currentTeamIndex}
          targetScore={game.targetScore}
        />
      </div>
    </div>
  );
}
