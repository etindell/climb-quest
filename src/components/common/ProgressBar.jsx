import React from 'react';

export function ProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  label = '',
  animated = false,
  className = ''
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6'
  };

  const colors = {
    primary: 'bg-[--color-primary]',
    secondary: 'bg-[--color-secondary]',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    celebration: 'bg-[--color-celebration]'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-[--color-text-muted]">
            {label}
          </span>
          <span className="text-sm font-bold text-[--color-secondary]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`
            ${colors[color]} ${sizes[size]} rounded-full
            transition-all duration-500 ease-out
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function CircularProgress({
  value = 0,
  max = 100,
  size = 80,
  strokeWidth = 8,
  color = 'primary',
  showValue = true,
  className = ''
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    primary: '#40E0D0',
    secondary: '#1E3A5F',
    success: '#22c55e',
    celebration: '#FFD700'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-[--color-secondary]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}

export default ProgressBar;
