import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Game } from "../../types/game";
import { getRandomWord } from "../../data/hebrewWords";
import { ScoreBoard } from "../shared/ScoreBoard";

interface TurnTransitionProps {
  game: Game;
  onStopGame: () => void;
}

export function TurnTransition({ game, onStopGame }: TurnTransitionProps) {
  const startTurn = useMutation(api.games.startTurn);

  const currentTeam = game.teams[game.currentTeamIndex];

  const handleReady = async () => {
    const word = getRandomWord(game.difficulty, game.wordsUsed);
    await startTurn({
      gameId: game._id,
      word,
    });
  };

  return (
    <div className="h-screen flex flex-col p-4 bg-white safe-area-top safe-area-bottom">
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
        <div className="text-6xl animate-bounce-soft mb-4">🎤</div>
        <p className="text-gray-500 text-sm text-center px-4">
          העבירו את המכשיר למסביר של הקבוצה
        </p>
      </div>

      {/* Bottom buttons */}
      <div className="mt-4 space-y-2">
        <button
          onClick={handleReady}
          className="w-full doodle-btn bg-indigo-500 text-white py-5 text-xl"
        >
          🚀 מוכנים? יאללה!
        </button>
        <button
          onClick={onStopGame}
          className="w-full py-2 text-red-500 text-sm hover:text-red-700"
        >
          ✕ עצור משחק
        </button>
      </div>
    </div>
  );
}
