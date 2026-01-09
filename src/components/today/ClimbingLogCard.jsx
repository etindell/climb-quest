import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export function ClimbingLogCard({ completed, onLogClimbing, notes: existingNotes }) {
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  if (completed) {
    return (
      <div className="rounded-xl p-4 bg-green-50 border-2 border-green-200">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div>
            <p className="font-bold text-green-800">Climbing Logged</p>
            <p className="text-sm text-green-600">Nice session!</p>
            {existingNotes && (
              <p className="text-sm text-green-700 mt-1 italic">&quot;{existingNotes}&quot;</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🧗</span>
        <div>
          <p className="font-bold text-teal-800">Climbing Session</p>
          <p className="text-sm text-teal-600">Log when you&apos;re done climbing</p>
        </div>
      </div>

      {showNotes && (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How was the session? Any sends? (optional)"
          className="w-full p-3 border border-teal-300 rounded-lg mb-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
          rows={2}
        />
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="px-4 py-2 text-sm font-medium text-teal-700 bg-white border border-teal-300 rounded-lg hover:bg-teal-50 transition-colors"
        >
          {showNotes ? 'Hide Notes' : 'Add Notes'}
        </button>
        <button
          onClick={() => onLogClimbing(notes)}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Log Climbing
        </button>
      </div>
    </div>
  );
}

export default ClimbingLogCard;
