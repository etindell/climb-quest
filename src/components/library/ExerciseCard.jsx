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
        ${selected ? 'ring-2 ring-teal-400' : ''}
      `}
      style={selected ? { backgroundColor: 'rgba(64, 224, 208, 0.05)' } : {}}
    >
      <div className="flex items-start gap-3">
        {/* Emoji */}
        <div className="text-3xl flex-shrink-0">
          {exercise.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold truncate" style={{ color: '#1E3A5F' }}>
            {exercise.name}
          </h3>

          <p className="text-sm line-clamp-2 mt-1" style={{ color: '#6B7C93' }}>
            {exercise.description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: '#6B7C93' }}>
            {/* Difficulty */}
            <div className="flex items-center gap-0.5">
              {difficultyStars.map((filled, i) => (
                <Star
                  key={i}
                  size={12}
                  className={filled ? 'text-gray-300' : 'text-gray-300'}
                  style={filled ? { fill: '#FFD700', color: '#FFD700' } : {}}
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
          ? 'ring-1 ring-teal-400'
          : 'bg-white hover:bg-gray-50'
        }
      `}
      style={selected ? { backgroundColor: 'rgba(64, 224, 208, 0.1)' } : {}}
    >
      <span className="text-2xl">{exercise.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate" style={{ color: '#1E3A5F' }}>
          {exercise.name}
        </p>
        <p className="text-xs" style={{ color: '#6B7C93' }}>
          {exercise.defaultSets} sets
        </p>
      </div>
      {selected && (
        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#40E0D0' }}>
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </div>
  );
}

export default ExerciseCard;
