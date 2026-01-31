import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Difficulty } from "../../types/game";
import { Icon, Users, Timer, Target, Trophy, Rocket, X, HelpCircle, Check } from "../shared/Icon";

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
    <div className="mobile-screen flex flex-col p-4 pt-safe-button bg-white">
      {/* Room Code Header */}
      <div className="doodle-card p-4 mb-4 text-center">
        <p className="text-gray-500 text-xs mb-1">קוד החדר</p>
        <div className="text-3xl font-mono font-bold gradient-text tracking-widest">
          {roomCode}
        </div>
        <div className={`mt-2 flex items-center justify-center gap-2 text-sm ${
          timerDeviceJoined ? "text-green-600" : "text-amber-600"
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            timerDeviceJoined ? "bg-green-500" : "bg-amber-500 animate-pulse"
          }`} />
          {timerDeviceJoined ? (
            <span className="flex items-center gap-1">טיימר מחובר <Icon icon={Check} size="xs" /></span>
          ) : (
            "ממתין לטיימר..."
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="doodle-card flex-1 p-4 overflow-y-auto">
        {/* Teams */}
        <div className="mb-5">
          <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Icon icon={Users} size="sm" className="text-indigo-500" /> קבוצות
          </h2>
          <div className="space-y-2">
            {teams.map((team, index) => (
              <div key={team.id} className="flex gap-2">
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => updateTeamName(index, e.target.value)}
                  placeholder={`קבוצה ${index + 1}`}
                  className="flex-1 doodle-input"
                />
                {teams.length > 2 && (
                  <button
                    onClick={() => removeTeam(index)}
                    className="px-4 doodle-btn bg-red-100 text-red-600 flex items-center justify-center"
                  >
                    <Icon icon={X} size="sm" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {teams.length < 4 && (
            <button
              onClick={addTeam}
              className="mt-2 w-full py-2 border-3 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-sm"
            >
              + הוסף קבוצה
            </button>
          )}
        </div>

        {/* Duration */}
        <div className="mb-5">
          <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Icon icon={Timer} size="sm" className="text-indigo-500" /> משך סיבוב
          </h2>
          <div className="flex gap-2">
            {[30, 45, 60, 90].map((duration) => (
              <button
                key={duration}
                onClick={() => setRoundDuration(duration)}
                className={`flex-1 py-2 rounded-xl font-bold text-sm border-3 transition-all ${
                  roundDuration === duration
                    ? "bg-indigo-500 text-white border-indigo-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
                }`}
              >
                {duration}ש'
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-5">
          <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Icon icon={Target} size="sm" className="text-indigo-500" /> רמת קושי
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
                className={`flex-1 py-2 rounded-xl font-bold text-sm border-3 transition-all ${
                  difficulty === option.value
                    ? "bg-indigo-500 text-white border-indigo-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
                }`}
              >
                {option.emoji} {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target Score */}
        <div>
          <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Icon icon={Trophy} size="sm" className="text-amber-500" /> נקודות לניצחון
          </h2>
          <div className="flex gap-2">
            {[30, 50, 75, 100].map((score) => (
              <button
                key={score}
                onClick={() => setTargetScore(score)}
                className={`flex-1 py-2 rounded-xl font-bold text-sm border-3 transition-all ${
                  targetScore === score
                    ? "bg-indigo-500 text-white border-indigo-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
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
          className="w-full doodle-btn bg-green-500 text-white py-4 text-xl flex items-center justify-center gap-2"
        >
          {isSubmitting ? "מתחיל..." : !timerDeviceJoined ? "ממתין לטיימר..." : (
            <>
              <Icon icon={Rocket} size="md" /> התחל משחק!
            </>
          )}
        </button>
        <button
          onClick={onShowInstructions}
          className="w-full py-2 text-gray-500 text-sm hover:text-gray-700 flex items-center justify-center gap-1"
        >
          <Icon icon={HelpCircle} size="xs" /> איך משחקים?
        </button>
      </div>
    </div>
  );
}
