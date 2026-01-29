import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface JoinRoomProps {
  onJoined: (gameId: Id<"games">, roomCode: string) => void;
  onShowInstructions: () => void;
}

export function JoinRoom({ onJoined, onShowInstructions }: JoinRoomProps) {
  const joinGame = useMutation(api.games.joinGame);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (code.length !== 4) {
      setError("הקוד חייב להיות 4 ספרות");
      return;
    }

    setIsJoining(true);
    setError("");

    try {
      const result = await joinGame({ roomCode: code });
      onJoined(result.gameId, code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בהצטרפות");
      setIsJoining(false);
    }
  };

  const handleCodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setCode(numericValue);
    setError("");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 safe-area-top safe-area-bottom">
      <div className="text-center mb-8">
        <span className="text-6xl mb-4 block animate-bounce-soft">⏱️</span>
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">
          מכשיר טיימר
        </h1>
        <p className="text-white/70 mt-2">הכניסו את קוד החדר</p>
      </div>

      <div className="w-full max-w-xs">
        <div className="glass p-6 mb-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="0000"
            className="w-full text-center text-4xl font-mono tracking-[0.3em] py-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 placeholder-gray-400"
            maxLength={4}
          />
          {error && (
            <p className="text-red-500 text-center mt-3 text-sm">{error}</p>
          )}
        </div>

        <button
          onClick={handleJoin}
          disabled={code.length !== 4 || isJoining}
          className="w-full glass py-4 font-bold text-xl text-gray-800 hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isJoining ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> מתחבר...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>🔗</span> הצטרף למשחק
            </span>
          )}
        </button>
      </div>

      <button
        onClick={onShowInstructions}
        className="mt-8 flex items-center gap-2 text-white/90 hover:text-white transition-colors"
      >
        <span className="text-xl">❓</span>
        <span className="underline underline-offset-4">איך משחקים?</span>
      </button>
    </div>
  );
}
