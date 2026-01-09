import React from 'react';
import { TrendingUp, Trophy, Target } from 'lucide-react';
import { Card, Badge, ProgressBar } from '../../common';

const ASSIST_LEVELS = [30, 25, 20, 15, 10, 5, 0]; // 0 = unassisted
const TARGET_UNASSISTED = 12;

export function PullupLadder({ personalRecords }) {
  const { pullUps = [], assistedPullUps = {} } = personalRecords;

  // Get best for each level
  const getBestForLevel = (level) => {
    if (level === 0) {
      // Unassisted pull-ups
      return pullUps.length > 0 ? Math.max(...pullUps.map(r => r.value)) : null;
    }
    const records = assistedPullUps[level] || [];
    return records.length > 0 ? Math.max(...records.map(r => r.value)) : null;
  };

  // Find current working level (lowest assist with records)
  const getCurrentLevel = () => {
    for (const level of ASSIST_LEVELS) {
      if (getBestForLevel(level) !== null) {
        return level;
      }
    }
    return 30; // Start at highest assist
  };

  const currentLevel = getCurrentLevel();
  const unassistedBest = getBestForLevel(0);
  const progressToGoal = unassistedBest ? Math.min((unassistedBest / TARGET_UNASSISTED) * 100, 100) : 0;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: '#1E3A5F' }}>Pull-up Progress</h3>
        <Target style={{ color: '#40E0D0' }} size={20} />
      </div>

      {/* Goal progress */}
      <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: 'rgba(64, 224, 208, 0.1)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: '#1E3A5F' }}>
            Goal: {TARGET_UNASSISTED} Unassisted Pull-ups
          </span>
          {unassistedBest >= TARGET_UNASSISTED && (
            <Badge variant="celebration">Achieved!</Badge>
          )}
        </div>
        <ProgressBar
          value={unassistedBest || 0}
          max={TARGET_UNASSISTED}
          color={unassistedBest >= TARGET_UNASSISTED ? 'celebration' : 'primary'}
          size="md"
        />
        <p className="text-xs mt-2" style={{ color: '#6B7C93' }}>
          {unassistedBest
            ? `Current best: ${unassistedBest} reps (${Math.round(progressToGoal)}% of goal)`
            : 'Start with assisted pull-ups and work your way up!'}
        </p>
      </div>

      {/* Ladder visualization */}
      <div className="space-y-2">
        {ASSIST_LEVELS.map((level, index) => {
          const best = getBestForLevel(level);
          const isUnlocked = best !== null;
          const isCurrent = level === currentLevel;
          const isUnassisted = level === 0;

          return (
            <div
              key={level}
              className={`
                flex items-center gap-3 p-3 rounded-xl transition-all
                ${isUnlocked && !isCurrent ? 'bg-green-50' : ''}
                ${!isUnlocked ? 'bg-gray-50 opacity-60' : ''}
              `}
              style={isCurrent ? { backgroundColor: 'rgba(64, 224, 208, 0.1)', boxShadow: 'inset 0 0 0 2px #40E0D0' } : {}}
            >
              {/* Level indicator */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                style={
                  isUnassisted
                    ? { backgroundColor: '#FFD700', color: 'white' }
                    : isUnlocked
                      ? { backgroundColor: '#40E0D0', color: 'white' }
                      : { backgroundColor: '#E5E7EB', color: '#6B7280' }
                }
              >
                {isUnassisted ? '💪' : `${level}`}
              </div>

              {/* Level info */}
              <div className="flex-1">
                <p className="font-medium" style={{ color: isUnlocked ? '#1E3A5F' : '#9CA3AF' }}>
                  {isUnassisted ? 'Unassisted' : `${level} lb assist`}
                </p>
                {isUnlocked && (
                  <p className="text-sm" style={{ color: '#6B7C93' }}>
                    Best: {best} reps
                  </p>
                )}
                {!isUnlocked && (
                  <p className="text-xs text-gray-400">Not yet unlocked</p>
                )}
              </div>

              {/* Status icon */}
              <div>
                {isUnlocked && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                {isCurrent && !isUnlocked && (
                  <TrendingUp style={{ color: '#40E0D0' }} size={20} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-xl">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> Once you can do 8+ reps at a level, try moving to less assistance!
        </p>
      </div>
    </Card>
  );
}

export default PullupLadder;
