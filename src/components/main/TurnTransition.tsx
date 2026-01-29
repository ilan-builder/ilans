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
    <div className="h-screen flex flex-col p-4 safe-area-top safe-area-bottom">
      {/* Scores */}
      <div className="glass p-4 mb-4">
        <ScoreBoard
          teams={game.teams}
          currentTeamIndex={game.currentTeamIndex}
          targetScore={game.targetScore}
        />
      </div>

      {/* Next team */}
      <div className="glass flex-1 flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg mb-2">עכשיו תור של</p>
        <div className="text-4xl font-bold text-purple-600 mb-4">
          {currentTeam.name}
        </div>
        <div className="text-5xl animate-bounce-soft mb-4">🎤</div>
        <p className="text-gray-500 text-sm text-center px-4">
          העבירו את המכשיר למסביר של הקבוצה
        </p>
      </div>

      {/* Ready button */}
      <div className="mt-4">
        <button
          onClick={handleReady}
          className="w-full py-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
        >
          🚀 מוכנים? יאללה!
        </button>
      </div>
    </div>
  );
}
