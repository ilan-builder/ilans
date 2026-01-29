# אילנס (Ilans) - Hebrew Word Guessing Game

A mobile-first PWA web app based on the Alias board game, designed for two devices.

## How to Play

1. **Main Device**: Shows words to the describer, controls the game
2. **Timer Device**: Public display showing countdown timer and scores

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Convex
```bash
npx convex dev
```
This will prompt you to log in and create a new project. It will automatically create `.env.local` with your `VITE_CONVEX_URL`.

### 3. Run the development server
```bash
npm run dev
```

## Game Flow

1. On the main device, tap "Create Game" to get a room code
2. On the timer device, enter the room code to join
3. Set up teams (2-4 teams), duration, and difficulty
4. Pass the main device to the first team's describer
5. When ready, tap "Start" - the timer begins on both devices
6. Describer explains words without saying them
7. Teammates guess - tap "Correct" (+1) or "Skip" (-1)
8. When time runs out, other teams can "steal" by guessing the current word
9. Pass to the next team and repeat
10. First team to reach the target score wins!

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS (mobile-first)
- Convex (real-time sync)
- PWA (installable)
