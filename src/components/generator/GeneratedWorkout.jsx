import React, { useState } from 'react';
import {
  ArrowLeft, RefreshCw, Save, Play, Clock, ChevronDown, ChevronUp,
  Shuffle, Check
} from 'lucide-react';
import { Card, Button, Badge } from '../common';
import { swapExercise, getWorkoutType } from '../../utils/workoutGenerator';

const SECTION_CONFIG = {
  warmup: { label: 'Warm-up', emoji: '🔥', color: 'bg-orange-100' },
  main: { label: 'Main Workout', emoji: '💪', color: 'bg-[--color-primary]/10' },
  cooldown: { label: 'Cool-down', emoji: '❄️', color: 'bg-blue-100' }
};

function ExerciseItem({ exercise, index, onSwap, expanded, onToggleExpand }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Main row */}
      <div
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={onToggleExpand}
      >
        <span className="text-2xl">{exercise.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[--color-secondary] truncate">
            {exercise.name}
          </p>
          <p className="text-xs text-[--color-text-muted]">
            {exercise.defaultSets} sets
            {exercise.trackingType === 'duration'
              ? ` × ${exercise.defaultDuration}s`
              : exercise.defaultReps
                ? ` × ${exercise.defaultReps} reps`
                : ''
            }
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSwap();
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Swap exercise"
        >
          <Shuffle size={16} className="text-[--color-text-muted]" />
        </button>
        {expanded ? (
          <ChevronUp size={16} className="text-[--color-text-muted]" />
        ) : (
          <ChevronDown size={16} className="text-[--color-text-muted]" />
        )}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 pb-3 pt-0">
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-[--color-text-muted]">
            <p className="mb-2">{exercise.description}</p>
            <p className="text-[--color-primary] font-medium">
              💡 {exercise.whyItHelps}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function GeneratedWorkout({
  workout,
  onRegenerate,
  onBack,
  onSave,
  onStart,
  location
}) {
  const [currentWorkout, setCurrentWorkout] = useState(workout);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSwap = (index) => {
    const newWorkout = swapExercise(currentWorkout, index, location);
    setCurrentWorkout(newWorkout);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(currentWorkout);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleStart = () => {
    if (onStart) {
      onStart(currentWorkout);
    }
  };

  // Group exercises by section
  const groupedExercises = currentWorkout.exercises.reduce((acc, ex, index) => {
    if (!acc[ex.section]) {
      acc[ex.section] = [];
    }
    acc[ex.section].push({ ...ex, originalIndex: index });
    return acc;
  }, {});

  const workoutType = getWorkoutType(currentWorkout);
  const typeLabels = {
    technique: { label: 'Technique', color: 'primary' },
    strength: { label: 'Strength', color: 'secondary' },
    endurance: { label: 'Endurance', color: 'success' },
    mixed: { label: 'Mixed', color: 'default' }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[--color-text-muted] hover:text-[--color-secondary]"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <button
          onClick={onRegenerate}
          className="flex items-center gap-1 text-[--color-primary] hover:text-[--color-primary-dark] font-medium"
        >
          <RefreshCw size={18} />
          <span>New Workout</span>
        </button>
      </div>

      {/* Workout Summary Card */}
      <Card className="bg-gradient-to-br from-[--color-primary]/20 to-[--color-primary]/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-[--color-secondary]">
            Your Workout
          </h2>
          <Badge variant={typeLabels[workoutType].color}>
            {typeLabels[workoutType].label}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-[--color-text-muted]">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>~{currentWorkout.estimatedMinutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📋</span>
            <span>{currentWorkout.exercises.length} exercises</span>
          </div>
        </div>
      </Card>

      {/* Exercise Sections */}
      {['warmup', 'main', 'cooldown'].map(section => {
        const sectionExercises = groupedExercises[section] || [];
        if (sectionExercises.length === 0) return null;

        const config = SECTION_CONFIG[section];

        return (
          <div key={section}>
            <div className={`${config.color} rounded-t-xl px-4 py-2`}>
              <h3 className="font-semibold text-[--color-secondary]">
                {config.emoji} {config.label}
              </h3>
            </div>
            <div className="bg-gray-50 rounded-b-xl p-2 space-y-2">
              {sectionExercises.map((ex) => (
                <ExerciseItem
                  key={ex.id}
                  exercise={ex}
                  index={ex.originalIndex}
                  onSwap={() => handleSwap(ex.originalIndex)}
                  expanded={expandedIndex === ex.originalIndex}
                  onToggleExpand={() =>
                    setExpandedIndex(
                      expandedIndex === ex.originalIndex ? null : ex.originalIndex
                    )
                  }
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2"
        >
          {isSaved ? (
            <>
              <Check size={18} />
              Saved!
            </>
          ) : (
            <>
              <Save size={18} />
              Save Template
            </>
          )}
        </Button>
        <Button
          onClick={handleStart}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Play size={18} />
          Start Workout
        </Button>
      </div>
    </div>
  );
}

export default GeneratedWorkout;
