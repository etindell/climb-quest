import React, { useState, useEffect } from 'react';
import { Check, Trophy, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button, Badge } from '../common';

const RATING_EMOJIS = [
  { emoji: '😫', label: 'Tough' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '😊', label: 'Good' },
  { emoji: '🤩', label: 'Amazing!' }
];

// Track these exercises for PRs
const PR_TRACKABLE = {
  'pull-ups': { type: 'pullUps', unit: 'reps', label: 'Pull-ups' },
  'assisted-pull-ups': { type: 'pullUps', unit: 'reps', label: 'Assisted Pull-ups' },
  'dead-hang': { type: 'deadHang', unit: 'seconds', label: 'Dead Hang' },
  'plank': { type: 'plank', unit: 'seconds', label: 'Plank' },
  'plank-hold': { type: 'plank', unit: 'seconds', label: 'Plank Hold' }
};

export function DetailedLog({ workout, personalRecords = {}, onComplete, onClose }) {
  const [exerciseLogs, setExerciseLogs] = useState({});
  const [rating, setRating] = useState(null);
  const [notes, setNotes] = useState('');
  const [detectedPRs, setDetectedPRs] = useState([]);
  const [showAllExercises, setShowAllExercises] = useState(false);

  const exercises = workout.exercises || [];

  // Initialize exercise logs
  useEffect(() => {
    const initialLogs = {};
    exercises.forEach(ex => {
      initialLogs[ex.id] = {
        completed: false,
        value: ex.trackingType === 'duration' ? ex.defaultDuration || 30 : ex.defaultReps || 10,
        sets: ex.defaultSets || 1
      };
    });
    setExerciseLogs(initialLogs);
  }, []);

  // Check for PRs when values change
  useEffect(() => {
    const newPRs = [];

    Object.entries(exerciseLogs).forEach(([exerciseId, log]) => {
      if (!log.completed) return;

      const trackable = PR_TRACKABLE[exerciseId];
      if (!trackable) return;

      const currentRecords = personalRecords[trackable.type] || [];
      const currentMax = currentRecords.length > 0
        ? Math.max(...currentRecords.map(r => r.value))
        : 0;

      if (log.value > currentMax) {
        const exercise = exercises.find(e => e.id === exerciseId);
        newPRs.push({
          exerciseId,
          type: trackable.type,
          value: log.value,
          label: exercise?.name || trackable.label,
          unit: trackable.unit,
          previousBest: currentMax || null
        });
      }
    });

    setDetectedPRs(newPRs);
  }, [exerciseLogs, personalRecords, exercises]);

  const updateExercise = (exerciseId, updates) => {
    setExerciseLogs(prev => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], ...updates }
    }));
  };

  const completedCount = Object.values(exerciseLogs).filter(l => l.completed).length;
  const status = completedCount === 0 ? 'skipped'
    : completedCount === exercises.length ? 'completed'
    : 'partial';

  const handleSubmit = () => {
    onComplete({
      status,
      rating,
      notes: notes.trim() || null,
      exerciseLogs,
      detectedPRs,
      completedAt: new Date().toISOString()
    });
  };

  // Separate PR-trackable exercises
  const prTrackableExercises = exercises.filter(ex => PR_TRACKABLE[ex.id]);
  const otherExercises = exercises.filter(ex => !PR_TRACKABLE[ex.id]);

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      {/* Header */}
      <div className="text-center sticky top-0 bg-white pb-2 z-10">
        <h2 className="text-xl font-bold" style={{ color: '#1E3A5F' }}>
          Log Your Workout
        </h2>
        <p className="text-sm" style={{ color: '#6B7C93' }}>
          {completedCount}/{exercises.length} exercises done
        </p>
      </div>

      {/* PR Alert */}
      {detectedPRs.length > 0 && (
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-4 border-2 border-amber-300">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="text-amber-500" size={24} />
            <span className="font-bold text-amber-700">New Personal Record{detectedPRs.length > 1 ? 's' : ''}!</span>
          </div>
          <div className="space-y-1">
            {detectedPRs.map(pr => (
              <div key={pr.exerciseId} className="flex items-center gap-2 text-sm">
                <Zap className="text-amber-500" size={16} />
                <span className="font-medium text-amber-800">
                  {pr.label}: {pr.value} {pr.unit}
                </span>
                {pr.previousBest && (
                  <span className="text-amber-600">
                    (was {pr.previousBest})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PR Trackable Exercises (always shown) */}
      {prTrackableExercises.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2" style={{ color: '#1E3A5F' }}>
            <Trophy size={16} className="text-amber-500" />
            PR-Trackable Exercises
          </h3>
          {prTrackableExercises.map(exercise => (
            <ExerciseLogCard
              key={exercise.id}
              exercise={exercise}
              log={exerciseLogs[exercise.id]}
              onChange={(updates) => updateExercise(exercise.id, updates)}
              isPRCandidate={detectedPRs.some(pr => pr.exerciseId === exercise.id)}
            />
          ))}
        </div>
      )}

      {/* Other Exercises (collapsible) */}
      {otherExercises.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setShowAllExercises(!showAllExercises)}
            className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
            style={{ color: '#1E3A5F' }}
          >
            <span className="font-semibold">Other Exercises ({otherExercises.length})</span>
            {showAllExercises ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showAllExercises && (
            <div className="space-y-2">
              {otherExercises.map(exercise => (
                <ExerciseLogCard
                  key={exercise.id}
                  exercise={exercise}
                  log={exerciseLogs[exercise.id]}
                  onChange={(updates) => updateExercise(exercise.id, updates)}
                  compact
                />
              ))}
            </div>
          )}

          {!showAllExercises && (
            <div className="flex flex-wrap gap-2">
              {otherExercises.map(exercise => (
                <button
                  key={exercise.id}
                  onClick={() => updateExercise(exercise.id, { completed: !exerciseLogs[exercise.id]?.completed })}
                  className={`
                    px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-all
                    ${exerciseLogs[exercise.id]?.completed
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                    }
                  `}
                >
                  <span>{exercise.emoji}</span>
                  <span className="font-medium">{exercise.name}</span>
                  {exerciseLogs[exercise.id]?.completed && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rating */}
      <Card>
        <p className="font-semibold mb-3" style={{ color: '#1E3A5F' }}>
          How did it feel overall?
        </p>
        <div className="flex justify-around">
          {RATING_EMOJIS.map(({ emoji, label }) => (
            <button
              key={emoji}
              onClick={() => setRating(emoji)}
              className={`
                flex flex-col items-center p-2 rounded-lg transition-all
                ${rating === emoji
                  ? 'scale-110'
                  : 'hover:bg-gray-50'
                }
              `}
              style={rating === emoji ? { backgroundColor: 'rgba(64, 224, 208, 0.2)' } : {}}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs mt-1" style={{ color: '#6B7C93' }}>{label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Notes */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional) - Any highlights or things to remember?"
        className="w-full p-3 border border-gray-200 rounded-xl resize-none
                   focus:ring-2 focus:ring-teal-400 focus:border-transparent
                   outline-none"
        style={{ color: '#1E3A5F' }}
        rows={2}
      />

      {/* Submit */}
      <div className="flex gap-3 sticky bottom-0 bg-white pt-2">
        <Button variant="ghost" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="flex-1">
          {detectedPRs.length > 0 && '🏆 '}
          Save Workout
        </Button>
      </div>
    </div>
  );
}

function ExerciseLogCard({ exercise, log, onChange, isPRCandidate, compact }) {
  if (!log) return null;

  const isDuration = exercise.trackingType === 'duration';

  if (compact) {
    return (
      <div className={`
        p-3 rounded-xl border-2 transition-all
        ${log.completed ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChange({ completed: !log.completed })}
              className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center
                ${log.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}
              `}
            >
              {log.completed && <Check size={14} />}
            </button>
            <span className="text-lg">{exercise.emoji}</span>
            <span className="font-medium" style={{ color: '#1E3A5F' }}>{exercise.name}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      p-4 rounded-xl border-2 transition-all
      ${isPRCandidate ? 'border-amber-300 bg-amber-50' : ''}
      ${log.completed && !isPRCandidate ? 'border-green-300 bg-green-50' : ''}
      ${!log.completed && !isPRCandidate ? 'border-gray-200 bg-white' : ''}
    `}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange({ completed: !log.completed })}
            className={`
              w-7 h-7 rounded-full border-2 flex items-center justify-center
              ${log.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}
            `}
          >
            {log.completed && <Check size={16} />}
          </button>
          <span className="text-xl">{exercise.emoji}</span>
          <span className="font-semibold" style={{ color: '#1E3A5F' }}>{exercise.name}</span>
        </div>
        {isPRCandidate && (
          <Badge variant="celebration" size="sm">
            <Trophy size={12} className="mr-1" /> PR!
          </Badge>
        )}
      </div>

      {log.completed && (
        <div className="flex items-center gap-4 ml-9">
          <div>
            <label className="text-xs block mb-1" style={{ color: '#6B7C93' }}>Sets</label>
            <input
              type="number"
              min="1"
              max="10"
              value={log.sets}
              onChange={(e) => onChange({ sets: parseInt(e.target.value) || 1 })}
              className="w-16 p-2 text-center border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-xs block mb-1" style={{ color: '#6B7C93' }}>
              {isDuration ? 'Seconds' : 'Reps'}
            </label>
            <input
              type="number"
              min="1"
              max={isDuration ? 300 : 100}
              value={log.value}
              onChange={(e) => onChange({ value: parseInt(e.target.value) || 1 })}
              className="w-20 p-2 text-center border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            />
          </div>
          {isDuration && (
            <div className="flex gap-1">
              {[15, 30, 45, 60].map(sec => (
                <button
                  key={sec}
                  onClick={() => onChange({ value: sec })}
                  className={`
                    px-2 py-1 rounded text-xs font-medium
                    ${log.value === sec ? 'text-white' : 'bg-gray-100'}
                  `}
                  style={log.value === sec ? { backgroundColor: '#40E0D0' } : {}}
                >
                  {sec}s
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DetailedLog;
