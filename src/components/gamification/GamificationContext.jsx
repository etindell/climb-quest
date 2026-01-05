import React, { createContext, useContext, useState, useCallback } from 'react';
import { AchievementToast, XPGain, LevelUpModal, PRCelebration, StreakMilestone } from './Celebration';
import { getAchievementById } from '../../data/achievements';

const GamificationContext = createContext(null);

export function GamificationProvider({ children }) {
  // Celebration queues
  const [xpGains, setXpGains] = useState([]);
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [levelUp, setLevelUp] = useState(null);
  const [prCelebration, setPrCelebration] = useState(null);
  const [streakMilestone, setStreakMilestone] = useState(null);

  // Show XP gain popup
  const showXPGain = useCallback((amount) => {
    const id = Date.now();
    setXpGains(prev => [...prev, { id, amount }]);
  }, []);

  const removeXPGain = useCallback((id) => {
    setXpGains(prev => prev.filter(x => x.id !== id));
  }, []);

  // Show achievement unlock toast
  const showAchievementUnlock = useCallback((achievementId) => {
    const achievement = getAchievementById(achievementId);
    if (achievement) {
      setAchievementQueue(prev => [...prev, { id: Date.now(), achievement }]);
    }
  }, []);

  const removeAchievement = useCallback(() => {
    setAchievementQueue(prev => prev.slice(1));
  }, []);

  // Show level up celebration
  const showLevelUp = useCallback((level) => {
    setLevelUp(level);
  }, []);

  const closeLevelUp = useCallback(() => {
    setLevelUp(null);
  }, []);

  // Show PR celebration
  const showPRCelebration = useCallback((prType, value) => {
    setPrCelebration({ prType, value });
  }, []);

  const closePRCelebration = useCallback(() => {
    setPrCelebration(null);
  }, []);

  // Show streak milestone
  const showStreakMilestone = useCallback((count) => {
    // Only show for milestone counts
    if ([7, 14, 30, 60, 100].includes(count)) {
      setStreakMilestone(count);
    }
  }, []);

  const closeStreakMilestone = useCallback(() => {
    setStreakMilestone(null);
  }, []);

  // Batch celebration for workout completion
  const celebrateWorkoutComplete = useCallback(({ xp, achievements = [], newLevel = null, newStreak = null }) => {
    // Show XP first
    if (xp) {
      showXPGain(xp);
    }

    // Queue achievements
    achievements.forEach(id => {
      setTimeout(() => showAchievementUnlock(id), 500);
    });

    // Show level up if applicable
    if (newLevel) {
      setTimeout(() => showLevelUp(newLevel), achievements.length * 500 + 1000);
    }

    // Show streak milestone if applicable
    if (newStreak && [7, 14, 30, 60, 100].includes(newStreak)) {
      setTimeout(() => showStreakMilestone(newStreak), (newLevel ? 2000 : 0) + achievements.length * 500 + 1000);
    }
  }, [showXPGain, showAchievementUnlock, showLevelUp, showStreakMilestone]);

  const value = {
    showXPGain,
    showAchievementUnlock,
    showLevelUp,
    showPRCelebration,
    showStreakMilestone,
    celebrateWorkoutComplete
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}

      {/* XP Gain popups */}
      {xpGains.map(({ id, amount }) => (
        <XPGain key={id} amount={amount} onComplete={() => removeXPGain(id)} />
      ))}

      {/* Achievement toasts (show one at a time) */}
      {achievementQueue.length > 0 && (
        <AchievementToast
          achievement={achievementQueue[0].achievement}
          onClose={removeAchievement}
        />
      )}

      {/* Level up modal */}
      <LevelUpModal
        show={!!levelUp}
        onClose={closeLevelUp}
        level={levelUp}
      />

      {/* PR celebration */}
      <PRCelebration
        show={!!prCelebration}
        onClose={closePRCelebration}
        prType={prCelebration?.prType}
        value={prCelebration?.value}
      />

      {/* Streak milestone */}
      <StreakMilestone
        show={!!streakMilestone}
        onClose={closeStreakMilestone}
        streakCount={streakMilestone}
      />
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}

export default GamificationProvider;
