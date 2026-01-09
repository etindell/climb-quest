import React, { useState } from 'react';
import { Flame, Snowflake, Shield, Trophy, Calendar } from 'lucide-react';
import { Card, Button, Modal } from '../common';
import { format, differenceInDays, parseISO } from 'date-fns';

const FREEZES_PER_MONTH = 2;

export function StreakCard({ streaks, onUseFreeze }) {
  const [showFreezeModal, setShowFreezeModal] = useState(false);

  const { current, best, lastWorkoutDate, freezesUsedThisMonth = 0 } = streaks;

  // Calculate days since last workout
  const daysSinceWorkout = lastWorkoutDate
    ? differenceInDays(new Date(), parseISO(lastWorkoutDate))
    : null;

  // Determine streak status
  const isAtRisk = daysSinceWorkout !== null && daysSinceWorkout >= 1 && daysSinceWorkout <= 7;
  const isBroken = daysSinceWorkout !== null && daysSinceWorkout > 7;
  const freezesRemaining = FREEZES_PER_MONTH - freezesUsedThisMonth;
  const canFreeze = isAtRisk && freezesRemaining > 0;

  // Determine display color
  const getStreakColor = () => {
    if (current >= 30) return 'from-purple-500 to-pink-500';
    if (current >= 14) return 'from-orange-500 to-red-500';
    if (current >= 7) return 'from-yellow-500 to-orange-500';
    return 'from-gray-400 to-gray-500';
  };

  const getFireIntensity = () => {
    if (current >= 30) return 'text-purple-500';
    if (current >= 14) return 'text-red-500';
    if (current >= 7) return 'text-orange-500';
    if (current >= 1) return 'text-yellow-500';
    return 'text-gray-400';
  };

  const handleUseFreeze = () => {
    if (onUseFreeze) {
      onUseFreeze();
    }
    setShowFreezeModal(false);
  };

  return (
    <>
      <Card className={`relative overflow-hidden ${isAtRisk ? 'ring-2 ring-orange-400' : ''}`}>
        {/* Background gradient for high streaks */}
        {current >= 7 && (
          <div className={`absolute inset-0 bg-gradient-to-r ${getStreakColor()} opacity-10`} />
        )}

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full bg-orange-100 ${current > 0 ? 'animate-pulse' : ''}`}>
                <Flame className={getFireIntensity()} size={24} />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: '#1E3A5F' }}>Workout Streak</h3>
                <p className="text-xs" style={{ color: '#6B7C93' }}>
                  {lastWorkoutDate
                    ? `Last workout: ${format(parseISO(lastWorkoutDate), 'MMM d')}`
                    : 'Start your streak today!'
                  }
                </p>
              </div>
            </div>

            {/* Freeze indicator */}
            <div className="flex items-center gap-1">
              {Array.from({ length: FREEZES_PER_MONTH }).map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full flex items-center justify-center
                    ${i < freezesRemaining
                      ? 'bg-blue-100 text-blue-500'
                      : 'bg-gray-100 text-gray-300'
                    }`}
                >
                  <Snowflake size={14} />
                </div>
              ))}
            </div>
          </div>

          {/* Main streak display */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-5xl font-bold" style={{ color: '#1E3A5F' }}>{current}</p>
              <p className="text-sm" style={{ color: '#6B7C93' }}>
                {current === 1 ? 'day' : 'days'} strong
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1" style={{ color: '#FFD700' }}>
                <Trophy size={16} />
                <span className="font-bold">{best}</span>
              </div>
              <p className="text-xs" style={{ color: '#6B7C93' }}>Best streak</p>
            </div>
          </div>

          {/* Streak milestones */}
          {current > 0 && (
            <div className="mt-4 flex gap-2">
              {[7, 14, 30].map(milestone => (
                <div
                  key={milestone}
                  className={`flex-1 py-2 rounded-lg text-center text-sm font-medium
                    ${current >= milestone
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-gray-100 text-gray-400'
                    }`}
                >
                  {current >= milestone ? '✓' : ''} {milestone}d
                </div>
              ))}
            </div>
          )}

          {/* At risk warning */}
          {isAtRisk && (
            <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="text-orange-500" size={18} />
                <span className="font-semibold text-orange-700">Streak at risk!</span>
              </div>
              <p className="text-sm text-orange-600 mb-3">
                {daysSinceWorkout === 1
                  ? "You missed yesterday. Work out today to keep your streak!"
                  : `It's been ${daysSinceWorkout} days. Your streak will reset soon!`
                }
              </p>
              {canFreeze && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowFreezeModal(true)}
                  className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <Snowflake size={16} className="mr-1" />
                  Use Streak Freeze ({freezesRemaining} left)
                </Button>
              )}
            </div>
          )}

          {/* Motivation message */}
          {!isAtRisk && current > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded-xl">
              <p className="text-sm text-green-700 text-center">
                {current >= 30
                  ? "You're unstoppable! A whole month of dedication!"
                  : current >= 14
                    ? "Two weeks strong! You're building great habits!"
                    : current >= 7
                      ? "One week down! You're on fire!"
                      : "Great start! Keep it going!"}
              </p>
            </div>
          )}

          {/* No streak yet */}
          {current === 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-3xl mb-2">🎯</p>
              <p style={{ color: '#6B7C93' }}>
                Complete a workout to start your streak!
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Freeze Modal */}
      <Modal
        isOpen={showFreezeModal}
        onClose={() => setShowFreezeModal(false)}
        title="Use Streak Freeze?"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Snowflake className="text-blue-500" size={40} />
          </div>

          <p className="mb-4" style={{ color: '#1E3A5F' }}>
            A Streak Freeze protects your streak when you need a rest day.
          </p>

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-700">
              You have <strong>{freezesRemaining} freeze{freezesRemaining !== 1 ? 's' : ''}</strong> remaining this month.
              Use wisely - they reset on the 1st of each month!
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowFreezeModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUseFreeze}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              <Snowflake size={18} className="mr-1" />
              Use Freeze
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default StreakCard;
