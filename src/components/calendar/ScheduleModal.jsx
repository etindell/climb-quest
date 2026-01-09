import React, { useState } from 'react';
import { format, addDays, startOfWeek, eachDayOfInterval, isToday, isBefore } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Modal, Button, Badge } from '../common';

export function ScheduleModal({ isOpen, onClose, template, scheduledWorkouts, onSchedule }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: addDays(currentWeekStart, 6)
  });

  const navigatePrev = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const navigateNext = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const handleSchedule = () => {
    if (!selectedDate) return;
    onSchedule(format(selectedDate, 'yyyy-MM-dd'), template.id);
    onClose();
  };

  // Check for consecutive workout days
  const getWorkoutWarning = (date) => {
    if (!selectedDate) return null;

    const dateStr = format(date, 'yyyy-MM-dd');
    const existingWorkouts = scheduledWorkouts?.filter(sw => {
      const swDate = new Date(sw.date);
      const dayDiff = Math.abs((swDate - date) / (1000 * 60 * 60 * 24));
      return dayDiff <= 1 && dayDiff > 0;
    }) || [];

    // Count consecutive days including selected
    let consecutiveDays = 1;
    for (let i = 1; i <= 5; i++) {
      const checkDate = format(addDays(date, -i), 'yyyy-MM-dd');
      if (scheduledWorkouts?.some(sw => sw.date === checkDate)) {
        consecutiveDays++;
      } else break;
    }
    for (let i = 1; i <= 5; i++) {
      const checkDate = format(addDays(date, i), 'yyyy-MM-dd');
      if (scheduledWorkouts?.some(sw => sw.date === checkDate)) {
        consecutiveDays++;
      } else break;
    }

    if (consecutiveDays >= 5) {
      return 'This would be 5+ days in a row! Consider adding a rest day.';
    }
    return null;
  };

  const warning = selectedDate ? getWorkoutWarning(selectedDate) : null;

  const hasWorkoutOnDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return scheduledWorkouts?.some(sw => sw.date === dateStr);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Workout" size="md">
      <div className="space-y-4">
        {/* Template Info */}
        {template && (
          <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(64, 224, 208, 0.1)' }}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-bold" style={{ color: '#1E3A5F' }}>{template.name}</p>
                <p className="text-sm" style={{ color: '#6B7C93' }}>
                  ~{template.estimatedMinutes} min • {template.exercises?.length || 0} exercises
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={navigatePrev}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold" style={{ color: '#1E3A5F' }}>
            {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
          </span>
          <button
            onClick={navigateNext}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day Selection */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => {
            const isPast = isBefore(day, new Date()) && !isToday(day);
            const hasWorkout = hasWorkoutOnDay(day);
            const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');

            return (
              <button
                key={day.toISOString()}
                onClick={() => !isPast && setSelectedDate(day)}
                disabled={isPast}
                className={`
                  p-3 rounded-xl text-center transition-all
                  ${isPast ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}
                  ${isSelected ? 'text-white' : ''}
                  ${isToday(day) && !isSelected ? 'ring-2 ring-teal-400' : ''}
                  ${hasWorkout && !isSelected ? 'bg-orange-100' : ''}
                `}
                style={isSelected ? { backgroundColor: '#40E0D0' } : undefined}
              >
                <p className="text-xs font-medium mb-1">
                  {format(day, 'EEE')}
                </p>
                <p
                  className={`text-lg font-bold ${isSelected ? '' : ''}`}
                  style={!isSelected ? { color: '#1E3A5F' } : undefined}
                >
                  {format(day, 'd')}
                </p>
                {hasWorkout && !isSelected && (
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mx-auto mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Warning */}
        {warning && (
          <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-yellow-800">{warning}</p>
          </div>
        )}

        {/* Selected Date */}
        {selectedDate && (
          <div className="text-center">
            <p className="text-sm" style={{ color: '#6B7C93' }}>Selected:</p>
            <p className="font-bold" style={{ color: '#1E3A5F' }}>
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={!selectedDate}
            className="flex-1"
          >
            <Calendar size={18} className="mr-2" />
            Schedule
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ScheduleModal;
