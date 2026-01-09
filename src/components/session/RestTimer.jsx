import React, { useState, useEffect } from 'react';
import { Play, SkipForward } from 'lucide-react';
import { Button } from '../common';

export function RestTimer({
  duration = 60,
  onComplete,
  onSkip,
  nextExercise
}) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Small delay before auto-advancing
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, timeLeft, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((duration - timeLeft) / duration) * 100;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center p-6 z-50"
      style={{ backgroundColor: '#1E3A5F' }}
    >
      {/* Circular progress */}
      <div className="relative w-64 h-64 mb-8">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="#40E0D0"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 120}`}
            strokeDashoffset={`${2 * Math.PI * 120 * (1 - progressPercent / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold text-white">
            {formatTime(timeLeft)}
          </span>
          <span className="text-white/70 mt-2">Rest Time</span>
        </div>
      </div>

      {/* Next exercise preview */}
      {nextExercise && (
        <div className="bg-white/10 rounded-xl p-4 mb-6 w-full max-w-sm">
          <p className="text-white/70 text-sm mb-1">Up Next</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{nextExercise.emoji || '💪'}</span>
            <div>
              <p className="text-white font-semibold">{nextExercise.name}</p>
              <p className="text-white/70 text-sm">
                {nextExercise.sets && `${nextExercise.sets} sets`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => setIsPaused(!isPaused)}
          className="border-white/30 text-white hover:bg-white/10"
        >
          {isPaused ? (
            <>
              <Play size={18} className="mr-2" />
              Resume
            </>
          ) : (
            'Pause'
          )}
        </Button>

        <Button
          onClick={onSkip}
          className="bg-white/20 text-white hover:bg-white/30"
        >
          <SkipForward size={18} className="mr-2" />
          Skip Rest
        </Button>
      </div>

      {/* Motivational text */}
      <p className="text-white/50 text-sm mt-8 text-center">
        {timeLeft > 30
          ? 'Shake it out, stay loose'
          : timeLeft > 10
          ? 'Get ready for the next set'
          : 'Almost time!'}
      </p>
    </div>
  );
}

export default RestTimer;
