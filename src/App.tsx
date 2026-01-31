import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { DeviceRole } from "./types/game";
import { useGameSync } from "./hooks/useGameSync";
import { Icon, Target, Rocket, Gamepad2, Link, ArrowRight, HelpCircle } from "./components/shared/Icon";

// Keep screen awake during game session
function useWakeLock(enabled: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled || !("wakeLock" in navigator)) return;

    const requestWakeLock = async () => {
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      } catch {
        // Wake lock request failed (e.g., low battery mode)
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };

    requestWakeLock();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      wakeLockRef.current?.release();
      wakeLockRef.current = null;
    };
  }, [enabled]);
}

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
import { EndGameButton } from "./components/shared/EndGameButton";

function App() {
  const [deviceRole, setDeviceRole] = useState<DeviceRole>(null);
  const [gameId, setGameId] = useState<Id<"games"> | null>(null);
  const [roomCode, setRoomCode] = useState<string>("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(false);

  const game = useGameSync(gameId);
  const resetGame = useMutation(api.games.resetGame);

  // Keep screen awake during game session
  useWakeLock(!!gameId);

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

  // Welcome screen - single "Start" button
  if (!deviceRole && !showModeSelection) {
    return (
      <div className="mobile-screen flex flex-col items-center justify-center p-6 bg-white">
        {showInstructions && <Instructions onClose={() => setShowInstructions(false)} />}

        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            אילנס <Icon icon={Target} size="xl" className="text-indigo-500" />
          </h1>
          <p className="text-gray-500 text-lg">משחק מילים מטורף!</p>
        </div>

        <div className="w-full max-w-xs">
          <button
            onClick={() => setShowModeSelection(true)}
            className="w-full doodle-card p-5 text-center text-2xl font-bold text-gray-800 hover:scale-105 transition-transform flex items-center justify-center gap-3"
          >
            יאללה נתחיל! <Icon icon={Rocket} size="lg" className="text-indigo-500" />
          </button>
        </div>

        <button
          onClick={() => setShowInstructions(true)}
          className="mt-10 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Icon icon={HelpCircle} size="sm" />
          <span className="underline underline-offset-4">איך משחקים?</span>
        </button>
      </div>
    );
  }

  // Mode selection screen - Create or Join
  if (!deviceRole && showModeSelection) {
    return (
      <div className="mobile-screen flex flex-col items-center justify-center p-6 bg-white">
        {showInstructions && <Instructions onClose={() => setShowInstructions(false)} />}

        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            אילנס <Icon icon={Target} size="xl" className="text-indigo-500" />
          </h1>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <button
            onClick={() => setDeviceRole("main")}
            className="w-full doodle-card p-5 text-right"
          >
            <div className="flex items-center gap-4">
              <Icon icon={Gamepad2} size="xl" className="text-indigo-500" />
              <div>
                <div className="text-xl font-bold text-gray-800">צור משחק חדש</div>
                <div className="text-gray-500 text-sm">אני המארח</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setDeviceRole("timer")}
            className="w-full doodle-card p-5 text-right"
          >
            <div className="flex items-center gap-4">
              <Icon icon={Link} size="xl" className="text-indigo-500" />
              <div>
                <div className="text-xl font-bold text-gray-800">הצטרף למשחק</div>
                <div className="text-gray-500 text-sm">יש לי קוד</div>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={() => setShowModeSelection(false)}
          className="mt-10 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Icon icon={ArrowRight} size="sm" />
          <span className="underline underline-offset-4">חזרה</span>
        </button>
      </div>
    );
  }

  // Main device flow
  if (deviceRole === "main") {
    if (!gameId || !game) {
      return (
        <>
          <EndGameButton onEndGame={clearSession} />
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
        <>
          <EndGameButton onEndGame={clearSession} />
          <GameOver
            teams={game.teams}
            onPlayAgain={handlePlayAgain}
            onNewGame={clearSession}
          />
        </>
      );
    }

    if (game.status === "waiting" || game.status === "setup") {
      return (
        <>
          <EndGameButton onEndGame={clearSession} />
          {showInstructions && <Instructions onClose={() => setShowInstructions(false)} />}
          <SetupGame
            gameId={game._id}
            roomCode={roomCode}
            timerDeviceJoined={game.timerDeviceJoined}
            onSetupComplete={() => {}}
            onShowInstructions={() => setShowInstructions(true)}
          />
        </>
      );
    }

    if (game.status === "playing") {
      return (
        <>
          <EndGameButton onEndGame={clearSession} />
          <PlayTurn game={game} />
        </>
      );
    }

    if (game.status === "stealing") {
      return (
        <>
          <EndGameButton onEndGame={clearSession} />
          <StealMode game={game} />
        </>
      );
    }

    if (game.status === "transition") {
      return (
        <>
          <EndGameButton onEndGame={clearSession} />
          <TurnTransition game={game} />
        </>
      );
    }
  }

  // Timer device flow
  if (deviceRole === "timer") {
    if (!gameId || !game) {
      return (
        <>
          <EndGameButton onEndGame={clearSession} />
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
        <>
          <EndGameButton onEndGame={clearSession} />
          <GameOver
            teams={game.teams}
            onPlayAgain={handlePlayAgain}
            onNewGame={clearSession}
          />
        </>
      );
    }

    if (game.status === "waiting" || game.status === "setup" || game.status === "transition") {
      return (
        <>
          <EndGameButton onEndGame={clearSession} />
          <WaitingScreen game={game} />
        </>
      );
    }

    if (game.status === "playing") {
      return (
        <>
          <EndGameButton onEndGame={clearSession} />
          <TimerDisplay game={game} />
        </>
      );
    }

    if (game.status === "stealing") {
      return (
        <>
          <EndGameButton onEndGame={clearSession} />
          <StealAlert game={game} />
        </>
      );
    }
  }

  // Fallback
  return (
    <div className="mobile-screen flex items-center justify-center bg-white">
      <EndGameButton onEndGame={clearSession} />
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
