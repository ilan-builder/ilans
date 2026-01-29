interface InstructionsProps {
  onClose: () => void;
}

export function Instructions({ onClose }: InstructionsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass max-w-sm w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold gradient-text">איך משחקים?</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-gray-700">
          {/* Two devices explanation */}
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
              <span className="text-xl">📱📱</span> שני מכשירים
            </h3>
            <p className="text-sm leading-relaxed">
              <strong>מכשיר מסביר</strong> - מציג מילים למסביר בלבד
              <br />
              <strong>מכשיר טיימר</strong> - מציג זמן וניקוד לכולם
            </p>
          </div>

          {/* How to play */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800">מהלך המשחק:</h3>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm flex-shrink-0">1</span>
              <p className="text-sm">צרו חדר במכשיר המסביר וקבלו קוד</p>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm flex-shrink-0">2</span>
              <p className="text-sm">חברו את מכשיר הטיימר עם הקוד</p>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm flex-shrink-0">3</span>
              <p className="text-sm">הגדירו קבוצות והתחילו!</p>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm flex-shrink-0">4</span>
              <p className="text-sm">המסביר רואה מילה ומסביר בלי להגיד אותה</p>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm flex-shrink-0">5</span>
              <p className="text-sm"><strong>ניחשו נכון?</strong> לחצו ✓ ותקבלו נקודה</p>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm flex-shrink-0">6</span>
              <p className="text-sm"><strong>דילגתם?</strong> לחצו ✕ ותפסידו נקודה</p>
            </div>
          </div>

          {/* Steal mode */}
          <div className="bg-amber-50 rounded-xl p-4">
            <h3 className="font-bold text-amber-700 mb-2 flex items-center gap-2">
              <span className="text-xl">⚡</span> גניבה!
            </h3>
            <p className="text-sm leading-relaxed">
              כשנגמר הזמן, קבוצות אחרות יכולות לנחש את המילה האחרונה ולגנוב נקודה!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold"
        >
          הבנתי, בואו נשחק!
        </button>
      </div>
    </div>
  );
}
