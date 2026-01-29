import { Team } from "../../types/game";

interface ScoreBoardProps {
  teams: Team[];
  currentTeamIndex: number;
  targetScore: number;
  compact?: boolean;
}

export function ScoreBoard({ teams, currentTeamIndex, targetScore, compact = false }: ScoreBoardProps) {
  if (compact) {
    return (
      <div className="flex justify-center gap-4 text-sm">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className={`px-3 py-1 rounded-full ${
              index === currentTeamIndex
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            <span className="font-medium">{team.name}</span>
            <span className="mr-2 font-bold">{team.score}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-300 mb-3 text-center">
        ניקוד (יעד: {targetScore})
      </h3>
      <div className="space-y-2">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              index === currentTeamIndex
                ? "bg-blue-600 ring-2 ring-blue-400"
                : "bg-gray-700"
            }`}
          >
            <span className="font-medium text-lg">{team.name}</span>
            <div className="flex items-center gap-3">
              <div className="w-32 bg-gray-600 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (team.score / targetScore) * 100)}%` }}
                />
              </div>
              <span className="font-bold text-xl w-12 text-left">{team.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
