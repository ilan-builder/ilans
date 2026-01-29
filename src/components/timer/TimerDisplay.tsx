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

  // Calculate time left
  useEffect(() => {
    if (!game.timerEndTime) {
      setTimeLeft(null);
      return;
    }

    const updateTime = () => {
      const remaining = Math.max(0, Math.ceil((game.timerEndTime! - Date.now()) / 1000));
      setTimeLeft(remaining);

      // Play warning sound at 5 seconds
      if (remaining <= 5 && remaining > 0 && remaining !== lastWarningTime.current) {
        lastWarningTime.current = remaining;
        // Simple beep using Web Audio API
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

  // Format time as MM:SS
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`min-h-screen flex flex-col text-white transition-colors duration-300 ${
      isVeryLowTime ? "bg-red-900" : isLowTime ? "bg-orange-900" : "bg-gradient-to-b from-gray-900 to-gray-800"
    }`}>
      {/* Current team */}
      <div className="p-6 text-center">
        <p className="text-gray-400 text-lg">תור של</p>
        <p className="text-3xl font-bold text-blue-400">{currentTeam.name}</p>
      </div>

      {/* Large timer */}
      <div className="flex-1 flex items-center justify-center">
        <div className={`text-[12rem] font-mono font-bold leading-none transition-all ${
          isVeryLowTime ? "text-red-400 animate-pulse-fast scale-110" :
          isLowTime ? "text-orange-400 animate-pulse" :
          "text-white"
        }`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Score board */}
      <div className="p-6">
        <ScoreBoard
          teams={game.teams}
          currentTeamIndex={game.currentTeamIndex}
          targetScore={game.targetScore}
        />
      </div>
    </div>
  );
}
