interface EndGameButtonProps {
  onEndGame: () => void;
}

export function EndGameButton({ onEndGame }: EndGameButtonProps) {
  return (
    <button
      onClick={onEndGame}
      className="fixed z-50 w-10 h-10 rounded-full bg-white border-2 border-gray-300 shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-300 transition-all active:scale-95"
      style={{
        top: 'max(16px, calc(env(safe-area-inset-top, 0px) + 8px))',
        right: '16px',
      }}
      title="סיים משחק"
    >
      ✕
    </button>
  );
}
