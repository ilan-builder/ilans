import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Difficulty } from "../../types/game";

interface SetupGameProps {
  gameId: Id<"games">;
  roomCode: string;
  timerDeviceJoined: boolean;
  onSetupComplete: () => void;
  onShowInstructions: () => void;
}

interface TeamInput {
  id: string;
  name: string;
}

export function SetupGame({ gameId, roomCode, timerDeviceJoined, onShowInstructions }: SetupGameProps) {
  const setupTeams = useMutation(api.games.setupTeams);
  const [teams, setTeams] = useState<TeamInput[]>([
    { id: "1", name: "" },
    { id: "2", name: "" },
  ]);
  const [roundDuration, setRoundDuration] = useState(60);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [targetScore, setTargetScore] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTeam = () => {
    if (teams.length < 4) {
      setTeams([...teams, { id: String(teams.length + 1), name: "" }]);
    }
  };

  const removeTeam = (index: number) => {
    if (teams.length > 2) {
      setTeams(teams.filter((_, i) => i !== index));
    }
  };

  const updateTeamName = (index: number, name: string) => {
    const newTeams = [...teams];
    newTeams[index].name = name;
    setTeams(newTeams);
  };

  const handleSubmit = async () => {
    const validTeams = teams.filter((t) => t.name.trim());
    if (validTeams.length < 2) {
      alert("נדרשות לפחות 2 קבוצות עם שמות");
      return;
    }

    setIsSubmitting(true);
    try {
      await setupTeams({
        gameId,
        teams: validTeams.map((t) => ({ id: t.id, name: t.name.trim() })),
        roundDuration,
        difficulty,
        targetScore,
      });
    } catch (error) {
      console.error("Failed to setup game:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col p-4 safe-area-top safe-area-bottom overflow-hidden">
      {/* Room Code Header */}
      <div className="glass p-4 mb-4 text-center">
        <p className="text-gray-500 text-xs mb-1">קוד החדר</p>
        <div className="text-3xl font-mono font-bold tracking-widest gradient-text">
          {roomCode}
        </div>
        <div className={`mt-2 flex items-center justify-center gap-2 text-sm ${
          timerDeviceJoined ? "text-green-600" : "text-amber-600"
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            timerDeviceJoined ? "bg-green-500" : "bg-amber-500 animate-pulse"
          }`} />
          {timerDeviceJoined ? "טיימר מחובר ✓" : "ממתין לטיימר..."}
        </div>
      </div>

      {/* Settings */}
      <div className="glass flex-1 p-4 overflow-y-auto">
        {/* Teams */}
        <div className="mb-4">
          <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span>👥</span> קבוצות
          </h2>
          <div className="space-y-2">
            {teams.map((team, index) => (
              <div key={team.id} className="flex gap-2">
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => updateTeamName(index, e.target.value)}
                  placeholder={`קבוצה ${index + 1}`}
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800"
                />
                {teams.length > 2 && (
                  <button
                    onClick={() => removeTeam(index)}
                    className="px-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          {teams.length < 4 && (
            <button
              onClick={addTeam}
              className="mt-2 w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-colors text-sm"
            >
              + הוסף קבוצה
            </button>
          )}
        </div>

        {/* Duration */}
        <div className="mb-4">
          <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span>⏱️</span> משך סיבוב
          </h2>
          <div className="flex gap-2">
            {[30, 45, 60, 90].map((duration) => (
              <button
                key={duration}
                onClick={() => setRoundDuration(duration)}
                className={`flex-1 py-2 rounded-xl font-medium text-sm transition-all ${
                  roundDuration === duration
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {duration}ש'
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-4">
          <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span>🎯</span> רמת קושי
          </h2>
          <div className="flex gap-2">
            {[
              { value: "easy" as Difficulty, label: "קל", emoji: "😊" },
              { value: "medium" as Difficulty, label: "בינוני", emoji: "🤔" },
              { value: "hard" as Difficulty, label: "קשה", emoji: "🤯" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setDifficulty(option.value)}
                className={`flex-1 py-2 rounded-xl font-medium text-sm transition-all ${
                  difficulty === option.value
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.emoji} {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target Score */}
        <div className="mb-2">
          <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span>🏆</span> נקודות לניצחון
          </h2>
          <div className="flex gap-2">
            {[30, 50, 75, 100].map((score) => (
              <button
                key={score}
                onClick={() => setTargetScore(score)}
                className={`flex-1 py-2 rounded-xl font-medium text-sm transition-all ${
                  targetScore === score
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {score}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="mt-4 space-y-2">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !timerDeviceJoined}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "מתחיל..." : !timerDeviceJoined ? "ממתין לטיימר..." : "🚀 התחל משחק!"}
        </button>
        <button
          onClick={onShowInstructions}
          className="w-full py-2 text-gray-600 text-sm"
        >
          ❓ איך משחקים?
        </button>
      </div>
    </div>
  );
}
