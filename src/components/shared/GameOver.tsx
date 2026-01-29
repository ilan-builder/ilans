import { Team } from "../../types/game";

interface GameOverProps {
  teams: Team[];
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export function GameOver({ teams, onPlayAgain, onNewGame }: GameOverProps) {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">המשחק נגמר!</h1>
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-bold text-yellow-400">{winner.name}</h2>
        <p className="text-xl text-gray-300 mt-2">ניצחו עם {winner.score} נקודות!</p>
      </div>

      <div className="w-full max-w-sm mb-8">
        <h3 className="text-lg font-semibold text-gray-400 mb-3 text-center">תוצאות סופיות</h3>
        <div className="space-y-2">
          {sortedTeams.map((team, index) => (
            <div
              key={team.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                index === 0
                  ? "bg-yellow-600/30 border border-yellow-500"
                  : index === 1
                  ? "bg-gray-500/30 border border-gray-400"
                  : index === 2
                  ? "bg-orange-700/30 border border-orange-600"
                  : "bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                </span>
                <span className="font-medium text-lg">{team.name}</span>
              </div>
              <span className="font-bold text-xl">{team.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={onPlayAgain}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-xl transition-colors"
        >
          משחק נוסף
        </button>
        <button
          onClick={onNewGame}
          className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
        >
          משחק חדש
        </button>
      </div>
    </div>
  );
}
