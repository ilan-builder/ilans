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
}

interface TeamInput {
  id: string;
  name: string;
}

export function SetupGame({ gameId, roomCode, timerDeviceJoined, onSetupComplete }: SetupGameProps) {
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
      alert("נדרשות לפחות 2 קבוצות");
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
      onSetupComplete();
    } catch (error) {
      console.error("Failed to setup game:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 text-white">
      <div className="max-w-md mx-auto">
        {/* Room Code Display */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm mb-1">קוד החדר</p>
          <div className="text-5xl font-mono font-bold tracking-widest text-blue-400">
            {roomCode}
          </div>
          <div className={`mt-3 flex items-center justify-center gap-2 ${
            timerDeviceJoined ? "text-green-400" : "text-yellow-400"
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              timerDeviceJoined ? "bg-green-400" : "bg-yellow-400 animate-pulse"
            }`} />
            <span className="text-sm">
              {timerDeviceJoined ? "מכשיר הטיימר מחובר" : "ממתין למכשיר הטיימר..."}
            </span>
          </div>
        </div>

        {/* Teams */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">קבוצות</h2>
          <div className="space-y-3">
            {teams.map((team, index) => (
              <div key={team.id} className="flex gap-2">
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => updateTeamName(index, e.target.value)}
                  placeholder={`קבוצה ${index + 1}`}
                  className="flex-1 px-4 py-3 bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                {teams.length > 2 && (
                  <button
                    onClick={() => removeTeam(index)}
                    className="px-4 bg-red-600/30 hover:bg-red-600/50 rounded-xl transition-colors"
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
              className="mt-3 w-full py-2 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors"
            >
              + הוסף קבוצה
            </button>
          )}
        </div>

        {/* Duration */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">משך סיבוב</h2>
          <div className="flex gap-2">
            {[30, 45, 60, 90].map((duration) => (
              <button
                key={duration}
                onClick={() => setRoundDuration(duration)}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  roundDuration === duration
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {duration}ש'
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">רמת קושי</h2>
          <div className="flex gap-2">
            {[
              { value: "easy" as Difficulty, label: "קל" },
              { value: "medium" as Difficulty, label: "בינוני" },
              { value: "hard" as Difficulty, label: "קשה" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setDifficulty(option.value)}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  difficulty === option.value
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target Score */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">נקודות לניצחון</h2>
          <div className="flex gap-2">
            {[30, 50, 75, 100].map((score) => (
              <button
                key={score}
                onClick={() => setTargetScore(score)}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  targetScore === score
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {score}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !timerDeviceJoined}
          className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-2xl font-bold text-2xl transition-all shadow-lg shadow-green-500/30"
        >
          {isSubmitting ? "מתחיל..." : !timerDeviceJoined ? "ממתין לטיימר..." : "התחל משחק"}
        </button>
      </div>
    </div>
  );
}
