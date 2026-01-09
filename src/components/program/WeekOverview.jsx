import React from 'react';
import { format, isToday } from 'date-fns';
import { Card } from '../common';
import { SESSION_TYPES, SESSIONS } from '../../data/program';

// Get emoji for session type
function getSessionEmoji(sessionType) {
  switch (sessionType) {
    case SESSION_TYPES.STRENGTH_1:
    case SESSION_TYPES.STRENGTH_2:
      return '💪';
    case SESSION_TYPES.MINI_A:
    case SESSION_TYPES.MINI_B:
      return '⚡';
    case SESSION_TYPES.MOBILITY:
      return '🧘';
    case SESSION_TYPES.REST:
      return '😴';
    case SESSION_TYPES.CLIMB:
    case SESSION_TYPES.CLIMB_EASY:
      return '🧗';
    default:
      return '📅';
  }
}

// Get short label for session
function getShortLabel(sessionType) {
  switch (sessionType) {
    case SESSION_TYPES.STRENGTH_1:
      return 'S1';
    case SESSION_TYPES.STRENGTH_2:
      return 'S2';
    case SESSION_TYPES.MINI_A:
      return 'MA';
    case SESSION_TYPES.MINI_B:
      return 'MB';
    case SESSION_TYPES.MOBILITY:
      return 'Mob';
    case SESSION_TYPES.REST:
      return 'Rest';
    case SESSION_TYPES.CLIMB:
    case SESSION_TYPES.CLIMB_EASY:
      return 'Climb';
    default:
      return '?';
  }
}

export function WeekOverview({
  weekProgress,
  onDayClick,
  compact = false
}) {
  const { weekDays, currentWeek, cycleNumber, isDeloadWeek } = weekProgress;

  if (compact) {
    // Ultra-compact horizontal strip with multi-session support
    return (
      <div className="flex items-center justify-between gap-1">
        {weekDays.map((day) => (
          <button
            key={day.dateStr}
            onClick={() => onDayClick && onDayClick(day)}
            className={`flex-1 py-2 px-1 rounded-lg text-center transition-all ${
              day.isToday
                ? 'bg-teal-100 ring-2 ring-teal-400'
                : day.allComplete
                ? 'bg-green-100'
                : day.isPast
                ? 'bg-gray-100'
                : 'bg-gray-50'
            }`}
          >
            <p className="text-xs font-medium" style={{ color: '#6B7C93' }}>
              {format(day.date, 'EEE').charAt(0)}
            </p>
            <div className="flex justify-center gap-0.5">
              {day.sessions?.map((s, idx) => (
                <span key={idx} className="text-sm">
                  {s.completed ? '✅' : getSessionEmoji(s.sessionId)}
                </span>
              ))}
              {(!day.sessions || day.sessions.length === 0) && (
                <span className="text-lg">😴</span>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold" style={{ color: '#1E3A5F' }}>
            Week {currentWeek}
          </h3>
          <p className="text-sm" style={{ color: '#6B7C93' }}>
            Cycle {cycleNumber}
            {isDeloadWeek && ' • Deload Week'}
          </p>
        </div>
        {isDeloadWeek && (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
            Recovery Week
          </span>
        )}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <button
            key={day.dateStr}
            onClick={() => onDayClick && onDayClick(day)}
            disabled={day.isFuture}
            className={`p-2 rounded-lg text-center transition-all ${
              day.isToday
                ? 'bg-teal-50 ring-2 ring-teal-400'
                : day.allComplete
                ? 'bg-green-50'
                : day.isPast
                ? 'bg-gray-50'
                : 'bg-white border border-gray-100'
            } ${day.isFuture ? 'opacity-50' : 'hover:bg-gray-50'}`}
          >
            {/* Day name */}
            <p className="text-xs font-medium mb-1" style={{ color: '#6B7C93' }}>
              {format(day.date, 'EEE')}
            </p>

            {/* Date number */}
            <p className={`text-sm font-bold mb-1 ${
              day.isToday ? 'text-teal-600' : ''
            }`} style={{ color: day.isToday ? undefined : '#1E3A5F' }}>
              {format(day.date, 'd')}
            </p>

            {/* Session indicators (multiple) */}
            <div className="flex justify-center gap-0.5 min-h-[28px]">
              {day.sessions?.map((s, idx) => (
                <span key={idx} className="text-base">
                  {s.completed ? '✅' : getSessionEmoji(s.sessionId)}
                </span>
              ))}
              {day.isRestDay && <span className="text-xl">😴</span>}
            </div>

            {/* Session labels */}
            <p className="text-xs mt-1" style={{ color: '#6B7C93' }}>
              {day.isRestDay
                ? 'Rest'
                : day.sessions?.map(s => getShortLabel(s.sessionId)).join('+')}
            </p>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-100 flex-wrap">
        <div className="flex items-center gap-1">
          <span>🧗</span>
          <span className="text-xs" style={{ color: '#6B7C93' }}>Climb</span>
        </div>
        <div className="flex items-center gap-1">
          <span>💪</span>
          <span className="text-xs" style={{ color: '#6B7C93' }}>Strength</span>
        </div>
        <div className="flex items-center gap-1">
          <span>⚡</span>
          <span className="text-xs" style={{ color: '#6B7C93' }}>Mini</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🧘</span>
          <span className="text-xs" style={{ color: '#6B7C93' }}>Mobility</span>
        </div>
        <div className="flex items-center gap-1">
          <span>✅</span>
          <span className="text-xs" style={{ color: '#6B7C93' }}>Done</span>
        </div>
      </div>
    </Card>
  );
}

export default WeekOverview;
