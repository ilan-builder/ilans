import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface CreateRoomProps {
  onRoomCreated: (gameId: Id<"games">, roomCode: string) => void;
}

export function CreateRoom({ onRoomCreated }: CreateRoomProps) {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          אילנס
        </h1>
        <p className="text-gray-400 text-lg">משחק מילים בעברית</p>
      </div>

      <div className="w-full max-w-sm">
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 rounded-2xl font-bold text-2xl transition-all shadow-lg shadow-blue-500/30"
        >
          {isCreating ? "יוצר חדר..." : "צור משחק חדש"}
        </button>
      </div>

      <div className="mt-16 text-center text-gray-500 text-sm">
        <p>מכשיר המסביר - מציג את המילים</p>
        <p className="mt-1">מכשיר הטיימר - מציג את הזמן לכולם</p>
      </div>
    </div>
  );
}
