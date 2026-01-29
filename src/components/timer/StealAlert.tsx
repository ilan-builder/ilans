import { useEffect, useRef } from "react";
import { Game } from "../../types/game";
import { ScoreBoard } from "../shared/ScoreBoard";

interface StealAlertProps {
  game: Game;
}

export function StealAlert({ game }: StealAlertProps) {
  const hasPlayedBuzzer = useRef(false);

  const currentTeam = game.teams[game.currentTeamIndex];

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
    <div className="mobile-screen flex flex-col p-4 pt-16 bg-amber-50">
      {/* Header */}
      <div className="text-center py-4">
        <div className="text-5xl font-bold text-amber-600 animate-wiggle">
          ⏰ נגמר הזמן!
        </div>
        <p className="text-xl text-amber-700 mt-2">
          הזמן של {currentTeam.name} נגמר
        </p>
      </div>

      {/* The word */}
      <div className="doodle-card p-4 mx-2 text-center bg-white">
        <p className="text-gray-500 text-sm mb-1">המילה הייתה</p>
        <p className="text-4xl font-bold text-indigo-600">{game.currentWord || "---"}</p>
      </div>

      {/* Steal indicator */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-6xl mb-3 animate-bounce-soft">⚡</div>
        <div className="text-4xl font-bold text-amber-600 mb-3">
          גניבה!
        </div>
        <p className="text-lg text-gray-600 text-center">
          קבוצות אחרות יכולות לנחש
        </p>
        <p className="text-gray-500 text-center mt-2">
          ממתין להחלטת המסביר...
        </p>
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
