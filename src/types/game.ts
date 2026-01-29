import { Id } from "../../convex/_generated/dataModel";

export type GameStatus =
  | "waiting"
  | "setup"
  | "playing"
  | "stealing"
  | "transition"
  | "finished";

export type Difficulty = "easy" | "medium" | "hard";

export interface Team {
  id: string;
  name: string;
  score: number;
}

export interface Game {
  _id: Id<"games">;
  _creationTime: number;
  roomCode: string;
  status: GameStatus;
  teams: Team[];
  currentTeamIndex: number;
  currentWord?: string;
  roundDuration: number;
  difficulty: Difficulty;
  timerEndTime?: number;
  wordsUsed: string[];
  targetScore: number;
  timerDeviceJoined: boolean;
}

export type DeviceRole = "main" | "timer" | null;
