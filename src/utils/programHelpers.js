// Program helper utilities for Climb Quest
import { format, startOfWeek, addDays, differenceInWeeks, parseISO, isToday } from 'date-fns';
import {
  SESSION_TYPES,
  SESSIONS,
  DEFAULT_WEEK_TEMPLATE,
  PROGRESSION_RULES,
  DELOAD_CONFIG,
  getDeloadSets
} from '../data/program';

/**
 * Check if a specific session type was completed today
 */
function isSessionCompletedToday(programState, sessionId, dateStr) {
  return programState.sessionHistory.some(
    s => s.date === dateStr && s.sessionType === sessionId && s.completed
  );
}

/**
 * Get today's sessions based on program state (multi-session support)
 */
export function getTodaySession(programState, currentDate = new Date()) {
  const dayOfWeek = currentDate.getDay();
  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const template = programState.weekTemplate || DEFAULT_WEEK_TEMPLATE;
  const dayConfig = template.find(d => d.day === dayOfWeek);

  if (!dayConfig) {
    return { error: 'Invalid day configuration' };
  }

  const isDeload = programState.currentWeek === 4;
  const climbingDayInfo = programState.climbingDays[dateStr] || {};

  // Get sessions array (support both old 'session' and new 'sessions' format)
  const sessionIds = dayConfig.sessions || [dayConfig.session];

  // Rest day check
  if (sessionIds.length === 1 && sessionIds[0] === SESSION_TYPES.REST) {
    return {
      isRestDay: true,
      session: SESSIONS[SESSION_TYPES.REST],
      sessions: [],
      dayConfig,
      allComplete: true
    };
  }

  // Build list of sessions for today
  const todaySessions = [];

  for (const sessionId of sessionIds) {
    if (sessionId === SESSION_TYPES.REST) continue;

    const isClimbing = sessionId === SESSION_TYPES.CLIMB;
    const session = SESSIONS[sessionId];

    if (!session) continue;

    // Determine completion status
    let completed = false;
    if (isClimbing) {
      completed = !!climbingDayInfo.climbingLogged;
    } else {
      completed = !!climbingDayInfo.strengthLogged ||
                  isSessionCompletedToday(programState, sessionId, dateStr);
    }

    todaySessions.push({
      session: isClimbing ? session : applyDeloadToSession(session, isDeload),
      sessionId,
      isClimbing,
      completed,
      isDeloadWeek: isDeload
    });
  }

  const allComplete = todaySessions.length > 0 && todaySessions.every(s => s.completed);

  return {
    dayConfig,
    sessions: todaySessions,
    isRestDay: false,
    allComplete,
    isDeloadWeek: isDeload,
    climbingLogged: climbingDayInfo.climbingLogged,
    strengthLogged: climbingDayInfo.strengthLogged
  };
}

/**
 * Apply deload modifications to a session
 */
export function applyDeloadToSession(session, isDeload) {
  if (!isDeload || !session.exercises || session.exercises.length === 0) {
    return session;
  }

  return {
    ...session,
    isDeloadModified: true,
    exercises: session.exercises.map(exercise => {
      // Don't modify finishers or mobility
      if (exercise.isFinisher || exercise.trackingType === 'completion') {
        return exercise;
      }

      return {
        ...exercise,
        sets: getDeloadSets(exercise.sets, true),
        deloadOriginalSets: exercise.sets
      };
    })
  };
}

/**
 * Get progress statistics for the current week (multi-session support)
 */
export function getWeekProgress(programState, currentDate = new Date()) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
  const template = programState.weekTemplate || DEFAULT_WEEK_TEMPLATE;

  const weekDays = template.map((dayConfig, index) => {
    const date = addDays(weekStart, index);
    const dateStr = format(date, 'yyyy-MM-dd');
    const climbingDayInfo = programState.climbingDays[dateStr] || {};

    // Get sessions array (support both old 'session' and new 'sessions' format)
    const sessionIds = dayConfig.sessions || [dayConfig.session];

    // Build session info for this day
    const sessions = sessionIds.map(sessionId => {
      const isClimbing = sessionId === SESSION_TYPES.CLIMB;
      let completed = false;

      if (sessionId === SESSION_TYPES.REST) {
        completed = true;
      } else if (isClimbing) {
        completed = !!climbingDayInfo.climbingLogged;
      } else {
        completed = !!climbingDayInfo.strengthLogged ||
                    isSessionCompletedToday(programState, sessionId, dateStr);
      }

      return {
        sessionId,
        isClimbing,
        isRest: sessionId === SESSION_TYPES.REST,
        completed
      };
    });

    const allComplete = sessions.every(s => s.completed);
    const isRestDay = sessionIds.length === 1 && sessionIds[0] === SESSION_TYPES.REST;

    return {
      ...dayConfig,
      date,
      dateStr,
      isToday: isToday(date),
      isPast: date < new Date() && !isToday(date),
      isFuture: date > new Date(),
      sessions,
      allComplete,
      isRestDay,
      climbingLogged: climbingDayInfo.climbingLogged,
      strengthLogged: climbingDayInfo.strengthLogged
    };
  });

  // Count completed sessions
  let completedCount = 0;
  let totalRequired = 0;

  weekDays.forEach(day => {
    day.sessions.forEach(s => {
      if (!s.isRest) {
        totalRequired++;
        if (s.completed) completedCount++;
      }
    });
  });

  return {
    weekDays,
    completedCount,
    totalRequired,
    percentComplete: totalRequired > 0 ? Math.round((completedCount / totalRequired) * 100) : 0,
    currentWeek: programState.currentWeek,
    cycleNumber: programState.cycleNumber,
    isDeloadWeek: programState.currentWeek === 4
  };
}

