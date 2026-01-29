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

  // Calculate time left
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col text-white">
      {/* Header with team and timer */}
      <div className="p-4 flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">תור של</p>
          <p className="text-xl font-bold text-blue-400">{currentTeam.name}</p>
        </div>
        <div className={`text-4xl font-mono font-bold ${
          isLowTime ? "text-red-500 animate-pulse-fast" : "text-white"
        }`}>
          {timeLeft ?? "--"}
        </div>
      </div>

      {/* Score board (compact) */}
      <div className="px-4 mb-4">
        <ScoreBoard
          teams={game.teams}
          currentTeamIndex={game.currentTeamIndex}
          targetScore={game.targetScore}
          compact
        />
      </div>

      {/* Main word display */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">המילה היא</p>
          <div className="text-6xl font-bold mb-2 leading-tight">
            {game.currentWord || "..."}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-6 space-y-3">
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            disabled={isProcessing}
            className="flex-1 py-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-2xl font-bold text-2xl transition-colors shadow-lg"
          >
            דילוג ✕
          </button>
          <button
            onClick={handleCorrect}
            disabled={isProcessing}
            className="flex-1 py-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-2xl font-bold text-2xl transition-colors shadow-lg"
          >
            נכון ✓
          </button>
        </div>
        <button
          onClick={handleEndTurn}
          className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
        >
          סיים תור
        </button>
      </div>
    </div>
  );
}
