import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { DeviceRole } from "./types/game";
import { useGameSync } from "./hooks/useGameSync";

// Main device components
import { CreateRoom } from "./components/main/CreateRoom";
import { SetupGame } from "./components/main/SetupGame";
import { PlayTurn } from "./components/main/PlayTurn";
import { StealMode } from "./components/main/StealMode";
import { TurnTransition } from "./components/main/TurnTransition";

// Timer device components
import { JoinRoom } from "./components/timer/JoinRoom";
import { TimerDisplay } from "./components/timer/TimerDisplay";
import { StealAlert } from "./components/timer/StealAlert";
import { WaitingScreen } from "./components/timer/WaitingScreen";

// Shared components
import { GameOver } from "./components/shared/GameOver";
import { Instructions } from "./components/shared/Instructions";

function App() {
  const [deviceRole, setDeviceRole] = useState<DeviceRole>(null);
  const [gameId, setGameId] = useState<Id<"games"> | null>(null);
  const [roomCode, setRoomCode] = useState<string>("");
  const [showInstructions, setShowInstructions] = useState(false);

  const game = useGameSync(gameId);
  const resetGame = useMutation(api.games.resetGame);

  useEffect(() => {
    const savedRole = localStorage.getItem("ilans-role") as DeviceRole;
    const savedGameId = localStorage.getItem("ilans-gameId");
    const savedRoomCode = localStorage.getItem("ilans-roomCode");

    if (savedRole && savedGameId && savedRoomCode) {
      setDeviceRole(savedRole);
      setGameId(savedGameId as Id<"games">);
      setRoomCode(savedRoomCode);
    }
  }, []);

  const saveSession = (role: DeviceRole, id: Id<"games">, code: string) => {
    localStorage.setItem("ilans-role", role || "");
    localStorage.setItem("ilans-gameId", id);
    localStorage.setItem("ilans-roomCode", code);
    setDeviceRole(role);
    setGameId(id);
    setRoomCode(code);
  };

  const clearSession = () => {
    localStorage.removeItem("ilans-role");
    localStorage.removeItem("ilans-gameId");
    localStorage.removeItem("ilans-roomCode");
    setDeviceRole(null);
    setGameId(null);
    setRoomCode("");
  };

  const handlePlayAgain = async () => {
    if (gameId) {
      await resetGame({ gameId });
    }
  };

  // Role selection screen
  if (!deviceRole) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 bg-white safe-area-top safe-area-bottom">
        {showInstructions && <Instructions onClose={() => setShowInstructions(false)} />}

        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            אילנס 🎯
          </h1>
          <p className="text-gray-500 text-lg">משחק מילים מטורף!</p>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <button
            onClick={() => setDeviceRole("main")}
            className="w-full doodle-card p-5 text-right"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">🎤</span>
              <div>
                <div className="text-xl font-bold text-gray-800">מכשיר מסביר</div>
                <div className="text-gray-500 text-sm">מציג מילים, שולט במשחק</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setDeviceRole("timer")}
            className="w-full doodle-card p-5 text-right"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">⏱️</span>
              <div>
                <div className="text-xl font-bold text-gray-800">מכשיר טיימר</div>
                <div className="text-gray-500 text-sm">מציג זמן וניקוד לכולם</div>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={() => setShowInstructions(true)}
          className="mt-10 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span className="text-xl">❓</span>
          <span className="underline underline-offset-4">איך משחקים?</span>
        </button>
      </div>
    );
  }

  // Main device flow
  if (deviceRole === "main") {
    if (!gameId || !game) {
      return (
        <>
          {showInstructions && <Instructions onClose={() => setShowInstructions(false)} />}
          <CreateRoom
            onRoomCreated={(id, code) => saveSession("main", id, code)}
            onShowInstructions={() => setShowInstructions(true)}
          />
        </>
      );
    }

    if (game.status === "finished") {
      return (
        <GameOver
          teams={game.teams}
          onPlayAgain={handlePlayAgain}
          onNewGame={clearSession}
        />
      );
    }

    if (game.status === "waiting" || game.status === "setup") {
      return (
        <>
          {showInstructions && <Instructions onClose={() => setShowInstructions(false)} />}
          <SetupGame
            gameId={game._id}
            roomCode={roomCode}
            timerDeviceJoined={game.timerDeviceJoined}
            onSetupComplete={() => {}}
            onShowInstructions={() => setShowInstructions(true)}
            onStopGame={clearSession}
          />
        </>
      );
    }

    if (game.status === "playing") {
      return <PlayTurn game={game} onStopGame={clearSession} />;
    }

    if (game.status === "stealing") {
      return <StealMode game={game} onStopGame={clearSession} />;
    }

    if (game.status === "transition") {
      return <TurnTransition game={game} onStopGame={clearSession} />;
    }
  }

  // Timer device flow
  if (deviceRole === "timer") {
    if (!gameId || !game) {
      return (
        <>
          {showInstructions && <Instructions onClose={() => setShowInstructions(false)} />}
          <JoinRoom
            onJoined={(id, code) => saveSession("timer", id, code)}
            onShowInstructions={() => setShowInstructions(true)}
          />
        </>
      );
    }

    if (game.status === "finished") {
      return (
        <GameOver
          teams={game.teams}
          onPlayAgain={handlePlayAgain}
          onNewGame={clearSession}
        />
      );
    }

    if (game.status === "waiting" || game.status === "setup" || game.status === "transition") {
      return <WaitingScreen game={game} onStopGame={clearSession} />;
    }

    if (game.status === "playing") {
      return <TimerDisplay game={game} onStopGame={clearSession} />;
    }

    if (game.status === "stealing") {
      return <StealAlert game={game} onStopGame={clearSession} />;
    }
  }

  // Fallback
  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="doodle-card p-8 text-center">
        <p className="text-xl mb-4 text-gray-700">טוען...</p>
        <button
          onClick={clearSession}
          className="text-indigo-600 underline"
        >
          התחל מחדש
        </button>
      </div>
    </div>
  );
}

export default App;
