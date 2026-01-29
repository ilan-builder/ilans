import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    roomCode: v.string(),
    status: v.union(
      v.literal("waiting"),     // Waiting for timer device
      v.literal("setup"),       // Setting up teams
      v.literal("playing"),     // Active game
      v.literal("stealing"),    // Steal mode after timer
      v.literal("transition"),  // Between turns
      v.literal("finished")     // Game over
    ),
    teams: v.array(v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
    })),
    currentTeamIndex: v.number(),
    currentWord: v.optional(v.string()),
    roundDuration: v.number(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    timerEndTime: v.optional(v.number()),
    wordsUsed: v.array(v.string()),
    targetScore: v.number(),
    timerDeviceJoined: v.boolean(),
  }).index("by_roomCode", ["roomCode"]),
});
