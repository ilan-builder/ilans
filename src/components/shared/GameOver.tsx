import { Team } from "../../types/game";
import { Icon, Trophy, RotateCcw, MedalIcon } from "./Icon";

interface GameOverProps {
  teams: Team[];
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export function GameOver({ teams, onPlayAgain, onNewGame }: GameOverProps) {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  return (
    <div className="mobile-screen flex flex-col items-center justify-center p-6 pt-safe-button bg-amber-50">
      <div className="doodle-card p-6 max-w-sm w-full text-center bg-white">
        <div className="text-6xl mb-4 flex justify-center">
          <Icon icon={Trophy} size="2xl" className="text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">המשחק נגמר!</h1>
        <h2 className="text-2xl font-bold text-indigo-600 mb-1">{winner.name}</h2>
        <p className="text-gray-600 mb-6">ניצחו עם {winner.score} נקודות!</p>

        <div className="space-y-2 mb-6">
          {sortedTeams.map((team, index) => (
            <div
              key={team.id}
              className={`flex items-center justify-between p-3 rounded-xl border-3 ${
                index === 0
                  ? "bg-amber-50 border-amber-400"
                  : index === 1
                  ? "bg-gray-50 border-gray-300"
                  : index === 2
                  ? "bg-orange-50 border-orange-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {index === 0 ? (
                    <MedalIcon position={1} size="md" />
                  ) : index === 1 ? (
                    <MedalIcon position={2} size="md" />
                  ) : index === 2 ? (
                    <MedalIcon position={3} size="md" />
                  ) : (
                    `${index + 1}.`
                  )}
                </span>
                <span className="font-bold text-gray-800">{team.name}</span>
              </div>
              <span className="font-bold text-lg text-gray-800">{team.score}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <button
            onClick={onPlayAgain}
            className="w-full doodle-btn bg-indigo-500 text-white py-4 text-lg flex items-center justify-center gap-2"
          >
            <Icon icon={RotateCcw} size="sm" /> משחק נוסף
          </button>
          <button
            onClick={onNewGame}
            className="w-full doodle-btn bg-gray-200 text-gray-700 py-3"
          >
            משחק חדש
          </button>
        </div>
      </div>
    </div>
  );
}
