import React, { useState } from 'react';
import { Shuffle, Clock, MapPin, Zap, Target, Sparkles } from 'lucide-react';
import { Card, Button, Badge } from '../common';
import { generateWorkout } from '../../utils/workoutGenerator';
import { GeneratedWorkout } from './GeneratedWorkout';

const DURATION_OPTIONS = [
  { value: 20, label: '20 min', description: 'Quick session' },
  { value: 30, label: '30 min', description: 'Standard workout' },
  { value: 45, label: '45 min', description: 'Full session' },
  { value: 60, label: '60 min', description: 'Extended training' }
];

const LOCATION_OPTIONS = [
  { value: 'gym', label: 'At the Gym', emoji: '🧗' },
  { value: 'home', label: 'At Home', emoji: '🏠' }
];

const ENERGY_OPTIONS = [
  { value: 'low', label: 'Low', emoji: '🔋', description: 'Take it easy today' },
  { value: 'medium', label: 'Medium', emoji: '🔋🔋', description: 'Feeling good' },
  { value: 'high', label: 'High', emoji: '🔋🔋🔋', description: 'Ready to crush it!' }
];

const FOCUS_OPTIONS = [
  { value: 'technique', label: 'Technique', emoji: '🎯', description: 'Footwork & movement' },
  { value: 'strength', label: 'Strength', emoji: '💪', description: 'Build muscle' },
  { value: 'endurance', label: 'Endurance', emoji: '⏱️', description: 'Climb longer' },
  { value: 'mix', label: 'Mix it up!', emoji: '🎲', description: 'A bit of everything' }
];

function OptionButton({ selected, onClick, children, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`
        p-3 rounded-xl border-2 transition-all duration-200 text-left
        ${selected
          ? 'border-[--color-primary] bg-[--color-primary]/10'
          : 'border-gray-200 hover:border-gray-300 bg-white'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function WorkoutGenerator({ onSaveWorkout, onStartWorkout }) {
  const [step, setStep] = useState('options'); // 'options' | 'generated'
  const [options, setOptions] = useState({
    duration: 30,
    location: 'gym',
    energy: 'medium',
    focus: 'mix',
    includeStretching: true
  });
  const [generatedWorkout, setGeneratedWorkout] = useState(null);

  const handleGenerate = () => {
    const workout = generateWorkout(options);
    setGeneratedWorkout(workout);
    setStep('generated');
  };

  const handleRegenerate = () => {
    const workout = generateWorkout(options);
    setGeneratedWorkout(workout);
  };

  const handleBack = () => {
    setStep('options');
  };

  if (step === 'generated' && generatedWorkout) {
    return (
      <GeneratedWorkout
        workout={generatedWorkout}
        onRegenerate={handleRegenerate}
        onBack={handleBack}
        onSave={onSaveWorkout}
        onStart={onStartWorkout}
        location={options.location}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[--color-secondary]">
          Create Your Workout
        </h2>
        <p className="text-[--color-text-muted] mt-1">
          Answer a few questions and we'll build the perfect session!
        </p>
      </div>

      {/* Duration */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="text-[--color-primary]" size={20} />
          <h3 className="font-semibold text-[--color-secondary]">How much time do you have?</h3>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {DURATION_OPTIONS.map(opt => (
            <OptionButton
              key={opt.value}
              selected={options.duration === opt.value}
              onClick={() => setOptions(prev => ({ ...prev, duration: opt.value }))}
              className="text-center"
            >
              <p className="font-bold text-[--color-secondary]">{opt.label}</p>
              <p className="text-xs text-[--color-text-muted]">{opt.description}</p>
            </OptionButton>
          ))}
        </div>
      </Card>

      {/* Location */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="text-[--color-primary]" size={20} />
          <h3 className="font-semibold text-[--color-secondary]">Where are you training?</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {LOCATION_OPTIONS.map(opt => (
            <OptionButton
              key={opt.value}
              selected={options.location === opt.value}
              onClick={() => setOptions(prev => ({ ...prev, location: opt.value }))}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{opt.emoji}</span>
                <span className="font-semibold text-[--color-secondary]">{opt.label}</span>
              </div>
            </OptionButton>
          ))}
        </div>
      </Card>

      {/* Energy Level */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="text-[--color-primary]" size={20} />
          <h3 className="font-semibold text-[--color-secondary]">How's your energy today?</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ENERGY_OPTIONS.map(opt => (
            <OptionButton
              key={opt.value}
              selected={options.energy === opt.value}
              onClick={() => setOptions(prev => ({ ...prev, energy: opt.value }))}
              className="text-center"
            >
              <p className="text-xl mb-1">{opt.emoji}</p>
              <p className="font-semibold text-[--color-secondary]">{opt.label}</p>
              <p className="text-xs text-[--color-text-muted]">{opt.description}</p>
            </OptionButton>
          ))}
        </div>
      </Card>

      {/* Focus */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Target className="text-[--color-primary]" size={20} />
          <h3 className="font-semibold text-[--color-secondary]">What do you want to focus on?</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {FOCUS_OPTIONS.map(opt => (
            <OptionButton
              key={opt.value}
              selected={options.focus === opt.value}
              onClick={() => setOptions(prev => ({ ...prev, focus: opt.value }))}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{opt.emoji}</span>
                <div>
                  <p className="font-semibold text-[--color-secondary]">{opt.label}</p>
                  <p className="text-xs text-[--color-text-muted]">{opt.description}</p>
                </div>
              </div>
            </OptionButton>
          ))}
        </div>
      </Card>

      {/* Include Stretching Toggle */}
      <Card>
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧘</span>
            <div>
              <p className="font-semibold text-[--color-secondary]">Include stretching?</p>
              <p className="text-xs text-[--color-text-muted]">Add flexibility exercises to your workout</p>
            </div>
          </div>
          <div
            className={`
              w-12 h-7 rounded-full transition-colors duration-200 relative cursor-pointer
              ${options.includeStretching ? 'bg-[--color-primary]' : 'bg-gray-300'}
            `}
            onClick={() => setOptions(prev => ({ ...prev, includeStretching: !prev.includeStretching }))}
          >
            <div
              className={`
                absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                ${options.includeStretching ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </div>
        </label>
      </Card>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        fullWidth
        size="lg"
        className="flex items-center justify-center gap-2"
      >
        <Sparkles size={20} />
        Generate My Workout!
      </Button>
    </div>
  );
}

export default WorkoutGenerator;
