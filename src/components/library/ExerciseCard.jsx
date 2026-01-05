import React from 'react';
import { Star, MapPin, Clock, Hash } from 'lucide-react';
import { Card } from '../common';

export function ExerciseCard({ exercise, onClick, selected = false }) {
  const difficultyStars = Array(3).fill(0).map((_, i) => i < exercise.difficulty);

  const trackingLabel = exercise.trackingType === 'duration'
    ? `${exercise.defaultDuration}s`
    : exercise.trackingType === 'reps'
      ? `${exercise.defaultReps} reps`
      : 'Complete';

  return (
    <Card
      onClick={onClick}
      hoverable
      className={`
        transition-all duration-200
        ${selected ? 'ring-2 ring-[--color-primary] bg-[--color-primary]/5' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Emoji */}
        <div className="text-3xl flex-shrink-0">
          {exercise.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[--color-secondary] truncate">
            {exercise.name}
          </h3>

          <p className="text-sm text-[--color-text-muted] line-clamp-2 mt-1">
            {exercise.description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-3 mt-2 text-xs text-[--color-text-muted]">
            {/* Difficulty */}
            <div className="flex items-center gap-0.5">
              {difficultyStars.map((filled, i) => (
                <Star
                  key={i}
                  size={12}
                  className={filled ? 'fill-[--color-celebration] text-[--color-celebration]' : 'text-gray-300'}
                />
              ))}
            </div>

            {/* Location */}
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span className="capitalize">{exercise.location}</span>
            </div>

            {/* Tracking */}
            <div className="flex items-center gap-1">
              {exercise.trackingType === 'duration' ? (
                <Clock size={12} />
              ) : (
                <Hash size={12} />
              )}
              <span>{trackingLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ExerciseCardCompact({ exercise, onClick, selected = false }) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 p-3 rounded-xl cursor-pointer
        transition-all duration-200
        ${selected
          ? 'bg-[--color-primary]/10 ring-1 ring-[--color-primary]'
          : 'bg-white hover:bg-gray-50'
        }
      `}
    >
      <span className="text-2xl">{exercise.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[--color-secondary] truncate">
          {exercise.name}
        </p>
        <p className="text-xs text-[--color-text-muted]">
          {exercise.defaultSets} sets
        </p>
      </div>
      {selected && (
        <div className="w-5 h-5 rounded-full bg-[--color-primary] flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </div>
  );
}

export default ExerciseCard;
