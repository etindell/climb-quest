import { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { Card, Button } from '../common';
import { DEFAULT_WEEK_TEMPLATE, AVAILABLE_SESSION_TYPES } from '../../data/program';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function ScheduleCustomizer({ currentTemplate, onSave, onCancel }) {
  const [schedule, setSchedule] = useState(() => {
    // Initialize from current template or default
    const template = currentTemplate || DEFAULT_WEEK_TEMPLATE;
    return template.map(day => ({
      ...day,
      sessions: day.sessions || [day.session] // Support old format
    }));
  });

  const toggleSession = (dayIndex, sessionId) => {
    setSchedule(prev => {
      const updated = [...prev];
      const day = { ...updated[dayIndex] };
      const sessions = [...day.sessions];

      if (sessions.includes(sessionId)) {
        // Remove session
        day.sessions = sessions.filter(s => s !== sessionId);
        // If no sessions left, add rest
        if (day.sessions.length === 0) {
          day.sessions = ['rest'];
        }
      } else {
        // Add session (remove rest if adding something else)
        if (sessionId !== 'rest') {
          day.sessions = sessions.filter(s => s !== 'rest');
          day.sessions.push(sessionId);
        } else {
          // If adding rest, clear other sessions
          day.sessions = ['rest'];
        }
      }

      // Update isClimbDay flag
      day.isClimbDay = day.sessions.includes('climb');

      // Update labels
      if (day.sessions.length === 1 && day.sessions[0] === 'rest') {
        day.label = 'Rest Day';
        day.description = 'Recovery day';
      } else {
        const sessionNames = day.sessions.map(s =>
          AVAILABLE_SESSION_TYPES.find(t => t.id === s)?.name || s
        );
        day.label = sessionNames.join(' + ');
        day.description = `${sessionNames.join(', ')}`;
      }

      updated[dayIndex] = day;
      return updated;
    });
  };

  const resetToDefault = () => {
    setSchedule(DEFAULT_WEEK_TEMPLATE.map(day => ({
      ...day,
      sessions: day.sessions || [day.session]
    })));
  };

  const handleSave = () => {
    onSave(schedule);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold" style={{ color: '#1E3A5F' }}>
            Customize Weekly Schedule
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {schedule.map((day, dayIndex) => (
            <Card key={day.day} padding="sm">
              <p className="font-semibold mb-3" style={{ color: '#1E3A5F' }}>
                {DAY_NAMES[day.day]}
              </p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SESSION_TYPES.map(session => {
                  const isSelected = day.sessions.includes(session.id);
                  return (
                    <button
                      key={session.id}
                      onClick={() => toggleSession(dayIndex, session.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {session.emoji} {session.name}
                    </button>
                  );
                })}
              </div>
              {day.sessions.length > 1 && (
                <p className="text-xs mt-2 text-gray-500">
                  {day.sessions.map(s => AVAILABLE_SESSION_TYPES.find(t => t.id === s)?.name).join(' + ')}
                </p>
              )}
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t space-y-3">
          <button
            onClick={resetToDefault}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={16} />
            Reset to Default
          </button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} fullWidth>
              Cancel
            </Button>
            <Button onClick={handleSave} fullWidth>
              Save Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleCustomizer;
