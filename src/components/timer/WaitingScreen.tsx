import { Game } from "../../types/game";
import { ScoreBoard } from "../shared/ScoreBoard";

interface WaitingScreenProps {
  game: Game;
}

export function WaitingScreen({ game }: WaitingScreenProps) {
  const isSetup = game.status === "setup" || game.status === "waiting";
  const currentTeam = game.teams[game.currentTeamIndex];

  if (isSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6 text-white">
        <div className="text-center">
          <div className="text-6xl mb-6">⏳</div>
          <h2 className="text-2xl font-bold mb-2">מחובר לחדר</h2>
          <p className="text-gray-400 text-lg mb-8">
            ממתין להתחלת המשחק...
          </p>
          <div className="text-4xl font-mono font-bold text-blue-400">
            {game.roomCode}
          </div>
        </div>
      </div>
    );
  }

  // Transition screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col text-white">
      {/* Scores */}
      <div className="p-6">
        <ScoreBoard
          teams={game.teams}
          currentTeamIndex={game.currentTeamIndex}
          targetScore={game.targetScore}
        />
      </div>

      {/* Next team info */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <p className="text-gray-400 text-xl mb-2">עכשיו תור של</p>
        <div className="text-6xl font-bold text-blue-400 mb-8">
          {currentTeam?.name || "..."}
        </div>
        <div className="text-4xl animate-pulse">🎯</div>
        <p className="text-gray-500 text-lg mt-4">
          ממתין להתחלת הסיבוב...
        </p>
      </div>
    </div>
  );
}
