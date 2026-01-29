import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Game } from "../../types/game";
import { getRandomWord } from "../../data/hebrewWords";
import { ScoreBoard } from "../shared/ScoreBoard";

interface TurnTransitionProps {
  game: Game;
}

export function TurnTransition({ game }: TurnTransitionProps) {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col text-white">
      {/* Scores */}
      <div className="p-6">
        <ScoreBoard
          teams={game.teams}
          currentTeamIndex={game.currentTeamIndex}
          targetScore={game.targetScore}
        />
      </div>

      {/* Next team */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <p className="text-gray-400 text-lg mb-2">עכשיו תור של</p>
        <div className="text-5xl font-bold text-blue-400 mb-8">
          {currentTeam.name}
        </div>
        <p className="text-gray-500 text-center mb-8">
          העבירו את המכשיר למסביר של הקבוצה
        </p>
      </div>

      {/* Ready button */}
      <div className="p-6">
        <button
          onClick={handleReady}
          className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl font-bold text-2xl transition-all shadow-lg shadow-blue-500/30"
        >
          מוכנים? התחל!
        </button>
      </div>
    </div>
  );
}
