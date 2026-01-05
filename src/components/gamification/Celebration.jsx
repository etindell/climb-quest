import React, { useEffect, useState } from 'react';

const CONFETTI_COLORS = [
  '#40E0D0', // turquoise
  '#FFD700', // gold
  '#FF6B6B', // coral
  '#4ECDC4', // teal
  '#45B7D1', // sky blue
  '#96CEB4', // sage
  '#FFEAA7', // cream
  '#DDA0DD', // plum
];

function ConfettiPiece({ delay, color, left }) {
  return (
    <div
      className="absolute w-3 h-3 rounded-sm"
      style={{
        backgroundColor: color,
        left: `${left}%`,
        top: '-10px',
        animation: `confetti-fall 3s ease-out ${delay}s forwards`,
        transform: `rotate(${Math.random() * 360}deg)`,
      }}
    />
  );
}

export function Confetti({ show, onComplete }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (show) {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        delay: Math.random() * 0.5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        left: Math.random() * 100,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <ConfettiPiece
          key={piece.id}
          delay={piece.delay}
          color={piece.color}
          left={piece.left}
        />
      ))}
    </div>
  );
}

export function CelebrationModal({ show, onClose, title, message, emoji = '🎉' }) {
  if (!show) return null;

  return (
    <>
      <Confetti show={show} />
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm text-center animate-bounce-in">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="text-2xl font-bold text-[--color-secondary] mb-2">
            {title}
          </h2>
          <p className="text-[--color-text-muted] mb-6">{message}</p>
          <button
            onClick={onClose}
            className="bg-[--color-primary] text-white px-8 py-3 rounded-xl font-semibold
                       hover:bg-[--color-primary-dark] transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>
    </>
  );
}

export function AchievementToast({ achievement, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="bg-white rounded-xl shadow-xl p-4 flex items-center gap-3 animate-slide-down pointer-events-auto max-w-sm">
        <div className="w-12 h-12 bg-[--color-celebration]/20 rounded-full flex items-center justify-center">
          <span className="text-2xl">{achievement.emoji}</span>
        </div>
        <div className="flex-1">
          <p className="text-xs text-[--color-celebration] font-semibold uppercase">
            Achievement Unlocked!
          </p>
          <p className="font-bold text-[--color-secondary]">{achievement.name}</p>
          <p className="text-xs text-[--color-text-muted]">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
}

export function XPGain({ amount, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-[--color-celebration] text-white px-4 py-2 rounded-full font-bold text-lg animate-float-up">
        +{amount} XP
      </div>
    </div>
  );
}

export function LevelUpModal({ show, onClose, level }) {
  if (!show || !level) return null;

  return (
    <>
      <Confetti show={show} />
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-[--color-primary] to-[--color-secondary] rounded-2xl p-8 mx-4 max-w-sm text-center animate-bounce-in">
          <div className="text-7xl mb-4 animate-pulse">{level.emoji}</div>
          <p className="text-white/80 text-sm uppercase tracking-wider mb-1">Level Up!</p>
          <h2 className="text-3xl font-bold text-white mb-2">
            Level {level.level}
          </h2>
          <p className="text-2xl font-bold text-[--color-celebration] mb-4">
            {level.name}
          </p>
          <p className="text-white/80 mb-6">
            You're becoming a stronger climber every day!
          </p>
          <button
            onClick={onClose}
            className="bg-white text-[--color-secondary] px-8 py-3 rounded-xl font-bold
                       hover:bg-gray-100 transition-colors shadow-lg"
          >
            Let's Go!
          </button>
        </div>
      </div>
    </>
  );
}

export function PRCelebration({ show, onClose, prType, value }) {
  if (!show) return null;

  const prLabels = {
    pullUps: { name: 'Pull-ups', emoji: '💪', unit: 'reps' },
    deadHang: { name: 'Dead Hang', emoji: '🤙', unit: 'seconds' },
    plank: { name: 'Plank', emoji: '⏱️', unit: 'seconds' },
    boulderGrade: { name: 'Boulder', emoji: '🪨', unit: '' },
    ropeGrade: { name: 'Rope', emoji: '🧗', unit: '' }
  };

  const pr = prLabels[prType] || { name: 'Personal Record', emoji: '🏆', unit: '' };

  return (
    <>
      <Confetti show={show} />
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm text-center animate-bounce-in">
          <div className="text-6xl mb-4">{pr.emoji}</div>
          <p className="text-[--color-celebration] text-sm uppercase tracking-wider font-bold mb-1">
            New Personal Record!
          </p>
          <h2 className="text-2xl font-bold text-[--color-secondary] mb-2">
            {pr.name}
          </h2>
          <p className="text-4xl font-bold text-[--color-primary] mb-4">
            {value} {pr.unit}
          </p>
          <p className="text-[--color-text-muted] mb-6">
            You crushed your previous best!
          </p>
          <button
            onClick={onClose}
            className="bg-[--color-primary] text-white px-8 py-3 rounded-xl font-semibold
                       hover:bg-[--color-primary-dark] transition-colors"
          >
            Amazing!
          </button>
        </div>
      </div>
    </>
  );
}

export function StreakMilestone({ show, onClose, streakCount }) {
  if (!show) return null;

  const milestones = {
    7: { emoji: '🔥', title: 'Week Warrior!', message: '7 days in a row!' },
    14: { emoji: '⚡', title: 'Two Week Titan!', message: '14 days of dedication!' },
    30: { emoji: '🌟', title: 'Month Master!', message: '30 days strong!' },
    60: { emoji: '💎', title: 'Diamond Discipline!', message: '60 days unstoppable!' },
    100: { emoji: '👑', title: 'Century Legend!', message: '100 days of greatness!' }
  };

  const milestone = milestones[streakCount];
  if (!milestone) return null;

  return (
    <>
      <Confetti show={show} />
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 mx-4 max-w-sm text-center animate-bounce-in">
          <div className="text-7xl mb-4">{milestone.emoji}</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {milestone.title}
          </h2>
          <p className="text-white/90 text-lg mb-4">{milestone.message}</p>
          <p className="text-white/70 mb-6">
            Keep the fire burning!
          </p>
          <button
            onClick={onClose}
            className="bg-white text-orange-600 px-8 py-3 rounded-xl font-bold
                       hover:bg-gray-100 transition-colors"
          >
            On Fire!
          </button>
        </div>
      </div>
    </>
  );
}

export default Confetti;
