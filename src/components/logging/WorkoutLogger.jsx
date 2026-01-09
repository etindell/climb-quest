import React, { useState } from 'react';
import { Zap, Clock } from 'lucide-react';
import { Modal, Button } from '../common';
import { QuickLog } from './QuickLog';
import { DetailedLog } from './DetailedLog';

export function WorkoutLogger({ workout, personalRecords, isOpen, onClose, onComplete, onSavePRs }) {
  const [mode, setMode] = useState(null); // null | 'quick' | 'detailed'

  const handleComplete = (logData) => {
    // If detailed mode detected PRs, save them
    if (logData.detectedPRs && logData.detectedPRs.length > 0 && onSavePRs) {
      logData.detectedPRs.forEach(pr => {
        onSavePRs(pr.type, pr.value);
      });
    }

    onComplete({
      ...workout,
      ...logData,
      completed: logData.status !== 'skipped'
    });
    setMode(null);
    onClose();
  };

  const handleClose = () => {
    setMode(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Log Workout" size="lg">
      {mode === null && (
        <ModeSelector onSelect={setMode} exerciseCount={workout?.exercises?.length || 0} />
      )}
      {mode === 'quick' && (
        <QuickLog
          workout={workout}
          onComplete={handleComplete}
          onClose={handleClose}
        />
      )}
      {mode === 'detailed' && (
        <DetailedLog
          workout={workout}
          personalRecords={personalRecords}
          onComplete={handleComplete}
          onClose={handleClose}
        />
      )}
    </Modal>
  );
}

function ModeSelector({ onSelect, exerciseCount }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold" style={{ color: '#1E3A5F' }}>
          How would you like to log?
        </h2>
        <p className="text-sm" style={{ color: '#6B7C93' }}>
          {exerciseCount} exercises in this workout
        </p>
      </div>

      <button
        onClick={() => onSelect('quick')}
        className="w-full p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100
                   border-2 border-green-200 hover:border-green-300 transition-all
                   text-left group hover:scale-[1.02]"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center">
            <Zap className="text-white" size={28} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg" style={{ color: '#1E3A5F' }}>Quick Log</p>
            <p className="text-sm" style={{ color: '#6B7C93' }}>
              Just mark it done and rate how it went
            </p>
          </div>
          <span className="text-2xl">⚡</span>
        </div>
      </button>

      <button
        onClick={() => onSelect('detailed')}
        className="w-full p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100
                   border-2 border-purple-200 hover:border-purple-300 transition-all
                   text-left group hover:scale-[1.02]"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center">
            <Clock className="text-white" size={28} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg" style={{ color: '#1E3A5F' }}>Detailed Log</p>
            <p className="text-sm" style={{ color: '#6B7C93' }}>
              Track each exercise and detect PRs!
            </p>
          </div>
          <span className="text-2xl">🏆</span>
        </div>
      </button>

      <p className="text-center text-xs mt-2" style={{ color: '#6B7C93' }}>
        Tip: Use detailed log to track your personal records!
      </p>
    </div>
  );
}

export default WorkoutLogger;
