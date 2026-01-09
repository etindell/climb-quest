import { useLocalStorage } from './useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { defaultGoals } from '../data/defaultGoals';
import { getLevelForXP, XP_REWARDS } from '../data/levels';
import { DEFAULT_WEEK_TEMPLATE } from '../data/program';
import { migrateData, needsMigration, validateState, CURRENT_DATA_VERSION } from '../utils/migration';
import { calculateSessionXP, getCurrentWeekAndCycle } from '../utils/programHelpers';

const initialState = {
  profile: {
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    currentLevel: 1,
    totalXP: 0,
    levelName: 'Gumby'
  },
  workouts: [],
  templates: [],
  scheduledWorkouts: [],
  goals: defaultGoals,
  personalRecords: {
    deadHang: [],
    pullUps: [],
    assistedPullUps: {
      5: [], 10: [], 15: [], 20: [], 25: [], 30: []
    },
    plank: [],
    boulderGrade: [],
    ropeGrade: []
  },
  achievements: [],
  streaks: {
    current: 0,
    best: 0,
    lastWorkoutDate: null,
    freezesUsedThisMonth: 0,
    freezeResetDate: new Date().toISOString().split('T')[0]
  },
  settings: {
    theme: 'light',
    defaultWorkoutDuration: 30,
    showDetailedLogging: false
  },
  stats: {
    totalWorkouts: 0,
    randomGeneratorUses: 0,
    notesWritten: 0,
    detailedLogsCount: 0,
    templateUses: {}
  },
  // Program state for structured workout schedule
  program: {
    isActive: false,
    startDate: null,
    currentWeek: 1,
    cycleNumber: 1,
    weekTemplate: null, // null = use DEFAULT_WEEK_TEMPLATE
    climbingDays: {}, // { 'YYYY-MM-DD': { climbingLogged, climbingNotes, strengthLogged, strengthSession } }
    exerciseProgress: {}, // Per-exercise progression tracking
    sessionHistory: [], // Completed session logs
    isDeloadWeek: false
  },
  _version: CURRENT_DATA_VERSION
};

