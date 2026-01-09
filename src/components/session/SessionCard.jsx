import React from 'react';
import { Clock, ChevronRight, Dumbbell, Leaf, Zap } from 'lucide-react';
import { Card, Button, Badge } from '../common';
import { ProgressionBadge } from './ProgressionIndicator';
import { SESSION_TYPES } from '../../data/program';

// Get icon for session type
function getSessionIcon(sessionType) {
  switch (sessionType) {
    case SESSION_TYPES.STRENGTH_1:
    case SESSION_TYPES.STRENGTH_2:
      return <Dumbbell size={24} className="text-blue-500" />;
    case SESSION_TYPES.MINI_A:
    case SESSION_TYPES.MINI_B:
      return <Zap size={24} className="text-amber-500" />;
    case SESSION_TYPES.MOBILITY:
      return <Leaf size={24} className="text-green-500" />;
    default:
      return <Dumbbell size={24} className="text-gray-400" />;
  }
}

// Get color scheme for session type
function getSessionColors(sessionType) {
  switch (sessionType) {
    case SESSION_TYPES.STRENGTH_1:
    case SESSION_TYPES.STRENGTH_2:
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        accent: 'text-blue-600'
      };
    case SESSION_TYPES.MINI_A:
    case SESSION_TYPES.MINI_B:
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        accent: 'text-amber-600'
      };
    case SESSION_TYPES.MOBILITY:
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        accent: 'text-green-600'
      };
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        accent: 'text-gray-600'
      };
  }
}

export function SessionCard({
  session,
  sessionType,
  isDeloadWeek = false,
  progressionCount = 0,
  onStart,
  disabled = false,
  completed = false
}) {
  if (!session) return null;

  const colors = getSessionColors(sessionType);
  const exerciseCount = session.exercises?.length || 0;

  // Completed state
  if (completed) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
          <div className="flex-1">
            <p className="font-bold" style={{ color: '#1E3A5F' }}>
              {session.name}
            </p>
            <p className="text-sm text-green-600">
              Completed today!
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${colors.border} ${colors.bg}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
          {getSessionIcon(sessionType)}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold" style={{ color: '#1E3A5F' }}>
              {session.name}
            </h3>
            {isDeloadWeek && (
              <Badge variant="warning">Deload</Badge>
            )}
          </div>

          {session.subtitle && (
            <p className="text-sm mb-2" style={{ color: '#6B7C93' }}>
              {session.subtitle}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm" style={{ color: '#6B7C93' }}>
            {session.duration && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {session.duration}
              </span>
            )}
            {exerciseCount > 0 && (
              <span>{exerciseCount} exercises</span>
            )}
          </div>

          {/* Progression badge */}
          {progressionCount > 0 && (
            <div className="mt-2">
              <ProgressionBadge count={progressionCount} />
            </div>
          )}
        </div>
      </div>

      {/* Start button */}
      <Button
        onClick={onStart}
        disabled={disabled}
        fullWidth
        className="mt-4"
      >
        Start Session
        <ChevronRight size={18} className="ml-1" />
      </Button>
    </Card>
  );
}

// Compact version for week overview
export function SessionCardCompact({
  session,
  sessionType,
  completed = false,
  isToday = false,
  onClick
}) {
  if (!session) return null;

  const colors = getSessionColors(sessionType);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        completed
          ? 'bg-green-50 border-green-200'
          : isToday
          ? `${colors.bg} ${colors.border} border-2`
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">
          {completed ? '✅' : session.isRestDay ? '😴' : getSessionIcon(sessionType)}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${
            completed ? 'text-green-700' : ''
          }`} style={{ color: completed ? undefined : '#1E3A5F' }}>
            {session.name}
          </p>
          {session.duration && !session.isRestDay && (
            <p className="text-xs" style={{ color: '#6B7C93' }}>
              {session.duration}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

export default SessionCard;
