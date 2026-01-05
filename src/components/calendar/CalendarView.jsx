import React, { useState } from 'react';
import {
  format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks,
  startOfMonth, endOfMonth, addMonths, subMonths, isSameMonth, isToday,
  isSameDay, isBefore
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, List, Plus, Play } from 'lucide-react';
import { PageContainer, PageSection } from '../layout';
import { Card, Button, Badge } from '../common';
import { TemplateManager } from './TemplateManager';
import { ScheduleModal } from './ScheduleModal';
import { TemplateEditor } from './TemplateEditor';

const WORKOUT_TYPE_COLORS = {
  technique: 'bg-[--color-primary]',
  strength: 'bg-orange-400',
  endurance: 'bg-green-500',
  mixed: 'bg-purple-500',
  rest: 'bg-gray-300'
};

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
              ${isSelected ? 'bg-[--color-primary] text-white' : ''}
              ${today && !isSelected ? 'ring-2 ring-[--color-primary]' : ''}
              ${hasWorkout && !isSelected ? 'bg-[--color-primary]/10' : ''}
              ${!hasWorkout && !isSelected && !today ? 'bg-white' : ''}
              hover:opacity-80
            `}
          >
            <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-[--color-text-muted]'}`}>
              {format(day, 'EEE')}
            </p>
            <p className={`text-lg font-bold ${isSelected ? 'text-white' : today ? 'text-[--color-primary]' : 'text-[--color-secondary]'}`}>
              {format(day, 'd')}
            </p>
            {hasWorkout && !isSelected && (
              <div className="flex justify-center gap-0.5 mt-1">
                {completed.slice(0, 2).map((w, i) => (
                  <div
                    key={`c-${i}`}
                    className={`w-2 h-2 rounded-full ${WORKOUT_TYPE_COLORS[w.type] || WORKOUT_TYPE_COLORS.mixed}`}
                  />
                ))}
                {scheduled.slice(0, 2 - completed.length).map((_, i) => (
                  <div
                    key={`s-${i}`}
                    className="w-2 h-2 rounded-full border-2 border-[--color-primary] bg-transparent"
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
          <div key={day} className="text-center text-xs text-[--color-text-muted] py-1">
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
                ${isSelected ? 'bg-[--color-primary] text-white' : ''}
                ${today && !isSelected ? 'ring-2 ring-[--color-primary] bg-[--color-primary]/10' : ''}
                ${hasWorkout && !today && !isSelected ? 'bg-[--color-primary]/10' : ''}
                ${!hasWorkout && !today && !isSelected ? 'bg-white' : ''}
                hover:opacity-80
              `}
            >
              <span className={isSelected ? 'text-white font-bold' : today ? 'font-bold text-[--color-primary]' : 'text-[--color-secondary]'}>
                {format(day, 'd')}
              </span>
              {hasWorkout && !isSelected && (
                <div className="flex gap-0.5 mt-0.5">
                  {completed.slice(0, 2).map((w, i) => (
                    <div
                      key={`c-${i}`}
                      className={`w-1.5 h-1.5 rounded-full ${WORKOUT_TYPE_COLORS[w.type] || WORKOUT_TYPE_COLORS.mixed}`}
                    />
                  ))}
                  {scheduled.length > 0 && completed.length < 2 && (
                    <div className="w-1.5 h-1.5 rounded-full border border-[--color-primary] bg-transparent" />
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

  const { workouts, scheduledWorkouts, templates } = appState;

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
  const selectedDateScheduled = selectedDate
    ? scheduledWorkouts?.filter(sw => sw.date === selectedDateStr && !sw.completed) || []
    : [];

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

          <h2 className="text-lg font-bold text-[--color-secondary]">
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
                ? 'bg-white text-[--color-secondary] shadow-sm'
                : 'text-[--color-text-muted]'
              }
            `}
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
                ? 'bg-white text-[--color-secondary] shadow-sm'
                : 'text-[--color-text-muted]'
              }
            `}
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
            <div className="w-2.5 h-2.5 rounded-full bg-[--color-primary]" />
            <span className="text-xs text-[--color-text-muted]">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-[--color-primary] bg-transparent" />
            <span className="text-xs text-[--color-text-muted]">Scheduled</span>
          </div>
        </div>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[--color-secondary]">
              {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMM d')}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-[--color-text-muted] text-sm hover:text-[--color-secondary]"
            >
              Close
            </button>
          </div>

          {/* Completed workouts */}
          {selectedDateWorkouts.length > 0 && (
            <div className="space-y-2 mb-3">
              <p className="text-xs font-medium text-[--color-text-muted] uppercase">Completed</p>
              {selectedDateWorkouts.map(workout => (
                <div
                  key={workout.id}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                >
                  <div className={`w-3 h-3 rounded-full ${WORKOUT_TYPE_COLORS[workout.type] || WORKOUT_TYPE_COLORS.mixed}`} />
                  <div className="flex-1">
                    <p className="font-medium text-[--color-secondary]">
                      {workout.type ? workout.type.charAt(0).toUpperCase() + workout.type.slice(1) : 'Workout'}
                    </p>
                    <p className="text-xs text-[--color-text-muted]">
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
              <p className="text-xs font-medium text-[--color-text-muted] uppercase">Scheduled</p>
              {selectedDateScheduled.map((scheduled, index) => {
                const template = templates.find(t => t.id === scheduled.templateId);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-[--color-primary]/10 rounded-lg"
                  >
                    <div className="w-3 h-3 rounded-full border-2 border-[--color-primary]" />
                    <div className="flex-1">
                      <p className="font-medium text-[--color-secondary]">
                        {template?.name || 'Scheduled Workout'}
                      </p>
                      <p className="text-xs text-[--color-text-muted]">
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
          {selectedDateWorkouts.length === 0 && selectedDateScheduled.length === 0 && (
            <div className="text-center py-4">
              <p className="text-[--color-text-muted]">No workouts on this day</p>
              {!isBefore(selectedDate, new Date()) && templates.length > 0 && (
                <p className="text-sm text-[--color-text-muted] mt-1">
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
