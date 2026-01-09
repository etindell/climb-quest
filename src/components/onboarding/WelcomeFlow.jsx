import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Target, Trophy, Flame, Dumbbell } from 'lucide-react';
import { Button, Card } from '../common';

const STEPS = [
  {
    id: 'welcome',
    emoji: '🧗',
    title: 'Welcome to Climb Quest!',
    subtitle: 'Your personal climbing workout tracker'
  },
  {
    id: 'name',
    emoji: '👋',
    title: "What's your name?",
    subtitle: "We'll use this to cheer you on!"
  },
  {
    id: 'features',
    emoji: '✨',
    title: 'What you can do',
    subtitle: 'Here are the awesome features waiting for you'
  },
  {
    id: 'ready',
    emoji: '🚀',
    title: "You're all set!",
    subtitle: "Let's start your climbing journey"
  }
];

const FEATURES = [
  {
    icon: Dumbbell,
    title: 'Custom Workouts',
    description: 'Generate workouts tailored for climbing',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Trophy,
    title: 'Earn Achievements',
    description: 'Unlock badges as you progress',
    color: 'bg-amber-100 text-amber-600'
  },
  {
    icon: Target,
    title: 'Track Goals',
    description: 'Set goals and crush them',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Flame,
    title: 'Build Streaks',
    description: 'Stay consistent, stay strong',
    color: 'bg-orange-100 text-orange-600'
  }
];

export function WelcomeFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const canProceed = step.id !== 'name' || name.trim().length > 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete({ name: name.trim() });
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: 'linear-gradient(to bottom right, #40E0D0, #1E3A5F)' }}>
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-8 pb-4">
        {STEPS.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentStep
                ? 'w-6 bg-white'
                : index < currentStep
                  ? 'bg-white/80'
                  : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Emoji */}
        <div className="text-7xl mb-6 animate-bounce-slow">
          {step.emoji}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          {step.title}
        </h1>
        <p className="text-white/80 text-center mb-8">
          {step.subtitle}
        </p>

        {/* Step-specific content */}
        <div className="w-full max-w-sm">
          {step.id === 'name' && (
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-4 text-xl text-center rounded-2xl border-2 border-white/30
                           bg-white/10 text-white placeholder-white/50
                           focus:border-white focus:bg-white/20 outline-none
                           transition-all"
                autoFocus
                maxLength={20}
              />
              <p className="text-white/60 text-sm text-center">
                You can always change this later
              </p>
            </div>
          )}

          {step.id === 'features' && (
            <div className="space-y-3">
              {FEATURES.map((feature, index) => (
                <Card
                  key={index}
                  className="flex items-center gap-4 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                    <feature.icon size={24} />
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: '#1E3A5F' }}>{feature.title}</p>
                    <p className="text-sm" style={{ color: '#6B7C93' }}>{feature.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {step.id === 'ready' && (
            <div className="text-center space-y-4">
              <Card className="inline-block px-8 py-4">
                <p className="text-xl font-bold" style={{ color: '#1E3A5F' }}>
                  Welcome, {name || 'Climber'}! 🎉
                </p>
                <p className="mt-1" style={{ color: '#6B7C93' }}>
                  Time to start your first workout
                </p>
              </Card>
              <div className="flex justify-center gap-4 mt-6">
                <div className="text-center">
                  <p className="text-4xl">🐣</p>
                  <p className="text-white/80 text-sm mt-1">Level 1</p>
                  <p className="text-white font-bold">Gumby</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl">0</p>
                  <p className="text-white/80 text-sm mt-1">XP</p>
                  <p className="text-white font-bold">Earned</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl">🔥</p>
                  <p className="text-white/80 text-sm mt-1">Streak</p>
                  <p className="text-white font-bold">0 days</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 pb-8 flex gap-3">
        {currentStep > 0 && (
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-white border-white/30 hover:bg-white/10"
          >
            <ChevronLeft size={20} />
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex-1 bg-white hover:bg-gray-100 disabled:opacity-50"
          style={{ color: '#1E3A5F' }}
          size="lg"
        >
          {isLastStep ? (
            <>
              Start Climbing!
              <ChevronRight size={20} className="ml-1" />
            </>
          ) : (
            <>
              Continue
              <ChevronRight size={20} className="ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default WelcomeFlow;
