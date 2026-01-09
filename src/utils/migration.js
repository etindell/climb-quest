// Data migration utilities for Climb Quest
// Handles upgrading state structure between versions

export const CURRENT_DATA_VERSION = 2;

// Default program state for new users or migrations
const DEFAULT_PROGRAM_STATE = {
  isActive: false, // Will be set to true when user starts program
  startDate: null,
  currentWeek: 1,
  cycleNumber: 1,
  weekTemplate: null, // null = use DEFAULT_WEEK_TEMPLATE
  climbingDays: {},
  exerciseProgress: {},
  sessionHistory: [],
  isDeloadWeek: false
};

/**
 * Migrate data from older versions to current version
 * @param {Object} state - The current state from localStorage
 * @returns {Object} - Migrated state
 */
export function migrateData(state) {
  if (!state) {
    return null; // Let initial state handle this
  }

  const version = state._version || 1;
  let migratedState = { ...state };

  // Migration from v1 to v2: Add program state
  if (version < 2) {
    console.log('[Migration] Upgrading from v1 to v2: Adding program state');

    migratedState = {
      ...migratedState,
      _version: 2,
      program: {
        ...DEFAULT_PROGRAM_STATE,
        // Don't auto-activate for existing users - let them opt in
        isActive: false
      }
    };
  }

  // Future migrations would go here:
  // if (version < 3) { ... }

  return migratedState;
}

/**
 * Check if migration is needed
 * @param {Object} state - Current state
 * @returns {boolean}
 */
export function needsMigration(state) {
  if (!state) return false;
  const version = state._version || 1;
  return version < CURRENT_DATA_VERSION;
}

/**
 * Check if user needs to see program onboarding
 * (Existing user who hasn't started the program yet)
 * @param {Object} state - Current state
 * @returns {boolean}
 */
export function needsProgramOnboarding(state) {
  if (!state) return false;
  if (!state.program) return true;
  return !state.program.isActive && !state.program.startDate;
}

/**
 * Initialize program for a user (new or existing)
 * @param {Object} state - Current state
 * @returns {Object} - State with program initialized
 */
export function initializeProgram(state) {
  const now = new Date().toISOString();

  return {
    ...state,
    program: {
      ...DEFAULT_PROGRAM_STATE,
      ...state.program,
      isActive: true,
      startDate: now,
      currentWeek: 1,
      cycleNumber: 1
    }
  };
}

/**
 * Get a fresh initial state for new users (v2)
 * @returns {Object}
 */
export function getInitialStateV2() {
  return {
    _version: CURRENT_DATA_VERSION,
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
    goals: [],
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
    program: DEFAULT_PROGRAM_STATE
  };
}

/**
 * Sync sessionHistory to workouts array
 * Ensures all program sessions appear in the workouts array for calendar/stats
 * @param {Object} state - State to sync
 * @returns {Object} - State with synced workouts
 */
export function syncSessionHistoryToWorkouts(state) {
  if (!state?.program?.sessionHistory || !Array.isArray(state.workouts)) {
    return state;
  }

  const workouts = [...state.workouts];
  const existingDates = new Set(
    workouts
      .filter(w => w.programSession)
      .map(w => `${w.date?.split('T')[0]}-${w.type}`)
  );

  let addedCount = 0;

  for (const session of state.program.sessionHistory) {
    const key = `${session.date}-${session.sessionType}`;
    if (!existingDates.has(key)) {
      // Add missing session to workouts
      workouts.push({
        id: session.id,
        date: new Date(session.date).toISOString(),
        type: session.sessionType,
        programSession: true,
        notes: session.notes || '',
        xpEarned: session.xpEarned || 0
      });
      existingDates.add(key);
      addedCount++;
    }
  }

  if (addedCount > 0) {
    console.log(`[Migration] Synced ${addedCount} session(s) from sessionHistory to workouts`);
  }

  return {
    ...state,
    workouts
  };
}

/**
 * Validate state structure and fix any issues
 * @param {Object} state - State to validate
 * @returns {Object} - Validated/fixed state
 */
export function validateState(state) {
  if (!state) return null;

  let validated = { ...state };

  // Ensure workouts is an array
  if (!Array.isArray(validated.workouts)) {
    validated.workouts = [];
  }

  // Ensure program state exists
  if (!validated.program) {
    validated.program = { ...DEFAULT_PROGRAM_STATE };
  }

  // Ensure all program properties exist
  validated.program = {
    ...DEFAULT_PROGRAM_STATE,
    ...validated.program
  };

  // Ensure climbingDays is an object
  if (!validated.program.climbingDays || typeof validated.program.climbingDays !== 'object') {
    validated.program.climbingDays = {};
  }

  // Ensure exerciseProgress is an object
  if (!validated.program.exerciseProgress || typeof validated.program.exerciseProgress !== 'object') {
    validated.program.exerciseProgress = {};
  }

  // Ensure sessionHistory is an array
  if (!Array.isArray(validated.program.sessionHistory)) {
    validated.program.sessionHistory = [];
  }

  // Ensure version is set
  if (!validated._version) {
    validated._version = CURRENT_DATA_VERSION;
  }

  // Sync any missing sessionHistory entries to workouts
  validated = syncSessionHistoryToWorkouts(validated);

  return validated;
}

export default {
  migrateData,
  needsMigration,
  needsProgramOnboarding,
  initializeProgram,
  getInitialStateV2,
  validateState,
  syncSessionHistoryToWorkouts,
  CURRENT_DATA_VERSION
};
