import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Game } from "../types/game";

export function useGameSync(gameId: Id<"games"> | null): Game | null | undefined {
  return useQuery(
    api.games.getGame,
    gameId ? { gameId } : "skip"
  ) as Game | null | undefined;
}

export function useGameByCode(roomCode: string | null): Game | null | undefined {
  return useQuery(
    api.games.getGameByCode,
    roomCode ? { roomCode } : "skip"
  ) as Game | null | undefined;
}
