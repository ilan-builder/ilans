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
    <div className="h-screen flex flex-col p-4 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="glass p-3 mb-3 flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-xs">תור של</p>
          <p className="font-bold text-purple-600">{currentTeam.name}</p>
        </div>
        <div className={`text-3xl font-mono font-bold ${
          isLowTime ? "text-red-500 animate-pulse" : "text-gray-800"
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
      <div className="glass flex-1 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-gray-500 text-sm mb-2">המילה היא</p>
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
            className="flex-1 py-5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl font-bold text-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
          >
            ✕ דילוג
          </button>
          <button
            onClick={handleCorrect}
            disabled={isProcessing}
            className="flex-1 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
          >
            ✓ נכון!
          </button>
        </div>
        <button
          onClick={handleEndTurn}
          className="w-full py-2 text-gray-500 text-sm"
        >
          סיים תור מוקדם
        </button>
      </div>
    </div>
  );
}
