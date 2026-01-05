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
        <h2 className="text-xl font-bold text-[--color-secondary]">
          How'd it go?
        </h2>
        <p className="text-[--color-text-muted] mt-1">
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
            <p className="font-bold text-[--color-secondary]">Yes, I did it!</p>
            <p className="text-sm text-[--color-text-muted]">Completed the workout</p>
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
            <p className="font-bold text-[--color-secondary]">Did some of it</p>
            <p className="text-sm text-[--color-text-muted]">Partial completion counts too!</p>
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
            <p className="font-bold text-[--color-secondary]">Skipped today</p>
            <p className="text-sm text-[--color-text-muted]">Rest days are important too!</p>
          </div>
        </button>
      </div>

      {/* Rating (only show if completed or partial) */}
      {(status === 'completed' || status === 'partial') && (
        <Card>
          <p className="font-semibold text-[--color-secondary] mb-3">
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
                    ? 'bg-[--color-primary]/20 scale-110'
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-xs text-[--color-text-muted] mt-1">{label}</span>
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
            className="text-[--color-primary] text-sm font-medium flex items-center gap-1"
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
                         focus:ring-2 focus:ring-[--color-primary] focus:border-transparent
                         outline-none text-[--color-secondary]"
              rows={3}
            />
          )}
        </div>
      )}

      {/* Encouragement message */}
      {status && (
        <div className="bg-[--color-primary]/10 rounded-xl p-4 text-center">
          {status === 'completed' && (
            <>
              <p className="text-2xl mb-1">🎉</p>
              <p className="font-semibold text-[--color-secondary]">Awesome job!</p>
              <p className="text-sm text-[--color-text-muted]">You're getting stronger every day!</p>
            </>
          )}
          {status === 'partial' && (
            <>
              <p className="text-2xl mb-1">👏</p>
              <p className="font-semibold text-[--color-secondary]">Great effort!</p>
              <p className="text-sm text-[--color-text-muted]">Some is always better than none!</p>
            </>
          )}
          {status === 'skipped' && (
            <>
              <p className="text-2xl mb-1">😴</p>
              <p className="font-semibold text-[--color-secondary]">Rest up!</p>
              <p className="text-sm text-[--color-text-muted]">Recovery is part of getting stronger.</p>
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
