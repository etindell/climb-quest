import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Clock, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Card, Button, Badge, ProgressBar } from '../common';
import { ExerciseTracker } from './ExerciseTracker';
import { RestTimer } from './RestTimer';
import { WARMUP_ROUTINE } from '../../data/program';

export function SessionView({
  session,
  isDeloadWeek = false,
  onComplete,
  onCancel,
  onUpdateExerciseProgress
}) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState({});
  const [showWarmup, setShowWarmup] = useState(session?.includeWarmup || false);
  const [warmupComplete, setWarmupComplete] = useState(!session?.includeWarmup);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(60);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionRating, setSessionRating] = useState(null);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);

  const exercises = session?.exercises || [];
  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;

  // Calculate progress
  const completedExercises = Object.values(exerciseLogs).filter(log => log.completed).length;
  const progressPercent = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  // Handle exercise completion
  const handleExerciseComplete = (exerciseId, logData) => {
    setExerciseLogs(prev => ({
      ...prev,
      [exerciseId]: {
        ...logData,
        completed: true,
        completedAt: new Date().toISOString()
      }
    }));

    // Log progression data
    if (onUpdateExerciseProgress) {
      onUpdateExerciseProgress(exerciseId, logData);
    }

    // Show rest timer if not the last exercise and not a finisher
    const exercise = exercises.find(e => e.id === exerciseId);
    if (currentExerciseIndex < totalExercises - 1 && !exercise?.isFinisher) {
      setRestDuration(exercise?.restSeconds || 60);
      setShowRestTimer(true);
    } else if (currentExerciseIndex >= totalExercises - 1) {
      // All exercises done, show completion
      setShowCompletionScreen(true);
    }
  };

  // Move to next exercise
  const handleNextExercise = () => {
    setShowRestTimer(false);
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setShowCompletionScreen(true);
    }
  };

  // Handle session completion
  const handleFinishSession = () => {
    if (onComplete) {
      onComplete({
        exerciseLogs,
        notes: sessionNotes,
        rating: sessionRating,
        detailedLog: Object.keys(exerciseLogs).length > 0,
        completedAt: new Date().toISOString()
      });
    }
  };

  // Completion screen
  if (showCompletionScreen) {
    return (
      <div className="min-h-screen p-4" style={{ backgroundColor: '#F0FAFA' }}>
        <Card className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1E3A5F' }}>
            Session Complete!
          </h2>
          <p className="mb-6" style={{ color: '#6B7C93' }}>
            Great work on {session.name}
          </p>

          {/* Rating */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
              How did it feel?
            </p>
            <div className="flex justify-center gap-2">
              {['😫', '😓', '💪', '🔥', '🚀'].map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => setSessionRating(emoji)}
                  className={`text-3xl p-2 rounded-lg transition-all ${
                    sessionRating === emoji
                      ? 'bg-teal-100 scale-110'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6 px-4">
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Any notes about this session? (optional)"
              className="w-full p-3 border rounded-lg resize-none"
              rows={3}
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>

          {/* Stats summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 mx-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold" style={{ color: '#40E0D0' }}>
                  {completedExercises}
                </p>
                <p className="text-sm" style={{ color: '#6B7C93' }}>Exercises</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#40E0D0' }}>
                  {session.duration || '~30 min'}
                </p>
                <p className="text-sm" style={{ color: '#6B7C93' }}>Duration</p>
              </div>
            </div>
          </div>

          <Button onClick={handleFinishSession} fullWidth size="lg">
            <Check size={20} className="mr-2" />
            Save & Finish
          </Button>
        </Card>
      </div>
    );
  }

  // Rest timer overlay
  if (showRestTimer) {
    return (
      <RestTimer
        duration={restDuration}
        onComplete={handleNextExercise}
        onSkip={handleNextExercise}
        nextExercise={exercises[currentExerciseIndex + 1]}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0FAFA' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onCancel}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} className="mr-1" />
              <span className="text-sm">Exit</span>
            </button>
            <div className="text-right">
              <Badge variant={isDeloadWeek ? 'warning' : 'primary'}>
                {isDeloadWeek ? 'Deload Week' : session.name}
              </Badge>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <ProgressBar value={progressPercent} max={100} size="sm" />
            <span className="text-sm font-medium" style={{ color: '#6B7C93' }}>
              {completedExercises}/{totalExercises}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 pb-24">
        {/* Warmup section (collapsible) */}
        {session?.includeWarmup && (
          <Card className="mb-4">
            <button
              onClick={() => setShowWarmup(!showWarmup)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <div className="text-left">
                  <p className="font-semibold" style={{ color: '#1E3A5F' }}>
                    Warmup
                  </p>
                  <p className="text-xs" style={{ color: '#6B7C93' }}>
                    {WARMUP_ROUTINE.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {warmupComplete && (
                  <Badge variant="success">Done</Badge>
                )}
                {showWarmup ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>

            {showWarmup && (
              <div className="mt-4 pt-4 border-t">
                <ul className="space-y-2">
                  {WARMUP_ROUTINE.exercises.map((exercise) => (
                    <li key={exercise.id} className="flex items-start gap-2">
                      <span className="text-teal-500 mt-1">•</span>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#1E3A5F' }}>
                          {exercise.name}
                        </p>
                        <p className="text-xs" style={{ color: '#6B7C93' }}>
                          {exercise.sets && `${exercise.sets}×${exercise.reps}`}
                          {exercise.duration && `${exercise.duration} ${exercise.unit}`}
                          {exercise.reps && !exercise.sets && `${exercise.reps}${exercise.perSide ? '/side' : ''}`}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                {!warmupComplete && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setWarmupComplete(true)}
                  >
                    <Check size={16} className="mr-1" />
                    Mark Warmup Done
                  </Button>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Current exercise */}
        {currentExercise && (
          <ExerciseTracker
            exercise={currentExercise}
            exerciseNumber={currentExerciseIndex + 1}
            totalExercises={totalExercises}
            isDeloadWeek={isDeloadWeek}
            existingLog={exerciseLogs[currentExercise.id]}
            onComplete={(logData) => handleExerciseComplete(currentExercise.id, logData)}
          />
        )}

        {/* Exercise overview */}
        <Card className="mt-4">
          <p className="font-medium mb-3" style={{ color: '#1E3A5F' }}>
            Today's Exercises
          </p>
          <div className="space-y-2">
            {exercises.map((exercise, idx) => (
              <div
                key={exercise.id}
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  idx === currentExerciseIndex ? 'bg-teal-50' : ''
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  exerciseLogs[exercise.id]?.completed
                    ? 'bg-teal-500 text-white'
                    : idx === currentExerciseIndex
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {exerciseLogs[exercise.id]?.completed ? <Check size={14} /> : idx + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${
                    idx === currentExerciseIndex ? 'font-semibold' : ''
                  }`} style={{ color: '#1E3A5F' }}>
                    {exercise.name}
                  </p>
                </div>
                {exercise.emoji && <span>{exercise.emoji}</span>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default SessionView;
