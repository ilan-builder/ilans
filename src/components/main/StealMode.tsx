import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Game } from "../../types/game";

interface StealModeProps {
  game: Game;
}

export function StealMode({ game }: StealModeProps) {
  const awardSteal = useMutation(api.games.awardSteal);
  const skipSteal = useMutation(api.games.skipSteal);

  const currentTeam = game.teams[game.currentTeamIndex];
  const otherTeams = game.teams.filter((_, i) => i !== game.currentTeamIndex);

  const handleSteal = async (teamId: string) => {
    await awardSteal({ gameId: game._id, teamId });
  };

  const handleNoSteal = async () => {
    await skipSteal({ gameId: game._id });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-gray-900 flex flex-col text-white">
      {/* Header */}
      <div className="p-6 text-center">
        <div className="text-3xl font-bold text-red-400 animate-flash mb-2">
          גניבה!
        </div>
        <p className="text-gray-300">
          הזמן של {currentTeam.name} נגמר
        </p>
      </div>

      {/* The word that wasn't guessed */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <p className="text-gray-400 text-sm mb-4">המילה הייתה</p>
        <div className="text-6xl font-bold mb-8 text-yellow-400">
          {game.currentWord || "---"}
        </div>
        <p className="text-gray-400 text-center mb-6">
          מי ניחש נכון?
        </p>

        {/* Team selection buttons */}
        <div className="w-full max-w-sm space-y-3">
          {otherTeams.map((team) => (
            <button
              key={team.id}
              onClick={() => handleSteal(team.id)}
              className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-xl transition-colors shadow-lg"
            >
              {team.name} גנב! (+1)
            </button>
          ))}
        </div>
      </div>

      {/* No steal button */}
      <div className="p-6">
        <button
          onClick={handleNoSteal}
          className="w-full py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium text-lg transition-colors"
        >
          אף אחד לא ניחש
        </button>
      </div>
    </div>
  );
}
