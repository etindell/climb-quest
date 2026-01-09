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
            <h2 className="text-xl font-bold" style={{ color: '#1E3A5F' }}>
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
          <h3 className="font-semibold mb-2" style={{ color: '#1E3A5F' }}>How to do it</h3>
          <p style={{ color: '#6B7C93' }}>{exercise.description}</p>
        </div>

        {/* Why it helps */}
        <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(64, 224, 208, 0.1)' }}>
          <div className="flex items-start gap-2">
            <Lightbulb className="flex-shrink-0 mt-0.5" size={20} style={{ color: '#40E0D0' }} />
            <div>
              <h3 className="font-semibold mb-1" style={{ color: '#1E3A5F' }}>Why it helps</h3>
              <p style={{ color: '#6B7C93' }}>{exercise.whyItHelps}</p>
            </div>
          </div>
        </div>

        {/* Default Settings */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>
              {exercise.defaultSets}
            </p>
            <p className="text-xs" style={{ color: '#6B7C93' }}>Sets</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>
              {exercise.trackingType === 'duration'
                ? exercise.defaultDuration
                : exercise.defaultReps || '-'}
            </p>
            <p className="text-xs" style={{ color: '#6B7C93' }}>
              {exercise.trackingType === 'duration' ? 'Seconds' : 'Reps'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="flex justify-center gap-0.5">
              {difficultyStars.map((filled, i) => (
                <Star
                  key={i}
                  size={16}
                  className={filled ? 'text-gray-300' : 'text-gray-300'}
                  style={filled ? { fill: '#FFD700', color: '#FFD700' } : {}}
                />
              ))}
            </div>
            <p className="text-xs mt-1" style={{ color: '#6B7C93' }}>Difficulty</p>
          </div>
        </div>

        {/* Assisted Pull-up special case */}
        {exercise.hasAssistVariants && (
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold mb-2" style={{ color: '#1E3A5F' }}>
              Assistance Levels Available
            </h3>
            <div className="flex flex-wrap gap-2">
              {exercise.assistLevels.map(level => (
                <Badge key={level} variant="secondary">
                  {level} lbs
                </Badge>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: '#6B7C93' }}>
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
