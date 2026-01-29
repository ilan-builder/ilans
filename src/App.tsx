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

function App() {
  const [deviceRole, setDeviceRole] = useState<DeviceRole>(null);
  const [gameId, setGameId] = useState<Id<"games"> | null>(null);
  const [roomCode, setRoomCode] = useState<string>("");

  const game = useGameSync(gameId);
  const resetGame = useMutation(api.games.resetGame);

  // Persist device role and game info
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6 text-white">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            אילנס
          </h1>
          <p className="text-gray-400 text-lg">משחק מילים בעברית</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => setDeviceRole("main")}
            className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl transition-all shadow-lg"
          >
            <div className="text-2xl font-bold mb-1">מכשיר מסביר</div>
            <div className="text-blue-200 text-sm">מציג מילים, שולט במשחק</div>
          </button>

          <button
            onClick={() => setDeviceRole("timer")}
            className="w-full py-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-2xl transition-all shadow-lg"
          >
            <div className="text-2xl font-bold mb-1">מכשיר טיימר</div>
            <div className="text-purple-200 text-sm">מציג זמן וניקוד לכולם</div>
          </button>
        </div>

        <p className="mt-12 text-gray-500 text-sm text-center max-w-xs">
          בחרו תפקיד למכשיר זה. מכשיר אחד משמש להסברה ומכשיר שני מציג את הטיימר.
        </p>
      </div>
    );
  }

  // Main device flow
  if (deviceRole === "main") {
    // No game yet - create one
    if (!gameId || !game) {
      return (
        <CreateRoom
          onRoomCreated={(id, code) => saveSession("main", id, code)}
        />
      );
    }

    // Game finished
    if (game.status === "finished") {
      return (
        <GameOver
          teams={game.teams}
          onPlayAgain={handlePlayAgain}
          onNewGame={clearSession}
        />
      );
    }

    // Setup phase
    if (game.status === "waiting" || game.status === "setup") {
      return (
        <SetupGame
          gameId={game._id}
          roomCode={roomCode}
          timerDeviceJoined={game.timerDeviceJoined}
          onSetupComplete={() => {}}
        />
      );
    }

    // Playing
    if (game.status === "playing") {
      return <PlayTurn game={game} />;
    }

    // Stealing
    if (game.status === "stealing") {
      return <StealMode game={game} />;
    }

    // Transition
    if (game.status === "transition") {
      return <TurnTransition game={game} />;
    }
  }

  // Timer device flow
  if (deviceRole === "timer") {
    // No game yet - join one
    if (!gameId || !game) {
      return (
        <JoinRoom
          onJoined={(id, code) => saveSession("timer", id, code)}
        />
      );
    }

    // Game finished
    if (game.status === "finished") {
      return (
        <GameOver
          teams={game.teams}
          onPlayAgain={handlePlayAgain}
          onNewGame={clearSession}
        />
      );
    }

    // Waiting/Setup/Transition
    if (game.status === "waiting" || game.status === "setup" || game.status === "transition") {
      return <WaitingScreen game={game} />;
    }

    // Playing
    if (game.status === "playing") {
      return <TimerDisplay game={game} />;
    }

    // Stealing
    if (game.status === "stealing") {
      return <StealAlert game={game} />;
    }
  }

  // Fallback
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="text-center">
        <p className="text-xl mb-4">טוען...</p>
        <button
          onClick={clearSession}
          className="text-blue-400 underline"
        >
          התחל מחדש
        </button>
      </div>
    </div>
  );
}

export default App;
