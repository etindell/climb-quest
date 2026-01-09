// Climb Quest - Structured Program Definitions
// Based on climbing-support training plan for youth climbers

// Session type identifiers
export const SESSION_TYPES = {
  STRENGTH_1: 'strength1',
  STRENGTH_2: 'strength2',
  MINI_A: 'miniA',
  MINI_B: 'miniB',
  MOBILITY: 'mobility',
  REST: 'rest',
  CLIMB: 'climb',
  CLIMB_EASY: 'climbEasy'
};

// Default 7-day weekly template (3 climbing days: Mon/Wed/Sat)
// Day 0 = Sunday
// Each day has a `sessions` array that can contain multiple session types
export const DEFAULT_WEEK_TEMPLATE = [
  { day: 0, name: 'Sunday', isClimbDay: false, sessions: ['rest'], label: 'Rest Day', description: 'Recovery day' },
  { day: 1, name: 'Monday', isClimbDay: true, sessions: ['climb', 'miniA'], label: 'Climb + Mini A', description: 'Climbing session followed by Mini Strength A' },
  { day: 2, name: 'Tuesday', isClimbDay: false, sessions: ['strength1'], label: 'Strength Day 1', description: 'Pull-up strength + push + legs + core' },
  { day: 3, name: 'Wednesday', isClimbDay: true, sessions: ['climb', 'mobility'], label: 'Climb + Mobility', description: 'Climbing session followed by mobility work' },
  { day: 4, name: 'Thursday', isClimbDay: false, sessions: ['rest'], label: 'Rest Day', description: 'Rest or light walk' },
  { day: 5, name: 'Friday', isClimbDay: false, sessions: ['strength2'], label: 'Strength Day 2', description: 'Pull-up volume + push + hinge + core' },
  { day: 6, name: 'Saturday', isClimbDay: true, sessions: ['climb', 'miniB'], label: 'Climb + Mini B', description: 'Climbing session followed by Mini Strength B' }
];

// Available session types for the schedule customizer
export const AVAILABLE_SESSION_TYPES = [
  { id: 'rest', name: 'Rest Day', emoji: '😴', description: 'Recovery day' },
  { id: 'climb', name: 'Climbing', emoji: '🧗', description: 'Climbing session' },
  { id: 'strength1', name: 'Strength 1', emoji: '💪', description: 'Pull-up strength focus' },
  { id: 'strength2', name: 'Strength 2', emoji: '💪', description: 'Pull-up volume focus' },
  { id: 'miniA', name: 'Mini Strength A', emoji: '⚡', description: 'Quick post-climb strength' },
  { id: 'miniB', name: 'Mini Strength B', emoji: '⚡', description: 'Quick post-climb strength' },
  { id: 'mobility', name: 'Mobility', emoji: '🧘', description: 'Flexibility and recovery' }
];

// Warmup routine (6-8 minutes, before climbing + strength sessions)
export const WARMUP_ROUTINE = {
  id: 'warmup',
  name: 'Warmup',
  duration: '6-8 min',
  exercises: [
    {
      id: 'wrist-circles',
      name: 'Wrist circles + finger open/close',
      duration: 30,
      unit: 'sec each',
      description: 'Loosen up wrists and fingers'
    },
    {
      id: 'scap-pullups-warmup',
      name: 'Scap pull-ups',
      sets: 2,
      reps: 6,
      description: 'Tiny hang "shrug down" to activate shoulders'
    },
    {
      id: 'band-pull-aparts',
      name: 'Band pull-aparts or easy ring rows',
      sets: 2,
      reps: 10,
      description: 'Light upper back activation'
    },
    {
      id: 'bodyweight-squats',
      name: 'Bodyweight squats',
      reps: 10,
      description: 'Wake up the legs'
    },
    {
      id: 'dead-bug-warmup',
      name: 'Dead bug',
      reps: 6,
      perSide: true,
      description: 'Core activation, keep ribs down'
    }
  ]
};

