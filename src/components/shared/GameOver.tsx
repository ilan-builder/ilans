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
    <div className="h-screen flex flex-col items-center justify-center p-6 safe-area-top safe-area-bottom bg-gradient-to-b from-amber-400 to-yellow-500">
      <div className="glass p-6 max-w-sm w-full text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">המשחק נגמר!</h1>
        <h2 className="text-2xl font-bold text-purple-600 mb-1">{winner.name}</h2>
        <p className="text-gray-600 mb-6">ניצחו עם {winner.score} נקודות!</p>

        <div className="space-y-2 mb-6">
          {sortedTeams.map((team, index) => (
            <div
              key={team.id}
              className={`flex items-center justify-between p-3 rounded-xl ${
                index === 0
                  ? "bg-amber-100 border-2 border-amber-400"
                  : index === 1
                  ? "bg-gray-100 border-2 border-gray-300"
                  : index === 2
                  ? "bg-orange-50 border-2 border-orange-300"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                </span>
                <span className="font-medium text-gray-800">{team.name}</span>
              </div>
              <span className="font-bold text-lg text-gray-800">{team.score}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <button
            onClick={onPlayAgain}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all"
          >
            🔄 משחק נוסף
          </button>
          <button
            onClick={onNewGame}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            משחק חדש
          </button>
        </div>
      </div>
    </div>
  );
}
