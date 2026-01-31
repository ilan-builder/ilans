import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Team } from "../../types/game";
import { Id } from "../../../convex/_generated/dataModel";
import { Icon, X } from "./Icon";

interface ScoreEditModalProps {
  gameId: Id<"games">;
  teams: Team[];
  onClose: () => void;
}

export function ScoreEditModal({ gameId, teams, onClose }: ScoreEditModalProps) {
  const updateTeamScore = useMutation(api.games.updateTeamScore);

  const handleScoreChange = async (teamId: string, delta: number) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;

    const newScore = Math.max(0, team.score + delta);
    await updateTeamScore({ gameId, teamId, newScore });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm border-3 border-gray-800 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">עריכת ניקוד</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 font-bold text-xl"
          >
            <Icon icon={X} size="md" />
          </button>
        </div>

        {/* Team scores */}
        <div className="p-4 space-y-3">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border-2 border-gray-200"
            >
              <span className="font-bold text-gray-700">{team.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleScoreChange(team.id, -1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 font-bold text-xl transition-colors border-2 border-red-300"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-xl text-gray-800">
                  {team.score}
                </span>
                <button
                  onClick={() => handleScoreChange(team.id, 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 text-green-600 font-bold text-xl transition-colors border-2 border-green-300"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
