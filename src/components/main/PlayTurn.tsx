import { useMutation } from "convex/react";
import { useEffect, useState, useCallback } from "react";
import { api } from "../../../convex/_generated/api";
import { Game } from "../../types/game";
import { getRandomWord } from "../../data/hebrewWords";
import { ScoreBoard } from "../shared/ScoreBoard";

interface PlayTurnProps {
  game: Game;
}

export function PlayTurn({ game }: PlayTurnProps) {
  const markCorrect = useMutation(api.games.markCorrect);
  const markSkip = useMutation(api.games.markSkip);
  const endTurn = useMutation(api.games.endTurn);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentTeam = game.teams[game.currentTeamIndex];

  useEffect(() => {
    if (!game.timerEndTime) return;

    const updateTime = () => {
      const remaining = Math.max(0, Math.ceil((game.timerEndTime! - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        endTurn({ gameId: game._id });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, [game.timerEndTime, game._id, endTurn]);

  const getNextWord = useCallback(() => {
    return getRandomWord(game.difficulty, game.wordsUsed);
  }, [game.difficulty, game.wordsUsed]);

  const handleCorrect = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await markCorrect({
        gameId: game._id,
        newWord: getNextWord(),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await markSkip({
        gameId: game._id,
        newWord: getNextWord(),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndTurn = async () => {
    await endTurn({ gameId: game._id });
  };

  const isLowTime = timeLeft !== null && timeLeft <= 10;

  return (
    <div className="mobile-screen flex flex-col p-4 pt-16 bg-white">
      {/* Header */}
      <div className="doodle-card p-3 mb-3 flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-xs">תור של</p>
          <p className="font-bold text-indigo-600">{currentTeam.name}</p>
        </div>
        <div className={`text-3xl font-mono font-bold ${
          isLowTime ? "text-red-500 animate-wiggle" : "text-gray-800"
        }`}>
          {timeLeft ?? "--"}
        </div>
      </div>

      {/* Score board */}
      <div className="mb-3">
        <ScoreBoard
          teams={game.teams}
          currentTeamIndex={game.currentTeamIndex}
          targetScore={game.targetScore}
          compact
        />
      </div>

      {/* Word display */}
      <div className="doodle-card flex-1 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-gray-500 text-sm mb-3">המילה היא</p>
          <div className="text-5xl font-bold text-gray-800 leading-tight">
            {game.currentWord || "..."}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-3 space-y-2">
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            disabled={isProcessing}
            className="flex-1 doodle-btn bg-red-500 text-white py-5 text-xl"
          >
            ✕ דילוג
          </button>
          <button
            onClick={handleCorrect}
            disabled={isProcessing}
            className="flex-1 doodle-btn bg-green-500 text-white py-5 text-xl"
          >
            ✓ נכון!
          </button>
        </div>
        <button
          onClick={handleEndTurn}
          className="w-full py-2 text-gray-500 text-sm hover:text-gray-700"
        >
          סיים תור מוקדם
        </button>
      </div>
    </div>
  );
}
