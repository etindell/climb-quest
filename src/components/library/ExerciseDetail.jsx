import React from 'react';
import { Star, MapPin, Clock, Hash, Lightbulb, X } from 'lucide-react';
import { Modal, Button, Badge } from '../common';

export function ExerciseDetail({ exercise, isOpen, onClose }) {
  if (!exercise) return null;

  const difficultyStars = Array(3).fill(0).map((_, i) => i < exercise.difficulty);
  const difficultyLabels = ['Easy', 'Medium', 'Hard'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="text-5xl">{exercise.emoji}</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[--color-secondary]">
              {exercise.name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="primary">
                {exercise.location === 'both' ? 'Anywhere' : exercise.location === 'gym' ? 'At Gym' : 'At Home'}
              </Badge>
              <Badge variant="secondary">
                {difficultyLabels[exercise.difficulty - 1]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-[--color-secondary] mb-2">How to do it</h3>
          <p className="text-[--color-text-muted]">{exercise.description}</p>
        </div>

        {/* Why it helps */}
        <div className="bg-[--color-primary]/10 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="text-[--color-primary] flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-[--color-secondary] mb-1">Why it helps</h3>
              <p className="text-[--color-text-muted]">{exercise.whyItHelps}</p>
            </div>
          </div>
        </div>

        {/* Default Settings */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[--color-secondary]">
              {exercise.defaultSets}
            </p>
            <p className="text-xs text-[--color-text-muted]">Sets</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[--color-secondary]">
              {exercise.trackingType === 'duration'
                ? exercise.defaultDuration
                : exercise.defaultReps || '-'}
            </p>
            <p className="text-xs text-[--color-text-muted]">
              {exercise.trackingType === 'duration' ? 'Seconds' : 'Reps'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="flex justify-center gap-0.5">
              {difficultyStars.map((filled, i) => (
                <Star
                  key={i}
                  size={16}
                  className={filled ? 'fill-[--color-celebration] text-[--color-celebration]' : 'text-gray-300'}
                />
              ))}
            </div>
            <p className="text-xs text-[--color-text-muted] mt-1">Difficulty</p>
          </div>
        </div>

        {/* Assisted Pull-up special case */}
        {exercise.hasAssistVariants && (
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-[--color-secondary] mb-2">
              Assistance Levels Available
            </h3>
            <div className="flex flex-wrap gap-2">
              {exercise.assistLevels.map(level => (
                <Badge key={level} variant="secondary">
                  {level} lbs
                </Badge>
              ))}
            </div>
            <p className="text-xs text-[--color-text-muted] mt-2">
              Start with more assistance and work your way down!
            </p>
          </div>
        )}

        {/* Close button */}
        <Button onClick={onClose} variant="outline" fullWidth>
          Got it!
        </Button>
      </div>
    </Modal>
  );
}

export default ExerciseDetail;
