import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Game } from "../../types/game";
import { getRandomWord } from "../../data/hebrewWords";
import { ScoreBoard } from "../shared/ScoreBoard";
import { ScoreEditModal } from "../shared/ScoreEditModal";
import { Icon, Mic, Rocket } from "../shared/Icon";

interface TurnTransitionProps {
  game: Game;
}

export function TurnTransition({ game }: TurnTransitionProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showScoreEdit, setShowScoreEdit] = useState(false);
  const startTurn = useMutation(api.games.startTurn);

  const currentTeam = game.teams[game.currentTeamIndex];

  const handleReady = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const word = getRandomWord(game.difficulty, game.wordsUsed);
    await startTurn({
      gameId: game._id,
      word,
    });
  };

  return (
    <div className="mobile-screen flex flex-col p-4 pt-safe-button bg-white">
      {/* Scores */}
      <div className="doodle-card p-4 mb-4">
        <ScoreBoard
          teams={game.teams}
          currentTeamIndex={game.currentTeamIndex}
          targetScore={game.targetScore}
        />
      </div>

      {/* Next team */}
      <div className="doodle-card flex-1 flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg mb-2">עכשיו תור של</p>
        <div className="text-4xl font-bold text-indigo-600 mb-4">
          {currentTeam.name}
        </div>
        <div className="text-6xl animate-bounce-soft mb-4 flex justify-center">
          <Icon icon={Mic} size="2xl" className="text-indigo-500" />
        </div>
        <p className="text-gray-500 text-sm text-center px-4">
          העבירו את המכשיר למסביר של הקבוצה
        </p>
      </div>

      {/* Bottom buttons */}
      <div className="mt-4 space-y-2">
        <button
          onClick={() => setShowScoreEdit(true)}
          className="w-full doodle-btn bg-gray-100 text-gray-700 py-3 text-base"
        >
          עריכת ניקוד
        </button>
        <button
          onClick={handleReady}
          disabled={isProcessing}
          className="w-full doodle-btn bg-indigo-500 text-white py-5 text-xl flex items-center justify-center gap-2"
        >
          <Icon icon={Rocket} size="md" /> מוכנים? יאללה!
        </button>
      </div>

      {/* Score Edit Modal */}
      {showScoreEdit && (
        <ScoreEditModal
          gameId={game._id}
          teams={game.teams}
          onClose={() => setShowScoreEdit(false)}
        />
      )}
    </div>
  );
}
