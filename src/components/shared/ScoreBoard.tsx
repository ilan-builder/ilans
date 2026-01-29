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
      <div className="flex justify-center gap-2 flex-wrap">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 transition-all ${
              index === currentTeamIndex
                ? "bg-indigo-500 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {team.name}: {team.score}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-gray-500 text-xs text-center mb-2">יעד: {targetScore} נקודות</p>
      <div className="space-y-2">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className={`flex items-center justify-between p-3 rounded-xl border-3 transition-all ${
              index === currentTeamIndex
                ? "bg-indigo-50 border-indigo-400"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <span className={`font-bold ${index === currentTeamIndex ? "text-indigo-700" : "text-gray-700"}`}>
              {team.name}
            </span>
            <div className="flex items-center gap-3">
              <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden border border-gray-300">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (team.score / targetScore) * 100)}%` }}
                />
              </div>
              <span className="font-bold text-lg w-8 text-left text-gray-800">{team.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