// Session definitions with full exercise details
export const SESSIONS = {
  [SESSION_TYPES.STRENGTH_1]: {
    id: 'strength1',
    name: 'Strength Session 1',
    subtitle: 'Pull-up strength + push + legs + core',
    duration: '35-45 min',
    includeWarmup: true,
    restBetweenExercises: 120, // 2 min default
    exercises: [
      {
        id: 'assisted-pullup-heavy',
        name: 'Assisted Pull-ups (heavy band)',
        emoji: '💪',
        sets: 5,
        reps: 3,
        restSeconds: 120,
        progressionType: 'pullup',
        priority: 'A',
        notes: 'Choose a band where you could maybe do 4-5 max, but stop at 3 clean. Focus on control.',
        trackingType: 'reps'
      },
      {
        id: 'pushups-s1',
        name: 'Push-ups',
        emoji: '🙌',
        sets: 4,
        repsMin: 6,
        repsMax: 12,
        restSeconds: 90,
        progressionType: 'pushup',
        priority: 'B',
        notes: 'Start with normal push-ups. If form breaks, do hands elevated.',
        trackingType: 'reps'
      },
      {
        id: 'goblet-squat',
        name: 'Goblet Squat (KB)',
        emoji: '🏋️',
        sets: 3,
        repsMin: 8,
        repsMax: 10,
        restSeconds: 90,
        progressionType: 'legs',
        priority: 'C',
        notes: 'Choose a load you can control perfectly.',
        trackingType: 'reps'
      },
      {
        id: 'hollow-hold-s1',
        name: 'Hollow Hold',
        emoji: '🧘',
        sets: 3,
        durationMin: 15,
        durationMax: 25,
        unit: 'sec',
        restSeconds: 60,
        progressionType: 'core',
        priority: 'D',
        notes: 'Keep ribs down, no back arch. Dead bug is also OK.',
        trackingType: 'duration'
      },
      {
        id: 'mobility-finisher-1',
        name: 'Mobility Finisher',
        emoji: '🧘‍♀️',
        duration: 2,
        unit: 'min',
        priority: 'E',
        notes: 'Doorway pec stretch 30 sec/side, Child\'s pose + side reach 30 sec/side',
        trackingType: 'completion',
        isFinisher: true
      }
    ]
  },

  [SESSION_TYPES.STRENGTH_2]: {
    id: 'strength2',
    name: 'Strength Session 2',
    subtitle: 'Pull-up volume + push + hinge + core',
    duration: '35-45 min',
    includeWarmup: true,
    restBetweenExercises: 90,
    exercises: [
      {
        id: 'assisted-pullup-light',
        name: 'Assisted Pull-ups (lighter band)',
        emoji: '💪',
        sets: 4,
        reps: 6,
        restSeconds: 90,
        progressionType: 'pullup',
        priority: 'A',
        notes: 'All reps crisp. No kicking. Lighter band than Session 1.',
        trackingType: 'reps'
      },
      {
        id: 'ring-rows',
        name: 'Ring Rows',
        emoji: '🔗',
        sets: 3,
        repsMin: 10,
        repsMax: 15,
        restSeconds: 60,
        progressionType: 'pullup',
        priority: 'B',
        notes: 'Shoulder-friendly pulling volume.',
        trackingType: 'reps'
      },
      {
        id: 'pike-pushups',
        name: 'Pike Push-ups OR Ring Push-ups',
        emoji: '🙌',
        sets: 3,
        repsMin: 5,
        repsMax: 12,
        restSeconds: 90,
        progressionType: 'pushup',
        priority: 'C',
        notes: 'Pick one each week. Pike for shoulders, ring for chest + stability.',
        trackingType: 'reps',
        alternatives: ['Ring Push-ups']
      },
      {
        id: 'kb-deadlift',
        name: 'KB Deadlift',
        emoji: '🏋️',
        sets: 3,
        repsMin: 8,
        repsMax: 12,
        restSeconds: 90,
        progressionType: 'legs',
        priority: 'D',
        notes: 'Hinge pattern. Use a KB that\'s challenging but clean.',
        trackingType: 'reps'
      },
      {
        id: 'hanging-knee-raises',
        name: 'Hanging Knee Raises OR Side Plank',
        emoji: '🦵',
        sets: 3,
        repsMin: 6,
        repsMax: 10,
        altDurationMin: 20,
        altDurationMax: 30,
        altUnit: 'sec/side',
        restSeconds: 60,
        progressionType: 'core',
        priority: 'E',
        notes: 'If hanging bothers shoulders, do side plank instead.',
        trackingType: 'reps',
        alternatives: ['Side Plank']
      },
      {
        id: 'mobility-finisher-2',
        name: 'Mobility Finisher',
        emoji: '🧘‍♀️',
        duration: 2,
        unit: 'min',
        priority: 'F',
        notes: 'Couch stretch 45 sec/side, Ankle rocks 30 sec/side',
        trackingType: 'completion',
        isFinisher: true
      }
    ]
  },

  [SESSION_TYPES.MINI_A]: {
    id: 'miniA',
    name: 'Mini Strength A',
    subtitle: 'Light strength after climbing',
    duration: '10-15 min',
    includeWarmup: false,
    postClimb: true,
    restBetweenExercises: 60,
    exercises: [
      {
        id: 'easy-assisted-pullups',
        name: 'Easy Band-Assisted Pull-ups',
        emoji: '💪',
        sets: 3,
        reps: 3,
        restSeconds: 60,
        progressionType: 'pullup',
        notes: 'Not hard - just maintaining the movement pattern.',
        trackingType: 'reps'
      },
      {
        id: 'pushups-mini',
        name: 'Push-ups',
        emoji: '🙌',
        sets: 3,
        repsMin: 6,
        repsMax: 10,
        restSeconds: 60,
        progressionType: 'pushup',
        trackingType: 'reps'
      },
      {
        id: 'split-squat',
        name: 'Split Squat (bodyweight)',
        emoji: '🦵',
        sets: 2,
        reps: 8,
        perSide: true,
        restSeconds: 45,
        progressionType: 'legs',
        trackingType: 'reps'
      },
      {
        id: 'dead-bug-mini',
        name: 'Dead Bug',
        emoji: '🪲',
        sets: 2,
        reps: 6,
        perSide: true,
        restSeconds: 30,
        progressionType: 'core',
        trackingType: 'reps'
      }
    ]
  },

  [SESSION_TYPES.MINI_B]: {
    id: 'miniB',
    name: 'Mini Strength B',
    subtitle: 'Light strength after climbing',
    duration: '10-15 min',
    includeWarmup: false,
    postClimb: true,
    restBetweenExercises: 60,
    exercises: [
      {
        id: 'scap-pullups-mini',
        name: 'Scap Pull-ups',
        emoji: '🔝',
        sets: 2,
        reps: 8,
        restSeconds: 45,
        progressionType: 'pullup',
        notes: 'Shoulder blade activation from a hang.',
        trackingType: 'reps'
      },
      {
        id: 'ring-rows-easy',
        name: 'Ring Rows (easy-moderate)',
        emoji: '🔗',
        sets: 2,
        repsMin: 10,
        repsMax: 12,
        restSeconds: 60,
        progressionType: 'pullup',
        trackingType: 'reps'
      },
      {
        id: 'calf-raises',
        name: 'Calf Raises',
        emoji: '🦶',
        sets: 2,
        repsMin: 12,
        repsMax: 20,
        restSeconds: 30,
        progressionType: 'legs',
        notes: 'Good for footwork strength on the wall.',
        trackingType: 'reps'
      },
      {
        id: 'hollow-hold-mini',
        name: 'Hollow Hold',
        emoji: '🧘',
        sets: 2,
        durationMin: 15,
        durationMax: 25,
        unit: 'sec',
        restSeconds: 30,
        progressionType: 'core',
        trackingType: 'duration'
      }
    ]
  },

  [SESSION_TYPES.MOBILITY]: {
    id: 'mobility',
    name: 'Mobility Session',
    subtitle: 'Recovery and flexibility',
    duration: '10 min',
    includeWarmup: false,
    postClimb: true,
    exercises: [
      {
        id: 'shoulder-cars',
        name: 'Shoulder CARs',
        emoji: '🔄',
        reps: 5,
        perSide: true,
        notes: 'Slow controlled circles, full range of motion.',
        trackingType: 'reps'
      },
      {
        id: 'thoracic-openbooks',
        name: 'Thoracic Open Books',
        emoji: '📖',
        reps: 6,
        perSide: true,
        notes: 'Lie on side, rotate upper body open.',
        trackingType: 'reps'
      },
      {
        id: 'hip-flexor-stretch',
        name: 'Hip Flexor Stretch',
        emoji: '🧎',
        duration: 45,
        unit: 'sec',
        perSide: true,
        trackingType: 'duration'
      },
      {
        id: 'hamstring-stretch',
        name: 'Hamstring Stretch',
        emoji: '🦵',
        duration: 45,
        unit: 'sec',
        perSide: true,
        trackingType: 'duration'
      },
      {
        id: 'wrist-extensor-stretch',
        name: 'Wrist Extensor Stretch',
        emoji: '🤚',
        duration: 30,
        unit: 'sec',
        perSide: true,
        notes: 'Important for climbers!',
        trackingType: 'duration'
      }
    ]
  },

  [SESSION_TYPES.REST]: {
    id: 'rest',
    name: 'Rest Day',
    subtitle: 'Recovery is training too',
    duration: '0 min',
    exercises: [],
    isRestDay: true,
    tips: [
      'Take a light walk if you feel like moving',
      'Stay hydrated',
      'Get good sleep tonight',
      'Stretch if anything feels tight'
    ]
  },

  [SESSION_TYPES.CLIMB]: {
    id: 'climb',
    name: 'Climbing Day',
    subtitle: 'Focus on climbing',
    isClimbingSession: true,
    exercises: []
  },

  [SESSION_TYPES.CLIMB_EASY]: {
    id: 'climbEasy',
    name: 'Easy Climb or Rest',
    subtitle: 'Fun climbing only, or full rest',
    isClimbingSession: true,
    isOptional: true,
    exercises: [],
    tips: [
      'Keep it fun and easy today',
      'Work on technique, not hard sends',
      'Or take a full rest day if tired'
    ]
  }
};

