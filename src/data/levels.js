// XP and Level system for Climb Quest

export const levels = [
  { level: 1, name: 'Gumby', minXP: 0, emoji: '🐣' },
  { level: 2, name: 'Scrambler', minXP: 500, emoji: '🥾' },
  { level: 3, name: 'Route Reader', minXP: 1000, emoji: '📖' },
  { level: 4, name: 'Beta Finder', minXP: 2000, emoji: '🔍' },
  { level: 5, name: 'Send Train Conductor', minXP: 3500, emoji: '🚂' },
  { level: 6, name: 'Crag Boss', minXP: 5500, emoji: '👑' },
  { level: 7, name: 'Dyno Master', minXP: 8000, emoji: '🦘' },
  { level: 8, name: 'Mountain Goat', minXP: 11000, emoji: '🐐' },
  { level: 9, name: 'Free Solo Legend', minXP: 15000, emoji: '🏔️' },
  { level: 10, name: 'Climbing Champion', minXP: 20000, emoji: '🏆' }
];

export const XP_REWARDS = {
  COMPLETE_WORKOUT: 50,
  DETAILED_LOG_BONUS: 10,
  HIT_GOAL: 100,
  SET_PR: 75,
  STREAK_WEEK: 25,
  STREAK_MONTH: 100,
  UNLOCK_ACHIEVEMENT: 50
};

export const getLevelForXP = (xp) => {
  let currentLevel = levels[0];
  for (const level of levels) {
    if (xp >= level.minXP) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
};

export const getNextLevel = (currentLevel) => {
  const index = levels.findIndex(l => l.level === currentLevel.level);
  if (index < levels.length - 1) {
    return levels[index + 1];
  }
  return null;
};

export const getProgressToNextLevel = (xp) => {
  const currentLevel = getLevelForXP(xp);
  const nextLevel = getNextLevel(currentLevel);

  if (!nextLevel) {
    return { progress: 100, xpNeeded: 0, xpToNext: 0 };
  }

  const xpInCurrentLevel = xp - currentLevel.minXP;
  const xpNeededForNext = nextLevel.minXP - currentLevel.minXP;
  const progress = Math.floor((xpInCurrentLevel / xpNeededForNext) * 100);

  return {
    progress,
    xpNeeded: xpNeededForNext,
    xpToNext: nextLevel.minXP - xp
  };
};
