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
        <h3 className="font-semibold text-[--color-secondary]">Pull-up Progress</h3>
        <Target className="text-[--color-primary]" size={20} />
      </div>

      {/* Goal progress */}
      <div className="bg-[--color-primary]/10 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[--color-secondary]">
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
        <p className="text-xs text-[--color-text-muted] mt-2">
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
                ${isCurrent ? 'bg-[--color-primary]/10 ring-2 ring-[--color-primary]' : ''}
                ${isUnlocked && !isCurrent ? 'bg-green-50' : ''}
                ${!isUnlocked ? 'bg-gray-50 opacity-60' : ''}
              `}
            >
              {/* Level indicator */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                ${isUnassisted
                  ? 'bg-[--color-celebration] text-white'
                  : isUnlocked
                    ? 'bg-[--color-primary] text-white'
                    : 'bg-gray-200 text-gray-500'
                }
              `}>
                {isUnassisted ? '💪' : `${level}`}
              </div>

              {/* Level info */}
              <div className="flex-1">
                <p className={`font-medium ${isUnlocked ? 'text-[--color-secondary]' : 'text-gray-400'}`}>
                  {isUnassisted ? 'Unassisted' : `${level} lb assist`}
                </p>
                {isUnlocked && (
                  <p className="text-sm text-[--color-text-muted]">
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
                  <TrendingUp className="text-[--color-primary]" size={20} />
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
