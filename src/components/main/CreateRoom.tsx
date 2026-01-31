import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Icon, Mic, Loader2, Sparkles, HelpCircle } from "../shared/Icon";

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
    <div className="mobile-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="text-center mb-10">
        <span className="text-7xl mb-4 block animate-bounce-soft flex justify-center">
          <Icon icon={Mic} size="3xl" className="text-indigo-500" />
        </span>
        <h1 className="text-3xl font-bold text-gray-800">
          מכשיר מסביר
        </h1>
        <p className="text-gray-500 mt-2">צרו חדר חדש להתחיל</p>
      </div>

      <div className="w-full max-w-xs">
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full doodle-btn bg-indigo-500 text-white py-5 text-xl"
        >
          {isCreating ? (
            <span className="flex items-center justify-center gap-2">
              <Icon icon={Loader2} size="md" className="animate-spin" /> יוצר חדר...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Icon icon={Sparkles} size="md" /> צור משחק חדש
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
