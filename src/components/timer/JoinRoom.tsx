import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Icon, Timer, Loader2, Link, HelpCircle } from "../shared/Icon";

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
    <div className="mobile-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="text-center mb-10">
        <span className="text-7xl mb-4 block animate-bounce-soft flex justify-center">
          <Icon icon={Timer} size="3xl" className="text-indigo-500" />
        </span>
        <h1 className="text-3xl font-bold text-gray-800">
          מכשיר טיימר
        </h1>
        <p className="text-gray-500 mt-2">הכניסו את קוד החדר</p>
      </div>

      <div className="w-full max-w-xs">
        <div className="doodle-card p-6 mb-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="0000"
            className="w-full text-center text-4xl font-mono tracking-[0.3em] py-4 doodle-input"
            maxLength={4}
          />
          {error && (
            <p className="text-red-500 text-center mt-3 text-sm">{error}</p>
          )}
        </div>

        <button
          onClick={handleJoin}
          disabled={code.length !== 4 || isJoining}
          className="w-full doodle-btn bg-indigo-500 text-white py-4 text-xl"
        >
          {isJoining ? (
            <span className="flex items-center justify-center gap-2">
              <Icon icon={Loader2} size="md" className="animate-spin" /> מתחבר...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Icon icon={Link} size="md" /> הצטרף למשחק
            </span>
          )}
        </button>
      </div>

      <button
        onClick={onShowInstructions}
        className="mt-10 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Icon icon={HelpCircle} size="sm" />
        <span className="underline underline-offset-4">איך משחקים?</span>
      </button>
    </div>
  );
}
