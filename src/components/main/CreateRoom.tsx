import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface CreateRoomProps {
  onRoomCreated: (gameId: Id<"games">, roomCode: string) => void;
  onShowInstructions: () => void;
}

export function CreateRoom({ onRoomCreated, onShowInstructions }: CreateRoomProps) {
  const createGame = useMutation(api.games.createGame);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const result = await createGame();
      onRoomCreated(result.gameId, result.roomCode);
    } catch (error) {
      console.error("Failed to create room:", error);
      setIsCreating(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 safe-area-top safe-area-bottom">
      <div className="text-center mb-8">
        <span className="text-6xl mb-4 block animate-bounce-soft">🎤</span>
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">
          מכשיר מסביר
        </h1>
        <p className="text-white/70 mt-2">צרו חדר חדש להתחיל</p>
      </div>

      <div className="w-full max-w-xs">
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full glass py-5 font-bold text-xl text-gray-800 hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isCreating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> יוצר חדר...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>✨</span> צור משחק חדש
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
