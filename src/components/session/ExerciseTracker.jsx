import React, { useState } from 'react';
import { Check, Minus, Plus, AlertTriangle } from 'lucide-react';
import { Card, Button, Badge } from '../common';
import { ProgressionIndicator } from './ProgressionIndicator';

export function ExerciseTracker({
  exercise,
  exerciseNumber,
  totalExercises,
  isDeloadWeek = false,
  existingLog,
  onComplete,
  progressionStatus
}) {
  const targetSets = isDeloadWeek && exercise.deloadOriginalSets
    ? exercise.sets
    : exercise.sets || 1;

  const [setLogs, setSetLogs] = useState(
    existingLog?.setLogs ||
    Array(targetSets).fill(null).map(() => ({
      completed: false,
      reps: exercise.reps || exercise.repsMin || 0,
      duration: exercise.durationMin || 0,
      struggled: false
    }))
  );
  const [notes, setNotes] = useState(existingLog?.notes || '');
  const [struggled, setStruggled] = useState(existingLog?.struggled || false);

  const completedSets = setLogs.filter(s => s.completed).length;
  const allSetsComplete = completedSets === targetSets;

  // Get rep/duration display
  const getTargetDisplay = () => {
    if (exercise.repsMin && exercise.repsMax) {
      return `${exercise.repsMin}-${exercise.repsMax} reps`;
    }
    if (exercise.reps) {
      return `${exercise.reps} reps${exercise.perSide ? '/side' : ''}`;
    }
    if (exercise.durationMin && exercise.durationMax) {
      return `${exercise.durationMin}-${exercise.durationMax} ${exercise.unit || 'sec'}`;
    }
    if (exercise.duration) {
      return `${exercise.duration} ${exercise.unit || 'sec'}`;
    }
    return '';
  };

  // Toggle set completion
  const toggleSet = (index) => {
    setSetLogs(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        completed: !updated[index].completed
      };
      return updated;
    });
  };

  // Update reps for a set
  const updateSetReps = (index, delta) => {
    setSetLogs(prev => {
      const updated = [...prev];
      const newReps = Math.max(0, (updated[index].reps || 0) + delta);
      updated[index] = {
        ...updated[index],
        reps: newReps
      };
      return updated;
    });
  };

  // Update duration for a set
  const updateSetDuration = (index, delta) => {
    setSetLogs(prev => {
      const updated = [...prev];
      const newDuration = Math.max(0, (updated[index].duration || 0) + delta);
      updated[index] = {
        ...updated[index],
        duration: newDuration
      };
      return updated;
    });
  };

  // Handle completion
  const handleComplete = () => {
    const logData = {
      setLogs,
      notes,
      struggled,
      allSetsClean: !struggled && allSetsComplete,
      avgReps: setLogs.reduce((sum, s) => sum + (s.reps || 0), 0) / setLogs.length,
      avgDuration: setLogs.reduce((sum, s) => sum + (s.duration || 0), 0) / setLogs.length,
      totalSets: targetSets,
      completedSets
    };

    if (onComplete) {
      onComplete(logData);
    }
  };

  // Finisher exercise (just mark done)
  if (exercise.isFinisher || exercise.trackingType === 'completion') {
    return (
      <Card className="border-2 border-teal-200">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl">{exercise.emoji || '✨'}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline">
                {exerciseNumber}/{totalExercises}
              </Badge>
              {exercise.priority && (
                <span className="text-xs font-medium" style={{ color: '#6B7C93' }}>
                  {exercise.priority})
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold" style={{ color: '#1E3A5F' }}>
              {exercise.name}
            </h3>
            <p className="text-sm" style={{ color: '#40E0D0' }}>
              {exercise.duration} {exercise.unit}
            </p>
          </div>
        </div>

        {exercise.notes && (
          <div className="bg-amber-50 rounded-lg p-3 mb-4">
            <p className="text-sm" style={{ color: '#92400E' }}>
              {exercise.notes}
            </p>
          </div>
        )}

        <Button onClick={handleComplete} fullWidth>
          <Check size={18} className="mr-2" />
          Done with {exercise.name}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-teal-200">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl">{exercise.emoji || '💪'}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">
              {exerciseNumber}/{totalExercises}
            </Badge>
            {exercise.priority && (
              <span className="text-xs font-medium" style={{ color: '#6B7C93' }}>
                {exercise.priority})
              </span>
            )}
            {isDeloadWeek && exercise.deloadOriginalSets && (
              <Badge variant="warning">Deload</Badge>
            )}
          </div>
          <h3 className="text-lg font-bold" style={{ color: '#1E3A5F' }}>
            {exercise.name}
          </h3>
          <p className="text-sm" style={{ color: '#40E0D0' }}>
            {targetSets} sets × {getTargetDisplay()}
          </p>
        </div>
      </div>

      {/* Progression indicator */}
      {progressionStatus && (
        <ProgressionIndicator status={progressionStatus} />
      )}

      {/* Notes/Tips */}
      {exercise.notes && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <p className="text-sm" style={{ color: '#1E40AF' }}>
            💡 {exercise.notes}
          </p>
        </div>
      )}

      {/* Set tracking */}
      <div className="space-y-3 mb-4">
        {setLogs.map((set, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              set.completed ? 'bg-teal-50' : 'bg-gray-50'
            }`}
          >
            {/* Set number & checkbox */}
            <button
              onClick={() => toggleSet(idx)}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
                set.completed
                  ? 'bg-teal-500 text-white'
                  : 'bg-white border-2 border-gray-300 text-gray-500'
              }`}
            >
              {set.completed ? <Check size={16} /> : idx + 1}
            </button>

            {/* Rep/Duration counter */}
            <div className="flex-1 flex items-center justify-center gap-3">
              {exercise.trackingType === 'duration' ? (
                <>
                  <button
                    onClick={() => updateSetDuration(idx, -5)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="text-center min-w-[60px]">
                    <span className="text-xl font-bold" style={{ color: '#1E3A5F' }}>
                      {set.duration}
                    </span>
                    <span className="text-sm ml-1" style={{ color: '#6B7C93' }}>
                      {exercise.unit || 'sec'}
                    </span>
                  </div>
                  <button
                    onClick={() => updateSetDuration(idx, 5)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => updateSetReps(idx, -1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="text-center min-w-[60px]">
                    <span className="text-xl font-bold" style={{ color: '#1E3A5F' }}>
                      {set.reps}
                    </span>
                    <span className="text-sm ml-1" style={{ color: '#6B7C93' }}>
                      reps
                    </span>
                  </div>
                  <button
                    onClick={() => updateSetReps(idx, 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Rest info */}
            {!set.completed && exercise.restSeconds && (
              <span className="text-xs" style={{ color: '#6B7C93' }}>
                {exercise.restSeconds}s rest
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Struggled toggle */}
      <div className="mb-4">
        <button
          onClick={() => setStruggled(!struggled)}
          className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
            struggled
              ? 'border-amber-400 bg-amber-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <AlertTriangle size={18} className={struggled ? 'text-amber-500' : 'text-gray-400'} />
          <span className={`text-sm font-medium ${struggled ? 'text-amber-700' : 'text-gray-500'}`}>
            {struggled ? 'This was hard' : 'Mark if this felt hard'}
          </span>
        </button>
        <p className="text-xs text-center mt-1" style={{ color: '#6B7C93' }}>
          Helps track when you're ready to progress
        </p>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Quick notes (optional)"
          className="w-full p-2 text-sm border rounded-lg"
          style={{ borderColor: '#E5E7EB' }}
        />
      </div>

      {/* Complete button */}
      <Button
        onClick={handleComplete}
        fullWidth
        disabled={completedSets === 0}
      >
        <Check size={18} className="mr-2" />
        {allSetsComplete ? 'Exercise Complete' : `Done (${completedSets}/${targetSets} sets)`}
      </Button>
    </Card>
  );
}

export default ExerciseTracker;
