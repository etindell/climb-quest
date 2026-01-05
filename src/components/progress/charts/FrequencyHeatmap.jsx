import React from 'react';
import { format, subDays, startOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Card } from '../../common';

const INTENSITY_COLORS = [
  'bg-gray-100',      // 0 workouts
  'bg-[--color-primary]/30',  // 1 workout
  'bg-[--color-primary]/50',  // 2 workouts
  'bg-[--color-primary]/70',  // 3 workouts
  'bg-[--color-primary]',     // 4+ workouts
];

export function FrequencyHeatmap({ workouts, weeks = 12 }) {
  const today = new Date();
  const startDate = startOfWeek(subDays(today, weeks * 7), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: today });

  // Count workouts per day
  const workoutCounts = {};
  workouts.forEach(w => {
    if (w.date) {
      const dateKey = w.date.split('T')[0];
      workoutCounts[dateKey] = (workoutCounts[dateKey] || 0) + 1;
    }
  });

  // Group days by week
  const weekGroups = [];
  let currentWeek = [];
  days.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === days.length - 1) {
      weekGroups.push(currentWeek);
      currentWeek = [];
    }
  });

  // Calculate stats
  const totalWorkouts = workouts.length;
  const daysWithWorkouts = Object.keys(workoutCounts).length;
  const avgPerWeek = weeks > 0 ? (totalWorkouts / weeks).toFixed(1) : 0;

  return (
    <Card>
      <h3 className="font-semibold text-[--color-secondary] mb-4">Workout Activity</h3>

      {/* Stats row */}
      <div className="flex justify-around mb-4 text-center">
        <div>
          <p className="text-2xl font-bold text-[--color-secondary]">{totalWorkouts}</p>
          <p className="text-xs text-[--color-text-muted]">Total</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[--color-secondary]">{daysWithWorkouts}</p>
          <p className="text-xs text-[--color-text-muted]">Days Active</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[--color-secondary]">{avgPerWeek}</p>
          <p className="text-xs text-[--color-text-muted]">Avg/Week</p>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1" style={{ minWidth: `${weekGroups.length * 14}px` }}>
          {/* Day labels */}
          <div className="flex flex-col gap-1 text-[10px] text-[--color-text-muted] pr-1">
            <span className="h-3"></span>
            <span className="h-3">M</span>
            <span className="h-3"></span>
            <span className="h-3">W</span>
            <span className="h-3"></span>
            <span className="h-3">F</span>
            <span className="h-3"></span>
          </div>

          {weekGroups.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {/* Month label on first week of month */}
              <div className="h-3 text-[10px] text-[--color-text-muted]">
                {week[0] && format(week[0], 'd') <= 7 ? format(week[0], 'MMM') : ''}
              </div>
              {week.map((day, dayIndex) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const count = workoutCounts[dateKey] || 0;
                const colorIndex = Math.min(count, 4);
                const isToday = isSameDay(day, today);

                return (
                  <div
                    key={dayIndex}
                    className={`
                      w-3 h-3 rounded-sm ${INTENSITY_COLORS[colorIndex]}
                      ${isToday ? 'ring-1 ring-[--color-secondary]' : ''}
                    `}
                    title={`${format(day, 'MMM d, yyyy')}: ${count} workout${count !== 1 ? 's' : ''}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-[--color-text-muted]">
        <span>Less</span>
        {INTENSITY_COLORS.map((color, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
        ))}
        <span>More</span>
      </div>
    </Card>
  );
}

export default FrequencyHeatmap;
