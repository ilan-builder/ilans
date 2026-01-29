interface InstructionsProps {
  onClose: () => void;
}

export function Instructions({ onClose }: InstructionsProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="doodle-card bg-white max-w-sm w-full max-h-[85vh] overflow-y-auto p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">איך משחקים? 🎯</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-gray-700">
          {/* Two devices explanation */}
          <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-200">
            <h3 className="font-bold text-indigo-700 mb-2">📱📱 שני מכשירים</h3>
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
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm flex-shrink-0 font-bold border-2 border-indigo-600">1</span>
              <p className="text-sm">צרו חדר במכשיר המסביר וקבלו קוד</p>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm flex-shrink-0 font-bold border-2 border-indigo-600">2</span>
              <p className="text-sm">חברו את מכשיר הטיימר עם הקוד</p>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm flex-shrink-0 font-bold border-2 border-indigo-600">3</span>
              <p className="text-sm">הגדירו קבוצות והתחילו!</p>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm flex-shrink-0 font-bold border-2 border-green-600">4</span>
              <p className="text-sm">המסביר רואה מילה ומסביר בלי להגיד אותה</p>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm flex-shrink-0 font-bold border-2 border-green-600">✓</span>
              <p className="text-sm"><strong>ניחשו נכון?</strong> לחצו ✓ ותקבלו נקודה</p>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm flex-shrink-0 font-bold border-2 border-red-600">✕</span>
              <p className="text-sm"><strong>דילגתם?</strong> לחצו ✕ ותפסידו נקודה</p>
            </div>
          </div>

          {/* Steal mode */}
          <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
            <h3 className="font-bold text-amber-700 mb-2">⚡ גניבה!</h3>
            <p className="text-sm leading-relaxed">
              כשנגמר הזמן, קבוצות אחרות יכולות לנחש את המילה האחרונה ולגנוב נקודה!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 doodle-btn bg-indigo-500 text-white py-3"
        >
          הבנתי, בואו נשחק! 🚀
        </button>
      </div>
    </div>
  );
}
