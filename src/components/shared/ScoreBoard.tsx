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
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              index === currentTeamIndex
                ? "bg-purple-500 text-white shadow-md"
                : "bg-white/80 text-gray-700"
            }`}
          >
            {team.name}: <span className="font-bold">{team.score}</span>
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
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              index === currentTeamIndex
                ? "bg-purple-100 ring-2 ring-purple-400"
                : "bg-gray-50"
            }`}
          >
            <span className={`font-medium ${index === currentTeamIndex ? "text-purple-700" : "text-gray-700"}`}>
              {team.name}
            </span>
            <div className="flex items-center gap-3">
              <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
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