export function useAppState() {
  const [state, setState] = useLocalStorage('climbquest-data', initialState);

  // Run migration if needed (on first load)
  if (needsMigration(state)) {
    const migratedState = migrateData(state);
    if (migratedState) {
      setState(validateState(migratedState));
    }
  } else if (state && state._version) {
    // Always validate/sync state even if no migration needed
    const validatedState = validateState(state);
    // Only update if something changed (e.g., sessions synced to workouts)
    if (validatedState.workouts?.length !== state.workouts?.length) {
      setState(validatedState);
    }
  }

  // Profile actions
  const updateProfile = (updates) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates }
    }));
  };

  // XP actions
  const addXP = (amount, reason) => {
    setState(prev => {
      const newXP = prev.profile.totalXP + amount;
      const newLevel = getLevelForXP(newXP);
      return {
        ...prev,
        profile: {
          ...prev.profile,
          totalXP: newXP,
          currentLevel: newLevel.level,
          levelName: newLevel.name
        }
      };
    });
  };

  // Workout actions
  const addWorkout = (workout) => {
    const id = uuidv4();
    const newWorkout = {
      id,
      date: new Date().toISOString(),
      ...workout,
      xpEarned: XP_REWARDS.COMPLETE_WORKOUT
    };

    setState(prev => ({
      ...prev,
      workouts: [...prev.workouts, newWorkout],
      stats: {
        ...prev.stats,
        totalWorkouts: prev.stats.totalWorkouts + 1
      }
    }));

    addXP(XP_REWARDS.COMPLETE_WORKOUT, 'workout_completed');
    updateStreak();

    return id;
  };

  const updateWorkout = (id, updates) => {
    setState(prev => ({
      ...prev,
      workouts: prev.workouts.map(w =>
        w.id === id ? { ...w, ...updates } : w
      )
    }));
  };

  // Template actions
  const saveTemplate = (template) => {
    if (template.id) {
      // Update existing template
      setState(prev => ({
        ...prev,
        templates: prev.templates.map(t =>
          t.id === template.id ? { ...t, ...template } : t
        )
      }));
      return template.id;
    } else {
      // Create new template
      const id = uuidv4();
      const newTemplate = { id, ...template, createdAt: new Date().toISOString() };
      setState(prev => ({
        ...prev,
        templates: [...prev.templates, newTemplate]
      }));
      return id;
    }
  };

  const deleteTemplate = (id) => {
    setState(prev => ({
      ...prev,
      templates: prev.templates.filter(t => t.id !== id),
      // Also remove any scheduled workouts using this template
      scheduledWorkouts: prev.scheduledWorkouts.filter(sw => sw.templateId !== id)
    }));
  };

  const unscheduleWorkout = (date, templateId) => {
    setState(prev => ({
      ...prev,
      scheduledWorkouts: prev.scheduledWorkouts.filter(sw =>
        !(sw.date === date && sw.templateId === templateId)
      )
    }));
  };

  // Schedule actions
  const scheduleWorkout = (date, templateId) => {
    setState(prev => ({
      ...prev,
      scheduledWorkouts: [
        ...prev.scheduledWorkouts,
        { date, templateId, completed: false }
      ]
    }));
  };

  const completeScheduledWorkout = (date) => {
    setState(prev => ({
      ...prev,
      scheduledWorkouts: prev.scheduledWorkouts.map(sw =>
        sw.date === date ? { ...sw, completed: true } : sw
      )
    }));
  };

  // Goal actions
  const addGoal = (goal) => {
    const id = uuidv4();
    const newGoal = { id, ...goal, completed: false, completedDate: null };
    setState(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
    return id;
  };

  const completeGoal = (id) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g =>
        g.id === id
          ? { ...g, completed: true, completedDate: new Date().toISOString() }
          : g
      )
    }));
    addXP(XP_REWARDS.HIT_GOAL, 'goal_completed');
    checkAndUnlockAchievement('goal-crusher');
  };

  const deleteGoal = (id) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id)
    }));
  };

  // Personal Records actions
  const addPersonalRecord = (type, value, assistLevel = null) => {
    const record = {
      date: new Date().toISOString().split('T')[0],
      value,
      unit: type === 'boulderGrade' || type === 'ropeGrade' ? null :
            type === 'deadHang' || type === 'plank' ? 'seconds' : 'reps'
    };

    setState(prev => {
      const newRecords = { ...prev.personalRecords };

      if (type === 'assistedPullUps' && assistLevel) {
        if (!newRecords.assistedPullUps[assistLevel]) {
          newRecords.assistedPullUps[assistLevel] = [];
        }
        newRecords.assistedPullUps[assistLevel] = [
          ...newRecords.assistedPullUps[assistLevel],
          record
        ];
      } else {
        newRecords[type] = [...(newRecords[type] || []), record];
      }

      return { ...prev, personalRecords: newRecords };
    });

    addXP(XP_REWARDS.SET_PR, 'personal_record');
  };

  // Achievement actions
  const checkAndUnlockAchievement = (achievementId) => {
    setState(prev => {
      if (prev.achievements.find(a => a.id === achievementId)) {
        return prev; // Already unlocked
      }
      return {
        ...prev,
        achievements: [
          ...prev.achievements,
          { id: achievementId, unlockedDate: new Date().toISOString() }
        ]
      };
    });
  };

  const hasAchievement = (achievementId) => {
    return state.achievements.some(a => a.id === achievementId);
  };

  // Streak actions
  const updateStreak = () => {
    let newStreakCount = null;

    setState(prev => {
      const today = new Date().toISOString().split('T')[0];
      const lastDate = prev.streaks.lastWorkoutDate;

      // Check if we need to reset monthly freezes
      const freezeResetDate = prev.streaks.freezeResetDate;
      const currentMonth = new Date().getMonth();
      const resetMonth = freezeResetDate ? new Date(freezeResetDate).getMonth() : -1;
      const shouldResetFreezes = currentMonth !== resetMonth;

      if (!lastDate) {
        newStreakCount = 1;
        return {
          ...prev,
          streaks: {
            ...prev.streaks,
            current: 1,
            best: 1,
            lastWorkoutDate: today,
            freezesUsedThisMonth: shouldResetFreezes ? 0 : prev.streaks.freezesUsedThisMonth,
            freezeResetDate: shouldResetFreezes ? today : freezeResetDate
          }
        };
      }

      const last = new Date(lastDate);
      const now = new Date(today);
      const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

      let newCurrent = prev.streaks.current;
      if (diffDays === 0) {
        // Same day, streak stays the same
        newStreakCount = prev.streaks.current;
      } else if (diffDays === 1) {
        // Consecutive day
        newCurrent = prev.streaks.current + 1;
        newStreakCount = newCurrent;
      } else {
        // Streak broken (unless freeze was used)
        newCurrent = 1;
        newStreakCount = 1;
      }

      const newBest = Math.max(newCurrent, prev.streaks.best);

      return {
        ...prev,
        streaks: {
          ...prev.streaks,
          current: newCurrent,
          best: newBest,
          lastWorkoutDate: today,
          freezesUsedThisMonth: shouldResetFreezes ? 0 : prev.streaks.freezesUsedThisMonth,
          freezeResetDate: shouldResetFreezes ? today : freezeResetDate
        }
      };
    });

    return newStreakCount;
  };

  // Use a streak freeze
  const useStreakFreeze = () => {
    setState(prev => {
      if (prev.streaks.freezesUsedThisMonth >= 2) {
        return prev; // No freezes left
      }

      const today = new Date().toISOString().split('T')[0];

      return {
        ...prev,
        streaks: {
          ...prev.streaks,
          lastWorkoutDate: today, // Reset the last workout date to today
          freezesUsedThisMonth: prev.streaks.freezesUsedThisMonth + 1
        }
      };
    });
  };

  // Stats actions
  const incrementStat = (statName) => {
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statName]: (prev.stats[statName] || 0) + 1
      }
    }));
  };

  const incrementTemplateUse = (templateId) => {
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        templateUses: {
          ...prev.stats.templateUses,
          [templateId]: (prev.stats.templateUses[templateId] || 0) + 1
        }
      }
    }));
  };

  // Settings actions
  const updateSettings = (updates) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  };

  // Export/Import
  const exportData = () => {
    return JSON.stringify(state, null, 2);
  };

  const importData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      setState(data);
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  };

  const resetData = () => {
    setState(initialState);
  };

  // ============================================
  // PROGRAM ACTIONS (Structured Workout System)
  // ============================================

  // Start the structured program
  const startProgram = () => {
    const now = new Date().toISOString();
    setState(prev => ({
      ...prev,
      program: {
        ...prev.program,
        isActive: true,
        startDate: now,
        currentWeek: 1,
        cycleNumber: 1,
        isDeloadWeek: false
      }
    }));
  };

  // Log a climbing session (separate from strength)
  const logClimbingSession = (date = new Date(), notes = '') => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const sessionEntry = {
      id: uuidv4(),
      date: dateStr,
      sessionType: 'climb',
      category: 'climbing',
      completed: true,
      completedAt: new Date().toISOString(),
      notes,
      xpEarned: 30
    };

    setState(prev => ({
      ...prev,
      program: {
        ...prev.program,
        sessionHistory: [...prev.program.sessionHistory, sessionEntry],
        climbingDays: {
          ...prev.program.climbingDays,
          [dateStr]: {
            ...prev.program.climbingDays[dateStr],
            climbingLogged: true,
            climbingLogId: sessionEntry.id,
            climbingNotes: notes
          }
        }
      }
    }));

    addXP(30, 'climbing_session');
    updateStreak();

    // Also add to regular workouts for calendar/stats display
    addWorkout({
      type: 'climb',
      programSession: true,
      notes,
      date: new Date(dateStr).toISOString()
    });
  };

  // Mark that user climbed today (deprecated - use logClimbingSession)
  const markClimbingDay = (date = new Date()) => {
    logClimbingSession(date, '');
  };

  // Complete a program session (strength/mini/mobility)
  const completeSession = (sessionType, sessionData = {}) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const xpEarned = calculateSessionXP(sessionType, sessionData);

    setState(prev => {
      // Add to session history
      const newSessionEntry = {
        id: uuidv4(),
        date: today,
        sessionType,
        category: 'strength', // All non-climbing sessions are strength category
        completed: true,
        completedAt: new Date().toISOString(),
        ...sessionData,
        xpEarned
      };

      const newHistory = [...prev.program.sessionHistory, newSessionEntry];

      // Update climbing day's strength logging status
      const updatedClimbingDays = { ...prev.program.climbingDays };
      updatedClimbingDays[today] = {
        ...updatedClimbingDays[today],
        strengthLogged: true,
        strengthLogId: newSessionEntry.id,
        strengthSession: sessionType
      };

      return {
        ...prev,
        program: {
          ...prev.program,
          sessionHistory: newHistory,
          climbingDays: updatedClimbingDays
        }
      };
    });

    // Award XP and update streak
    addXP(xpEarned, 'session_completed');
    updateStreak();

    // Also add to regular workouts for stats compatibility
    addWorkout({
      type: sessionType,
      programSession: true,
      ...sessionData
    });
  };

  // Update progression state for an exercise
  const updateExerciseProgress = (exerciseId, logData) => {
    setState(prev => {
      const existingProgress = prev.program.exerciseProgress[exerciseId] || {
        logs: [],
        currentLevel: 'starting'
      };

      const newLog = {
        date: format(new Date(), 'yyyy-MM-dd'),
        timestamp: new Date().toISOString(),
        ...logData
      };

      return {
        ...prev,
        program: {
          ...prev.program,
          exerciseProgress: {
            ...prev.program.exerciseProgress,
            [exerciseId]: {
              ...existingProgress,
              logs: [...existingProgress.logs, newLog],
              lastUpdated: new Date().toISOString()
            }
          }
        }
      };
    });
  };

  // Advance exercise to next progression level
  const advanceExerciseLevel = (exerciseId, newLevel, notes = '') => {
    setState(prev => {
      const existingProgress = prev.program.exerciseProgress[exerciseId] || {
        logs: [],
        currentLevel: 'starting'
      };

      return {
        ...prev,
        program: {
          ...prev.program,
          exerciseProgress: {
            ...prev.program.exerciseProgress,
            [exerciseId]: {
              ...existingProgress,
              currentLevel: newLevel,
              lastProgression: new Date().toISOString(),
              progressionNotes: notes
            }
          }
        }
      };
    });
  };

  // Sync week/cycle based on start date (call on app load)
  const syncProgramWeek = () => {
    if (!state.program?.startDate) return;

    const { currentWeek, cycleNumber } = getCurrentWeekAndCycle(state.program.startDate);

    if (state.program.currentWeek !== currentWeek || state.program.cycleNumber !== cycleNumber) {
      setState(prev => ({
        ...prev,
        program: {
          ...prev.program,
          currentWeek,
          cycleNumber,
          isDeloadWeek: currentWeek === 4
        }
      }));
    }
  };

  // Manually advance to next week (for testing or manual override)
  const advanceWeek = () => {
    setState(prev => {
      const newWeek = prev.program.currentWeek + 1;
      const shouldResetCycle = newWeek > 4;

      return {
        ...prev,
        program: {
          ...prev.program,
          currentWeek: shouldResetCycle ? 1 : newWeek,
          cycleNumber: shouldResetCycle ? prev.program.cycleNumber + 1 : prev.program.cycleNumber,
          isDeloadWeek: !shouldResetCycle && newWeek === 4
        }
      };
    });
  };

  // Update week template (customize schedule)
  const updateWeekTemplate = (template) => {
    setState(prev => ({
      ...prev,
      program: {
        ...prev.program,
        weekTemplate: template
      }
    }));
  };

  // Reset program progress (start fresh)
  const resetProgram = () => {
    setState(prev => ({
      ...prev,
      program: {
        isActive: false,
        startDate: null,
        currentWeek: 1,
        cycleNumber: 1,
        weekTemplate: null,
        climbingDays: {},
        exerciseProgress: {},
        sessionHistory: [],
        isDeloadWeek: false
      }
    }));
  };

  return {
    state,
    // Profile
    updateProfile,
    addXP,
    // Workouts
    addWorkout,
    updateWorkout,
    // Templates
    saveTemplate,
    deleteTemplate,
    // Schedule
    scheduleWorkout,
    completeScheduledWorkout,
    unscheduleWorkout,
    // Goals
    addGoal,
    completeGoal,
    deleteGoal,
    // Personal Records
    addPersonalRecord,
    // Achievements
    checkAndUnlockAchievement,
    hasAchievement,
    // Streaks
    updateStreak,
    useStreakFreeze,
    // Stats
    incrementStat,
    incrementTemplateUse,
    // Settings
    updateSettings,
    // Data management
    exportData,
    importData,
    resetData,
    // Program (Structured Workout System)
    startProgram,
    logClimbingSession,
    markClimbingDay,
    completeSession,
    updateExerciseProgress,
    advanceExerciseLevel,
    syncProgramWeek,
    advanceWeek,
    updateWeekTemplate,
    resetProgram
  };
}

export default useAppState;
