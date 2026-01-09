import React, { useState } from 'react';
import { Check, SkipForward, FileText, Star, X } from 'lucide-react';
import { Card, Button, Modal } from '../common';

const RATING_EMOJIS = [
  { emoji: '😫', label: 'Tough' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '😊', label: 'Good' },
  { emoji: '🤩', label: 'Amazing!' }
];

export function QuickLog({ workout, onComplete, onClose }) {
  const [status, setStatus] = useState(null); // 'completed' | 'skipped' | 'partial'
  const [rating, setRating] = useState(null);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleSubmit = () => {
    onComplete({
      status,
      rating,
      notes: notes.trim() || null,
      completedAt: new Date().toISOString()
    });
  };

  const isValid = status !== null;

  return (
    <div className="space-y-6">
      {/* Workout summary */}
      <div className="text-center">
        <h2 className="text-xl font-bold" style={{ color: '#1E3A5F' }}>
          How'd it go?
        </h2>
        <p className="mt-1" style={{ color: '#6B7C93' }}>
          {workout.exercises?.length || 0} exercises planned
        </p>
      </div>

      {/* Status Selection */}
      <div className="space-y-3">
        <button
          onClick={() => setStatus('completed')}
          className={`
            w-full p-4 rounded-xl flex items-center gap-4 transition-all
            ${status === 'completed'
              ? 'bg-green-100 border-2 border-green-500'
              : 'bg-white border-2 border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-100'}
          `}>
            <Check size={24} />
          </div>
          <div className="text-left">
            <p className="font-bold" style={{ color: '#1E3A5F' }}>Yes, I did it!</p>
            <p className="text-sm" style={{ color: '#6B7C93' }}>Completed the workout</p>
          </div>
        </button>

        <button
          onClick={() => setStatus('partial')}
          className={`
            w-full p-4 rounded-xl flex items-center gap-4 transition-all
            ${status === 'partial'
              ? 'bg-yellow-100 border-2 border-yellow-500'
              : 'bg-white border-2 border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${status === 'partial' ? 'bg-yellow-500 text-white' : 'bg-gray-100'}
          `}>
            <FileText size={24} />
          </div>
          <div className="text-left">
            <p className="font-bold" style={{ color: '#1E3A5F' }}>Did some of it</p>
            <p className="text-sm" style={{ color: '#6B7C93' }}>Partial completion counts too!</p>
          </div>
        </button>

        <button
          onClick={() => setStatus('skipped')}
          className={`
            w-full p-4 rounded-xl flex items-center gap-4 transition-all
            ${status === 'skipped'
              ? 'bg-gray-200 border-2 border-gray-400'
              : 'bg-white border-2 border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${status === 'skipped' ? 'bg-gray-400 text-white' : 'bg-gray-100'}
          `}>
            <SkipForward size={24} />
          </div>
          <div className="text-left">
            <p className="font-bold" style={{ color: '#1E3A5F' }}>Skipped today</p>
            <p className="text-sm" style={{ color: '#6B7C93' }}>Rest days are important too!</p>
          </div>
        </button>
      </div>

      {/* Rating (only show if completed or partial) */}
      {(status === 'completed' || status === 'partial') && (
        <Card>
          <p className="font-semibold mb-3" style={{ color: '#1E3A5F' }}>
            How did it feel?
          </p>
          <div className="flex justify-around">
            {RATING_EMOJIS.map(({ emoji, label }) => (
              <button
                key={emoji}
                onClick={() => setRating(emoji)}
                className={`
                  flex flex-col items-center p-2 rounded-lg transition-all
                  ${rating === emoji
                    ? 'bg-teal-100 scale-110'
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-xs mt-1" style={{ color: '#6B7C93' }}>{label}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Notes toggle */}
      {(status === 'completed' || status === 'partial') && (
        <div>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: '#40E0D0' }}
          >
            <FileText size={16} />
            {showNotes ? 'Hide notes' : 'Add notes (optional)'}
          </button>

          {showNotes && (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it go? Any highlights or things to remember?"
              className="w-full mt-2 p-3 border border-gray-200 rounded-xl resize-none
                         focus:ring-2 focus:ring-teal-400 focus:border-transparent
                         outline-none"
              style={{ color: '#1E3A5F' }}
              rows={3}
            />
          )}
        </div>
      )}

      {/* Encouragement message */}
      {status && (
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'rgba(64, 224, 208, 0.1)' }}>
          {status === 'completed' && (
            <>
              <p className="text-2xl mb-1">🎉</p>
              <p className="font-semibold" style={{ color: '#1E3A5F' }}>Awesome job!</p>
              <p className="text-sm" style={{ color: '#6B7C93' }}>You're getting stronger every day!</p>
            </>
          )}
          {status === 'partial' && (
            <>
              <p className="text-2xl mb-1">👏</p>
              <p className="font-semibold" style={{ color: '#1E3A5F' }}>Great effort!</p>
              <p className="text-sm" style={{ color: '#6B7C93' }}>Some is always better than none!</p>
            </>
          )}
          {status === 'skipped' && (
            <>
              <p className="text-2xl mb-1">😴</p>
              <p className="font-semibold" style={{ color: '#1E3A5F' }}>Rest up!</p>
              <p className="text-sm" style={{ color: '#6B7C93' }}>Recovery is part of getting stronger.</p>
            </>
          )}
        </div>
      )}

      {/* Submit button */}
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="flex-1"
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default QuickLog;
