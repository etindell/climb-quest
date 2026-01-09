import React from 'react';
import { TrendingUp, Award, ChevronRight } from 'lucide-react';
import { Badge } from '../common';

export function ProgressionIndicator({ status, compact = false }) {
  if (!status) return null;

  const { ready, message, currentLevel, progressionType, sessionCount } = status;

  if (compact) {
    // Compact version for cards/lists
    if (ready) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <TrendingUp size={12} />
          Ready to progress
        </Badge>
      );
    }
    return null;
  }

  // Full version for exercise tracker
  return (
    <div className={`rounded-lg p-3 mb-4 ${
      ready ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
    }`}>
      <div className="flex items-start gap-2">
        {ready ? (
          <Award size={20} className="text-green-500 mt-0.5" />
        ) : (
          <TrendingUp size={20} className="text-gray-400 mt-0.5" />
        )}

        <div className="flex-1">
          {ready ? (
            <>
              <p className="font-semibold text-green-700 text-sm">
                Ready to Progress!
              </p>
              <p className="text-green-600 text-xs mt-1">
                {message}
              </p>
            </>
          ) : (
            <>
              <p className="font-medium text-gray-700 text-sm">
                Current Level: {currentLevel || 'Starting'}
              </p>
              {sessionCount !== undefined && (
                <p className="text-gray-500 text-xs mt-1">
                  {sessionCount} sessions logged
                </p>
              )}
            </>
          )}
        </div>

        {ready && (
          <ChevronRight size={20} className="text-green-400" />
        )}
      </div>

      {/* Progression type specific info */}
      {progressionType && !ready && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs" style={{ color: '#6B7C93' }}>
            {progressionType === 'pullup' && 'Complete 2+ sessions with clean form to progress'}
            {progressionType === 'pushup' && 'Hit top of rep range for 2 sessions to progress'}
            {progressionType === 'legs' && 'Hit top of rep range, then add weight'}
            {progressionType === 'core' && 'Hit top of duration range to add 5 seconds'}
          </p>
        </div>
      )}
    </div>
  );
}

// Mini version for session cards
export function ProgressionBadge({ count }) {
  if (!count || count === 0) return null;

  return (
    <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
      <TrendingUp size={14} />
      <span className="text-xs font-medium">
        {count} exercise{count > 1 ? 's' : ''} ready to progress
      </span>
    </div>
  );
}

export default ProgressionIndicator;
