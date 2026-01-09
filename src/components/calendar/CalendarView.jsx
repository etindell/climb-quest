import React, { useState } from 'react';
import {
  format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks,
  startOfMonth, endOfMonth, addMonths, subMonths, isSameMonth, isToday,
  isSameDay, isBefore
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, List, Plus, Play, Dumbbell, Zap, Leaf } from 'lucide-react';
import { PageContainer, PageSection } from '../layout';
import { Card, Button, Badge } from '../common';
import { TemplateManager } from './TemplateManager';
import { ScheduleModal } from './ScheduleModal';
import { TemplateEditor } from './TemplateEditor';
import { WeekOverview, DeloadIndicator } from '../program';
import { DEFAULT_WEEK_TEMPLATE, SESSION_TYPES, SESSIONS } from '../../data/program';
import { getWeekProgress } from '../../utils/programHelpers';

const WORKOUT_TYPE_COLORS = {
  technique: { backgroundColor: '#40E0D0' },
  strength: 'bg-orange-400',
  endurance: 'bg-green-500',
  mixed: 'bg-purple-500',
  rest: 'bg-gray-300',
  // Program session types
  strength1: 'bg-blue-500',
  strength2: 'bg-blue-500',
  miniA: 'bg-amber-400',
  miniB: 'bg-amber-400',
  mobility: 'bg-green-400'
};

// Get session type for a given day of week from program template
function getSessionForDayOfWeek(dayOfWeek, weekTemplate = DEFAULT_WEEK_TEMPLATE) {
  const dayConfig = weekTemplate.find(d => d.day === dayOfWeek);
  return dayConfig ? dayConfig.session : null;
}

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
      return null;
  }
}

