import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface JoinRoomProps {
  onJoined: (gameId: Id<"games">, roomCode: string) => void;
}

export function JoinRoom({ onJoined }: JoinRoomProps) {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          אילנס
        </h1>
        <p className="text-gray-400 text-lg">מכשיר טיימר</p>
      </div>

      <div className="w-full max-w-sm">
        <label className="block text-gray-400 text-sm mb-2 text-center">
          הכניסו את קוד החדר
        </label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="0000"
          className="w-full text-center text-5xl font-mono tracking-[0.5em] py-4 bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
          maxLength={4}
        />
        {error && (
          <p className="text-red-400 text-center mt-2">{error}</p>
        )}

        <button
          onClick={handleJoin}
          disabled={code.length !== 4 || isJoining}
          className="w-full mt-6 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-2xl font-bold text-2xl transition-all shadow-lg shadow-blue-500/30"
        >
          {isJoining ? "מתחבר..." : "הצטרף"}
        </button>
      </div>

      <div className="mt-16 text-center text-gray-500 text-sm">
        <p>הצג מכשיר זה לכל השחקנים</p>
        <p className="mt-1">כדי שיראו את הזמן והניקוד</p>
      </div>
    </div>
  );
}
