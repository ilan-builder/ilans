import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate a random 4-digit room code
function generateRoomCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Create a new game room
export const createGame = mutation({
  args: {},
  handler: async (ctx) => {
    let roomCode = generateRoomCode();

    // Ensure unique room code
    let existing = await ctx.db
      .query("games")
      .withIndex("by_roomCode", (q) => q.eq("roomCode", roomCode))
      .first();

    while (existing) {
      roomCode = generateRoomCode();
      existing = await ctx.db
        .query("games")
        .withIndex("by_roomCode", (q) => q.eq("roomCode", roomCode))
        .first();
    }

    const gameId = await ctx.db.insert("games", {
      roomCode,
      status: "waiting",
      teams: [],
      currentTeamIndex: 0,
      roundDuration: 60,
      difficulty: "medium",
      wordsUsed: [],
      targetScore: 50,
      timerDeviceJoined: false,
    });

    return { gameId, roomCode };
  },
});

// Timer device joins the game
export const joinGame = mutation({
  args: { roomCode: v.string() },
  handler: async (ctx, args) => {
    const game = await ctx.db
      .query("games")
      .withIndex("by_roomCode", (q) => q.eq("roomCode", args.roomCode))
      .first();

    if (!game) {
      throw new Error("חדר לא נמצא");
    }

    if (game.status === "finished") {
      throw new Error("המשחק כבר הסתיים");
    }

    await ctx.db.patch(game._id, {
      timerDeviceJoined: true,
      status: game.status === "waiting" ? "setup" : game.status,
    });

    return { gameId: game._id };
  },
});

// Get game by room code
export const getGameByCode = query({
  args: { roomCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("games")
      .withIndex("by_roomCode", (q) => q.eq("roomCode", args.roomCode))
      .first();
  },
});

// Get game by ID
export const getGame = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});

// Setup teams and game settings
export const setupTeams = mutation({
  args: {
    gameId: v.id("games"),
    teams: v.array(v.object({
      id: v.string(),
      name: v.string(),
    })),
    roundDuration: v.number(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    targetScore: v.number(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("משחק לא נמצא");

    const teamsWithScores = args.teams.map((team) => ({
      ...team,
      score: 0,
    }));

    await ctx.db.patch(args.gameId, {
      teams: teamsWithScores,
      roundDuration: args.roundDuration,
      difficulty: args.difficulty,
      targetScore: args.targetScore,
      status: "transition",
    });
  },
});

// Start a turn
export const startTurn = mutation({
  args: {
    gameId: v.id("games"),
    word: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("משחק לא נמצא");

    const timerEndTime = Date.now() + game.roundDuration * 1000;

    await ctx.db.patch(args.gameId, {
      status: "playing",
      currentWord: args.word,
      timerEndTime,
      wordsUsed: [...game.wordsUsed, args.word],
    });
  },
});

// Mark word as correct
export const markCorrect = mutation({
  args: {
    gameId: v.id("games"),
    newWord: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("משחק לא נמצא");

    const teams = [...game.teams];
    teams[game.currentTeamIndex].score += 1;

    await ctx.db.patch(args.gameId, {
      teams,
      currentWord: args.newWord,
      wordsUsed: [...game.wordsUsed, args.newWord],
    });

    // Check if team won
    if (teams[game.currentTeamIndex].score >= game.targetScore) {
      await ctx.db.patch(args.gameId, {
        status: "finished",
      });
    }
  },
});

// Mark word as skipped
export const markSkip = mutation({
  args: {
    gameId: v.id("games"),
    newWord: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("משחק לא נמצא");

    const teams = [...game.teams];
    teams[game.currentTeamIndex].score -= 1;

    await ctx.db.patch(args.gameId, {
      teams,
      currentWord: args.newWord,
      wordsUsed: [...game.wordsUsed, args.newWord],
    });
  },
});

// End turn (timer ran out)
export const endTurn = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("משחק לא נמצא");

    await ctx.db.patch(args.gameId, {
      status: "stealing",
      timerEndTime: undefined,
    });
  },
});

// Award steal to a team
export const awardSteal = mutation({
  args: {
    gameId: v.id("games"),
    teamId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("משחק לא נמצא");

    const teams = [...game.teams];

    if (args.teamId) {
      const teamIndex = teams.findIndex((t) => t.id === args.teamId);
      if (teamIndex !== -1) {
        teams[teamIndex].score += 1;
      }
    }

    const nextTeamIndex = (game.currentTeamIndex + 1) % teams.length;

    await ctx.db.patch(args.gameId, {
      teams,
      status: "transition",
      currentTeamIndex: nextTeamIndex,
      currentWord: undefined,
    });

    // Check if stealing team won
    if (args.teamId) {
      const stealingTeam = teams.find((t) => t.id === args.teamId);
      if (stealingTeam && stealingTeam.score >= game.targetScore) {
        await ctx.db.patch(args.gameId, {
          status: "finished",
        });
      }
    }
  },
});

// Skip steal phase (no one guessed)
export const skipSteal = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("משחק לא נמצא");

    const nextTeamIndex = (game.currentTeamIndex + 1) % game.teams.length;

    await ctx.db.patch(args.gameId, {
      status: "transition",
      currentTeamIndex: nextTeamIndex,
      currentWord: undefined,
    });
  },
});

// End the game
export const endGame = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.gameId, {
      status: "finished",
    });
  },
});

// Reset game for new round
export const resetGame = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("משחק לא נמצא");

    const resetTeams = game.teams.map((team) => ({
      ...team,
      score: 0,
    }));

    await ctx.db.patch(args.gameId, {
      teams: resetTeams,
      status: "transition",
      currentTeamIndex: 0,
      currentWord: undefined,
      wordsUsed: [],
      timerEndTime: undefined,
    });
  },
});

// Update a team's score manually
export const updateTeamScore = mutation({
  args: {
    gameId: v.id("games"),
    teamId: v.string(),
    newScore: v.number(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("משחק לא נמצא");

    const teams = game.teams.map((team) =>
      team.id === args.teamId
        ? { ...team, score: args.newScore }
        : team
    );

    await ctx.db.patch(args.gameId, { teams });
  },
});