/**
 * Check if an exercise is ready for progression
 */
export function shouldSuggestProgression(programState, exerciseId) {
  const exerciseProgress = programState.exerciseProgress[exerciseId];
  if (!exerciseProgress || !exerciseProgress.logs || exerciseProgress.logs.length < 2) {
    return { ready: false, reason: 'Need more sessions to evaluate' };
  }

  // Find the exercise definition to get progression type
  let exerciseDef = null;
  let progressionType = null;

  for (const sessionKey of Object.keys(SESSIONS)) {
    const session = SESSIONS[sessionKey];
    if (session.exercises) {
      const found = session.exercises.find(e => e.id === exerciseId);
      if (found) {
        exerciseDef = found;
        progressionType = found.progressionType;
        break;
      }
    }
  }

  if (!progressionType || !PROGRESSION_RULES[progressionType]) {
    return { ready: false, reason: 'No progression rules defined' };
  }

  const rule = PROGRESSION_RULES[progressionType];
  const logs = exerciseProgress.logs;

  // Determine max value for checking
  const repsMax = exerciseDef?.repsMax || exerciseDef?.reps;
  const durationMax = exerciseDef?.durationMax;

  let isReady = false;
  if (progressionType === 'pullup') {
    isReady = rule.checkCriteria(logs);
  } else if (progressionType === 'pushup' || progressionType === 'legs') {
    isReady = rule.checkCriteria(logs, repsMax);
  } else if (progressionType === 'core') {
    isReady = rule.checkCriteria(logs, durationMax);
  }

  return {
    ready: isReady,
    progressionType,
    message: isReady ? rule.progressionMessage : null,
    currentLevel: exerciseProgress.currentLevel || 'starting',
    sessionCount: logs.length
  };
}

/**
 * Calculate XP for completing a session
 */
export function calculateSessionXP(sessionType, logData = {}) {
  let xp = 50; // Base XP for any session completion

  // Bonus for strength sessions (harder)
  if (sessionType === SESSION_TYPES.STRENGTH_1 || sessionType === SESSION_TYPES.STRENGTH_2) {
    xp += 25;
  }

  // Bonus for detailed logging
  if (logData.detailedLog) {
    xp += 10;
  }

  // Bonus for notes
  if (logData.notes && logData.notes.length > 0) {
    xp += 5;
  }

  return xp;
}

/**
 * Determine if it's time to advance to next week
 */
export function shouldAdvanceWeek(programState, currentDate = new Date()) {
  if (!programState.startDate) return false;

  const startDate = parseISO(programState.startDate);
  const weeksSinceStart = differenceInWeeks(currentDate, startDate);

  // Each cycle is 4 weeks
  const expectedWeek = (weeksSinceStart % 4) + 1;
  const expectedCycle = Math.floor(weeksSinceStart / 4) + 1;

  return (
    programState.currentWeek !== expectedWeek ||
    programState.cycleNumber !== expectedCycle
  );
}

/**
 * Get the correct week and cycle based on start date
 */
export function getCurrentWeekAndCycle(startDate, currentDate = new Date()) {
  if (!startDate) {
    return { currentWeek: 1, cycleNumber: 1 };
  }

  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const weeksSinceStart = Math.max(0, differenceInWeeks(currentDate, start));

  return {
    currentWeek: (weeksSinceStart % 4) + 1,
    cycleNumber: Math.floor(weeksSinceStart / 4) + 1
  };
}

/**
 * Get summary of exercises that are ready for progression
 */
export function getProgressionSummary(programState) {
  const readyToProgress = [];

  for (const exerciseId of Object.keys(programState.exerciseProgress || {})) {
    const result = shouldSuggestProgression(programState, exerciseId);
    if (result.ready) {
      readyToProgress.push({
        exerciseId,
        ...result
      });
    }
  }

  return readyToProgress;
}

/**
 * Format session duration for display
 */
export function formatSessionDuration(session) {
  if (!session) return '';
  if (session.duration) return session.duration;
  if (session.isRestDay) return 'Rest';

  // Estimate based on exercises
  const exerciseCount = session.exercises?.length || 0;
  if (exerciseCount === 0) return '';

  const avgMinutesPerExercise = 5;
  const estimated = exerciseCount * avgMinutesPerExercise;
  return `~${estimated} min`;
}

/**
 * Get motivational message based on week progress
 */
export function getMotivationalMessage(weekProgress) {
  const { percentComplete, isDeloadWeek, currentWeek } = weekProgress;

  if (isDeloadWeek) {
    return "Deload week - lighter loads, same movement quality. Recovery is when you get stronger!";
  }

  if (percentComplete === 100) {
    return "Amazing week! You crushed every session!";
  }

  if (percentComplete >= 75) {
    return "Almost there! Finish strong this week!";
  }

  if (percentComplete >= 50) {
    return "Halfway through the week - keep the momentum going!";
  }

  if (currentWeek === 1) {
    return "Fresh cycle! Build that base.";
  }

  return "Every session counts. Let's do this!";
}