function WeekView({ currentDate, workouts, scheduledWorkouts, onSelectDate, selectedDate }) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getWorkoutsForDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const completed = workouts.filter(w => w.date?.startsWith(dateStr));
    const scheduled = scheduledWorkouts?.filter(sw => sw.date === dateStr && !sw.completed) || [];
    return { completed, scheduled };
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map(day => {
        const { completed, scheduled } = getWorkoutsForDay(day);
        const hasWorkout = completed.length > 0 || scheduled.length > 0;
        const today = isToday(day);
        const isSelected = selectedDate && isSameDay(day, selectedDate);

        return (
          <button
            key={day.toISOString()}
            onClick={() => onSelectDate(day)}
            className={`
              p-2 rounded-xl text-center transition-all
              ${isSelected ? 'text-white' : ''}
              ${today && !isSelected ? 'ring-2 ring-teal-400' : ''}
              ${!hasWorkout && !isSelected && !today ? 'bg-white' : ''}
              hover:opacity-80
            `}
            style={
              isSelected
                ? { backgroundColor: '#40E0D0' }
                : hasWorkout && !isSelected
                  ? { backgroundColor: 'rgba(64, 224, 208, 0.1)' }
                  : undefined
            }
          >
            <p
              className={`text-xs ${isSelected ? 'text-white/80' : ''}`}
              style={!isSelected ? { color: '#6B7C93' } : undefined}
            >
              {format(day, 'EEE')}
            </p>
            <p
              className={`text-lg font-bold ${isSelected ? 'text-white' : ''}`}
              style={!isSelected ? (today ? { color: '#40E0D0' } : { color: '#1E3A5F' }) : undefined}
            >
              {format(day, 'd')}
            </p>
            {hasWorkout && !isSelected && (
              <div className="flex justify-center gap-0.5 mt-1">
                {completed.slice(0, 2).map((w, i) => (
                  <div
                    key={`c-${i}`}
                    className={`w-2 h-2 rounded-full ${typeof WORKOUT_TYPE_COLORS[w.type] === 'string' ? WORKOUT_TYPE_COLORS[w.type] : ''}`}
                    style={typeof WORKOUT_TYPE_COLORS[w.type] === 'object' ? WORKOUT_TYPE_COLORS[w.type] : (WORKOUT_TYPE_COLORS[w.type] ? undefined : WORKOUT_TYPE_COLORS.mixed)}
                  />
                ))}
                {scheduled.slice(0, 2 - completed.length).map((_, i) => (
                  <div
                    key={`s-${i}`}
                    className="w-2 h-2 rounded-full border-2 border-teal-400 bg-transparent"
                  />
                ))}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function MonthView({ currentDate, workouts, scheduledWorkouts, onSelectDate, selectedDate }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getWorkoutsForDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const completed = workouts.filter(w => w.date?.startsWith(dateStr));
    const scheduled = scheduledWorkouts?.filter(sw => sw.date === dateStr && !sw.completed) || [];
    return { completed, scheduled };
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs py-1" style={{ color: '#6B7C93' }}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const { completed, scheduled } = getWorkoutsForDay(day);
          const hasWorkout = completed.length > 0 || scheduled.length > 0;
          const today = isToday(day);
          const inMonth = isSameMonth(day, currentDate);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center
                transition-all text-sm
                ${!inMonth ? 'opacity-30' : ''}
                ${isSelected ? 'text-white' : ''}
                ${today && !isSelected ? 'ring-2 ring-teal-400' : ''}
                ${!hasWorkout && !today && !isSelected ? 'bg-white' : ''}
                hover:opacity-80
              `}
              style={
                isSelected
                  ? { backgroundColor: '#40E0D0' }
                  : (today && !isSelected) || (hasWorkout && !today && !isSelected)
                    ? { backgroundColor: 'rgba(64, 224, 208, 0.1)' }
                    : undefined
              }
            >
              <span
                className={isSelected ? 'text-white font-bold' : today ? 'font-bold' : ''}
                style={!isSelected ? (today ? { color: '#40E0D0' } : { color: '#1E3A5F' }) : undefined}
              >
                {format(day, 'd')}
              </span>
              {hasWorkout && !isSelected && (
                <div className="flex gap-0.5 mt-0.5">
                  {completed.slice(0, 2).map((w, i) => (
                    <div
                      key={`c-${i}`}
                      className={`w-1.5 h-1.5 rounded-full ${typeof WORKOUT_TYPE_COLORS[w.type] === 'string' ? WORKOUT_TYPE_COLORS[w.type] : ''}`}
                      style={typeof WORKOUT_TYPE_COLORS[w.type] === 'object' ? WORKOUT_TYPE_COLORS[w.type] : (WORKOUT_TYPE_COLORS[w.type] ? undefined : WORKOUT_TYPE_COLORS.mixed)}
                    />
                  ))}
                  {scheduled.length > 0 && completed.length < 2 && (
                    <div className="w-1.5 h-1.5 rounded-full border border-teal-400 bg-transparent" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CalendarView({
  appState,
  onScheduleWorkout,
  onDeleteTemplate,
  onSaveTemplate,
  onStartWorkout,
  onUnscheduleWorkout
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const { workouts, scheduledWorkouts, templates, program } = appState;

  // Get week progress if program is active
  const weekProgress = program?.isActive ? getWeekProgress(program) : null;

  const navigatePrev = () => {
    if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const handleScheduleTemplate = (template) => {
    setSelectedTemplate(template);
    setShowScheduleModal(true);
  };

  const handleConfirmSchedule = (date, templateId) => {
    if (onScheduleWorkout) {
      onScheduleWorkout(date, templateId);
    }
    setShowScheduleModal(false);
    setSelectedTemplate(null);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setShowTemplateEditor(true);
  };

  const handleDeleteTemplate = (templateId) => {
    if (onDeleteTemplate) {
      onDeleteTemplate(templateId);
    }
  };

  const handleDuplicateTemplate = (template) => {
    if (onSaveTemplate) {
      onSaveTemplate({
        ...template,
        id: undefined,
        name: `${template.name} (Copy)`,
        createdAt: new Date().toISOString()
      });
    }
  };

  const handleStartTemplate = (template) => {
    if (onStartWorkout) {
      onStartWorkout(template);
    }
  };

  const handleSaveTemplate = (templateData) => {
    if (onSaveTemplate) {
      onSaveTemplate(templateData);
    }
    setShowTemplateEditor(false);
    setEditingTemplate(null);
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowTemplateEditor(true);
  };

  // Get data for selected date
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const selectedDateWorkouts = selectedDate
    ? workouts.filter(w => w.date?.startsWith(selectedDateStr))
    : [];
  // Also get program session history for this date
  const selectedDateSessions = selectedDate && program?.sessionHistory
    ? program.sessionHistory.filter(s => s.date === selectedDateStr)
    : [];
  const selectedDateScheduled = selectedDate
    ? scheduledWorkouts?.filter(sw => sw.date === selectedDateStr && !sw.completed) || []
    : [];

  // Helper to get friendly name for session type
  const getSessionTypeName = (type) => {
    const names = {
      climb: 'Climbing Session',
      strength1: 'Strength Session 1',
      strength2: 'Strength Session 2',
      miniA: 'Mini Strength A',
      miniB: 'Mini Strength B',
      mobility: 'Mobility Session',
      technique: 'Technique',
      strength: 'Strength',
      endurance: 'Endurance',
      mixed: 'Mixed'
    };
    return names[type] || (type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Workout');
  };

  return (
    <PageContainer
      title="Plan"
      subtitle="Schedule your training"
      action={
        <Button size="sm" onClick={handleCreateTemplate}>
          <Plus size={16} />
        </Button>
      }
    >
      {/* Calendar Card */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={navigatePrev}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <h2 className="text-lg font-bold" style={{ color: '#1E3A5F' }}>
            {viewMode === 'week'
              ? `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 0 }), 'MMM d')}`
              : format(currentDate, 'MMMM yyyy')
            }
          </h2>

          <button
            onClick={navigateNext}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* View mode toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => setViewMode('week')}
            className={`
              flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all
              flex items-center justify-center gap-1
              ${viewMode === 'week'
                ? 'bg-white shadow-sm'
                : ''
              }
            `}
            style={viewMode === 'week' ? { color: '#1E3A5F' } : { color: '#6B7C93' }}
          >
            <List size={16} />
            Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`
              flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all
              flex items-center justify-center gap-1
              ${viewMode === 'month'
                ? 'bg-white shadow-sm'
                : ''
              }
            `}
            style={viewMode === 'month' ? { color: '#1E3A5F' } : { color: '#6B7C93' }}
          >
            <Calendar size={16} />
            Month
          </button>
        </div>

        {/* Calendar */}
        {viewMode === 'week' ? (
          <WeekView
            currentDate={currentDate}
            workouts={workouts}
            scheduledWorkouts={scheduledWorkouts}
            onSelectDate={handleSelectDate}
            selectedDate={selectedDate}
          />
        ) : (
          <MonthView
            currentDate={currentDate}
            workouts={workouts}
            scheduledWorkouts={scheduledWorkouts}
            onSelectDate={handleSelectDate}
            selectedDate={selectedDate}
          />
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#40E0D0' }} />
            <span className="text-xs" style={{ color: '#6B7C93' }}>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-teal-400 bg-transparent" />
            <span className="text-xs" style={{ color: '#6B7C93' }}>Scheduled</span>
          </div>
        </div>
      </Card>

      {/* Program Week Overview */}
      {weekProgress && (
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold" style={{ color: '#1E3A5F' }}>
                Training Week {weekProgress.currentWeek}
              </h3>
              <p className="text-sm" style={{ color: '#6B7C93' }}>
                Cycle {weekProgress.cycleNumber}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {weekProgress.isDeloadWeek && <DeloadIndicator />}
              <Badge variant="primary">
                {weekProgress.completedCount}/{weekProgress.totalRequired} sessions
              </Badge>
            </div>
          </div>

          {/* Session schedule (multi-session support) */}
          <div className="grid grid-cols-7 gap-1">
            {weekProgress.weekDays.map((day) => (
              <div
                key={day.dateStr}
                className={`text-center p-2 rounded-lg ${
                  day.isToday ? 'bg-teal-50 ring-1 ring-teal-200' :
                  day.allComplete ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                <p className="text-xs font-medium" style={{ color: '#6B7C93' }}>
                  {format(day.date, 'EEE')}
                </p>
                <div className="flex justify-center gap-0.5 my-1 min-h-[24px]">
                  {day.sessions?.map((s, idx) => (
                    <span key={idx} className="text-sm">
                      {s.completed ? '✅' : getSessionEmoji(s.sessionId)}
                    </span>
                  ))}
                  {day.isRestDay && <span className="text-lg">😴</span>}
                </div>
                <p className="text-xs" style={{ color: '#6B7C93' }}>
                  {day.isRestDay
                    ? 'Rest'
                    : day.sessions?.map(s =>
                        s.sessionId === SESSION_TYPES.STRENGTH_1 ? 'S1' :
                        s.sessionId === SESSION_TYPES.STRENGTH_2 ? 'S2' :
                        s.sessionId === SESSION_TYPES.MINI_A ? 'MA' :
                        s.sessionId === SESSION_TYPES.MINI_B ? 'MB' :
                        s.sessionId === SESSION_TYPES.MOBILITY ? 'Mob' :
                        s.sessionId === SESSION_TYPES.CLIMB ? 'Cl' : '?'
                      ).join('+')}
                </p>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-gray-100 text-xs flex-wrap" style={{ color: '#6B7C93' }}>
            <span>🧗 Climb</span>
            <span>💪 Strength</span>
            <span>⚡ Mini</span>
            <span>🧘 Mobility</span>
          </div>
        </Card>
      )}

      {/* Selected Date Details */}
      {selectedDate && (
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold" style={{ color: '#1E3A5F' }}>
              {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMM d')}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-sm hover:opacity-80"
              style={{ color: '#6B7C93' }}
            >
              Close
            </button>
          </div>

          {/* Completed workouts (from program sessions) */}
          {selectedDateSessions.length > 0 && (
            <div className="space-y-2 mb-3">
              <p className="text-xs font-medium uppercase" style={{ color: '#6B7C93' }}>Completed Sessions</p>
              {selectedDateSessions.map(session => (
                <div
                  key={session.id}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                >
                  <span className="text-xl">
                    {session.sessionType === 'climb' ? '🧗' :
                     session.sessionType === 'strength1' || session.sessionType === 'strength2' ? '💪' :
                     session.sessionType === 'miniA' || session.sessionType === 'miniB' ? '⚡' :
                     session.sessionType === 'mobility' ? '🧘' : '✅'}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: '#1E3A5F' }}>
                      {getSessionTypeName(session.sessionType)}
                    </p>
                    {session.notes && (
                      <p className="text-xs italic" style={{ color: '#6B7C93' }}>
                        "{session.notes}"
                      </p>
                    )}
                    <p className="text-xs" style={{ color: '#6B7C93' }}>
                      +{session.xpEarned || 0} XP
                    </p>
                  </div>
                  <Badge variant="success" size="sm">Done</Badge>
                </div>
              ))}
            </div>
          )}

          {/* Other completed workouts (non-program) */}
          {selectedDateWorkouts.filter(w => !w.programSession).length > 0 && (
            <div className="space-y-2 mb-3">
              <p className="text-xs font-medium uppercase" style={{ color: '#6B7C93' }}>Other Workouts</p>
              {selectedDateWorkouts.filter(w => !w.programSession).map(workout => (
                <div
                  key={workout.id}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${typeof WORKOUT_TYPE_COLORS[workout.type] === 'string' ? WORKOUT_TYPE_COLORS[workout.type] : ''}`}
                    style={typeof WORKOUT_TYPE_COLORS[workout.type] === 'object' ? WORKOUT_TYPE_COLORS[workout.type] : undefined}
                  />
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: '#1E3A5F' }}>
                      {getSessionTypeName(workout.type)}
                    </p>
                    <p className="text-xs" style={{ color: '#6B7C93' }}>
                      {workout.exercises?.length || 0} exercises
                    </p>
                  </div>
                  <Badge variant="success" size="sm">Done</Badge>
                </div>
              ))}
            </div>
          )}

          {/* Scheduled workouts */}
          {selectedDateScheduled.length > 0 && (
            <div className="space-y-2 mb-3">
              <p className="text-xs font-medium uppercase" style={{ color: '#6B7C93' }}>Scheduled</p>
              {selectedDateScheduled.map((scheduled, index) => {
                const template = templates.find(t => t.id === scheduled.templateId);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: 'rgba(64, 224, 208, 0.1)' }}
                  >
                    <div className="w-3 h-3 rounded-full border-2 border-teal-400" />
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: '#1E3A5F' }}>
                        {template?.name || 'Scheduled Workout'}
                      </p>
                      <p className="text-xs" style={{ color: '#6B7C93' }}>
                        ~{template?.estimatedMinutes || 30} min
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => template && handleStartTemplate(template)}
                    >
                      <Play size={14} className="mr-1" />
                      Start
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {selectedDateSessions.length === 0 && selectedDateWorkouts.length === 0 && selectedDateScheduled.length === 0 && (
            <div className="text-center py-4">
              <p style={{ color: '#6B7C93' }}>No workouts on this day</p>
              {!isBefore(selectedDate, new Date()) && templates.length > 0 && (
                <p className="text-sm mt-1" style={{ color: '#6B7C93' }}>
                  Schedule a workout from your templates below!
                </p>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Templates Section */}
      <PageSection
        title="Workout Templates"
        action={
          templates.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleCreateTemplate}>
              <Plus size={16} className="mr-1" />
              New
            </Button>
          )
        }
      >
        <TemplateManager
          templates={templates}
          onEdit={handleEditTemplate}
          onDelete={handleDeleteTemplate}
          onDuplicate={handleDuplicateTemplate}
          onSchedule={handleScheduleTemplate}
          onStart={handleStartTemplate}
        />
      </PageSection>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => { setShowScheduleModal(false); setSelectedTemplate(null); }}
        template={selectedTemplate}
        scheduledWorkouts={scheduledWorkouts}
        onSchedule={handleConfirmSchedule}
      />

      {/* Template Editor */}
      <TemplateEditor
        isOpen={showTemplateEditor}
        onClose={() => { setShowTemplateEditor(false); setEditingTemplate(null); }}
        template={editingTemplate}
        onSave={handleSaveTemplate}
      />
    </PageContainer>
  );
}

export default CalendarView;