// Progression rules for guided advancement
export const PROGRESSION_RULES = {
  pullup: {
    type: 'band_reduction',
    description: 'Reduce band assistance when all sets are clean',
    checkCriteria: (logs) => {
      // Need at least 2 sessions with all sets completed cleanly
      const recentLogs = logs.slice(-2);
      return recentLogs.length >= 2 &&
             recentLogs.every(log => log.allSetsClean && !log.struggled);
    },
    progressionMessage: 'Ready to try a lighter band or add 1 rep!',
    bands: ['heavy', 'medium-heavy', 'medium', 'light-medium', 'light', 'none']
  },
  pushup: {
    type: 'progression_ladder',
    description: 'Progress when hitting top of rep range',
    checkCriteria: (logs, repsMax) => {
      const recentLogs = logs.slice(-2);
      return recentLogs.length >= 2 &&
             recentLogs.every(log => log.avgReps >= repsMax);
    },
    progressionSteps: [
      'Hands elevated (easier)',
      'Normal push-ups',
      'Slow tempo (2 sec down)',
      'Deficit push-ups',
      'Add reps beyond range'
    ],
    progressionMessage: 'Time to make it harder! Try slower tempo or add reps.'
  },
  legs: {
    type: 'rep_then_weight',
    description: 'Add reps to top of range, then increase weight',
    checkCriteria: (logs, repsMax) => {
      const recentLogs = logs.slice(-2);
      return recentLogs.length >= 2 &&
             recentLogs.every(log => log.avgReps >= repsMax);
    },
    progressionMessage: 'Hitting the top of the range - add weight next time!'
  },
  core: {
    type: 'duration_increase',
    description: 'Add 5 seconds when consistently hitting top of range',
    checkCriteria: (logs, durationMax) => {
      const recentLogs = logs.slice(-2);
      return recentLogs.length >= 2 &&
             recentLogs.every(log => log.avgDuration >= durationMax);
    },
    progressionMessage: 'Core is getting stronger! Add 5 seconds next time.'
  }
};

