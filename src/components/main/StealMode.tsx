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
    <div className="h-screen flex flex-col p-4 safe-area-top safe-area-bottom bg-gradient-to-b from-amber-400 to-orange-500">
      {/* Header */}
      <div className="text-center py-4">
        <div className="text-4xl font-bold text-white animate-flash mb-1">
          ⚡ גניבה!
        </div>
        <p className="text-white/90">
          הזמן של {currentTeam.name} נגמר
        </p>
      </div>

      {/* The word */}
      <div className="glass flex-1 flex flex-col items-center justify-center mx-2">
        <p className="text-gray-500 text-sm mb-2">המילה הייתה</p>
        <div className="text-5xl font-bold text-purple-600 mb-6">
          {game.currentWord || "---"}
        </div>
        <p className="text-gray-600 text-center mb-4">
          מי ניחש נכון?
        </p>

        {/* Team buttons */}
        <div className="w-full max-w-xs space-y-2">
          {otherTeams.map((team) => (
            <button
              key={team.id}
              onClick={() => handleSteal(team.id)}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all"
            >
              🎉 {team.name} גנב!
            </button>
          ))}
        </div>
      </div>

      {/* No steal button */}
      <div className="mt-4">
        <button
          onClick={handleNoSteal}
          className="w-full py-4 glass text-gray-700 rounded-xl font-medium"
        >
          אף אחד לא ניחש 😅
        </button>
      </div>
    </div>
  );
}
