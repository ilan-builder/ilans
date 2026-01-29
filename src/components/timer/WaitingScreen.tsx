import { Game } from "../../types/game";
import { ScoreBoard } from "../shared/ScoreBoard";

interface WaitingScreenProps {
  game: Game;
  onStopGame: () => void;
}

export function WaitingScreen({ game, onStopGame }: WaitingScreenProps) {
  const isSetup = game.status === "setup" || game.status === "waiting";
  const currentTeam = game.teams[game.currentTeamIndex];

  if (isSetup) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 bg-white safe-area-top safe-area-bottom">
        <div className="doodle-card p-8 text-center max-w-xs">
          <div className="text-6xl mb-4 animate-bounce-soft">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">מחובר!</h2>
          <p className="text-gray-600 mb-6">
            ממתין להתחלת המשחק...
          </p>
          <div className="text-3xl font-mono font-bold gradient-text">
            {game.roomCode}
          </div>
        </div>
        <button
          onClick={onStopGame}
          className="mt-6 py-2 text-red-500 text-sm hover:text-red-700"
        >
          ✕ עצור משחק
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-4 bg-white safe-area-top safe-area-bottom">
      {/* Scores */}
      <div className="doodle-card p-4 mb-4">
        <ScoreBoard
          teams={game.teams}
          currentTeamIndex={game.currentTeamIndex}
          targetScore={game.targetScore}
        />
      </div>

      {/* Next team info */}
      <div className="doodle-card flex-1 flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg mb-2">עכשיו תור של</p>
        <div className="text-4xl font-bold text-indigo-600 mb-4">
          {currentTeam?.name || "..."}
        </div>
        <div className="text-6xl animate-bounce-soft">🎯</div>
        <p className="text-gray-500 mt-4">
          ממתין להתחלת הסיבוב...
        </p>
      </div>

      {/* Stop button */}
      <button
        onClick={onStopGame}
        className="mt-3 py-2 text-red-500 text-sm hover:text-red-700"
      >
        ✕ עצור משחק
      </button>
    </div>
  );
}
