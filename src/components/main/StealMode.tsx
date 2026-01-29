import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Game } from "../../types/game";

interface StealModeProps {
  game: Game;
}

export function StealMode({ game }: StealModeProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const awardSteal = useMutation(api.games.awardSteal);
  const skipSteal = useMutation(api.games.skipSteal);

  const currentTeam = game.teams[game.currentTeamIndex];
  const otherTeams = game.teams.filter((_, i) => i !== game.currentTeamIndex);

  const handleSteal = async (teamId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    await awardSteal({ gameId: game._id, teamId });
  };

  const handleNoSteal = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    await skipSteal({ gameId: game._id });
  };

  return (
    <div className="mobile-screen flex flex-col p-4 pt-16 bg-amber-50">
      {/* Header */}
      <div className="text-center py-4">
        <div className="text-4xl font-bold text-amber-600 animate-wiggle mb-1">
          ⚡ גניבה!
        </div>
        <p className="text-amber-700">
          הזמן של {currentTeam.name} נגמר
        </p>
      </div>

      {/* The word */}
      <div className="doodle-card flex-1 flex flex-col items-center justify-center mx-2 bg-white">
        <p className="text-gray-500 text-sm mb-2">המילה הייתה</p>
        <div className="text-5xl font-bold text-indigo-600 mb-6">
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
              disabled={isProcessing}
              className="w-full doodle-btn bg-green-500 text-white py-4 text-lg"
            >
              🎉 {team.name} גנב!
            </button>
          ))}
        </div>
      </div>

      {/* Bottom button */}
      <div className="mt-4">
        <button
          onClick={handleNoSteal}
          disabled={isProcessing}
          className="w-full doodle-btn bg-gray-200 text-gray-700 py-4"
        >
          אף אחד לא ניחש 😅
        </button>
      </div>
    </div>
  );
}
