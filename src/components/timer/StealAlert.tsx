import { useEffect, useRef } from "react";
import { Game } from "../../types/game";
import { ScoreBoard } from "../shared/ScoreBoard";

interface StealAlertProps {
  game: Game;
}

export function StealAlert({ game }: StealAlertProps) {
  const hasPlayedBuzzer = useRef(false);

  const currentTeam = game.teams[game.currentTeamIndex];

  // Play buzzer sound once
  useEffect(() => {
    if (hasPlayedBuzzer.current) return;
    hasPlayedBuzzer.current = true;

    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 200;
      oscillator.type = "square";
      gainNode.gain.value = 0.5;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      // Audio not supported
    }
  }, []);

  return (
    <div className="min-h-screen bg-red-900 flex flex-col text-white">
      {/* STEAL MODE header */}
      <div className="p-4 sm:p-6 text-center">
        <div className="text-4xl sm:text-6xl font-bold text-red-400 animate-flash mb-2">
          נגמר הזמן!
        </div>
        <p className="text-xl sm:text-2xl text-red-200">
          הזמן של {currentTeam.name} נגמר
        </p>
      </div>

      {/* Big steal indicator */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="text-7xl sm:text-9xl mb-4 sm:mb-6">⏰</div>
        <div className="text-3xl sm:text-5xl font-bold text-yellow-400 animate-pulse mb-4">
          גניבה!
        </div>
        <p className="text-xl text-gray-300 text-center">
          קבוצות אחרות יכולות לנחש
        </p>
        <p className="text-lg text-gray-400 text-center mt-2">
          ממתין להחלטת המסביר...
        </p>
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