// Deload configuration (every 4th week)
export const DELOAD_CONFIG = {
  frequency: 4, // Every 4th week is a deload
  setMultiplier: 0.6, // Reduce sets by 40%
  keepMobility: true, // Don't reduce mobility work
  message: 'Deload Week - Same exercises, fewer sets. Your body adapts during rest!',
  tips: [
    'Reduce sets by about 40% (e.g., 5x3 becomes 3x3)',
    'Keep the same weight/band level',
    'Focus on perfect form',
    'Climb a little easier this week too if possible',
    'This is when you get stronger!'
  ]
};

// Helper to get deload-adjusted sets
export function getDeloadSets(originalSets, isDeloadWeek) {
  if (!isDeloadWeek) return originalSets;
  return Math.max(1, Math.round(originalSets * DELOAD_CONFIG.setMultiplier));
}

// Helper to get session for a given day and climbing status
export function getSessionForDay(dayOfWeek, hasClimbed = false, weekTemplate = DEFAULT_WEEK_TEMPLATE) {
  const dayConfig = weekTemplate.find(d => d.day === dayOfWeek);
  if (!dayConfig) return null;

  // If it's a climbing day and user hasn't marked climbing yet
  if (dayConfig.isClimbDay && !hasClimbed) {
    return {
      awaitingClimb: true,
      afterClimbSession: SESSIONS[dayConfig.session],
      dayConfig
    };
  }

  // Return the session for this day
  return {
    session: SESSIONS[dayConfig.session],
    dayConfig
  };
}

// Get display info for a session type
export function getSessionDisplayInfo(sessionType) {
  const session = SESSIONS[sessionType];
  if (!session) return null;

  return {
    name: session.name,
    subtitle: session.subtitle,
    duration: session.duration,
    exerciseCount: session.exercises?.length || 0,
    isRestDay: session.isRestDay || false,
    isClimbingSession: session.isClimbingSession || false,
    postClimb: session.postClimb || false
  };
}
