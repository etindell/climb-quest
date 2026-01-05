import { exercises, getExercisesByCategory } from '../data/exercises';

// Workout duration configs (in minutes)
const DURATION_CONFIG = {
  20: { warmup: 5, main: 12, cooldown: 3, mainExercises: 3 },
  30: { warmup: 5, main: 20, cooldown: 5, mainExercises: 4 },
  45: { warmup: 7, main: 30, cooldown: 8, mainExercises: 5 },
  60: { warmup: 10, main: 40, cooldown: 10, mainExercises: 6 }
};

// Focus area to category mapping
const FOCUS_CATEGORIES = {
  technique: ['on-wall-technique'],
  strength: ['off-wall-strength', 'off-wall-pulling'],
  endurance: ['on-wall-endurance'],
  mix: ['on-wall-technique', 'on-wall-endurance', 'on-wall-power', 'off-wall-strength', 'off-wall-pulling']
};

// Shuffle array randomly
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random exercises from a list
function getRandomExercises(exerciseList, count) {
  const shuffled = shuffleArray(exerciseList);
  return shuffled.slice(0, count);
}

// Filter exercises by location
function filterByLocation(exerciseList, location) {
  if (location === 'both' || !location) return exerciseList;
  return exerciseList.filter(ex => ex.location === location || ex.location === 'both');
}

// Calculate estimated duration for an exercise
function getExerciseDuration(exercise) {
  if (exercise.trackingType === 'duration') {
    return Math.ceil((exercise.defaultDuration * exercise.defaultSets) / 60); // Convert to minutes
  }
  // Estimate 30 seconds per rep for most exercises, plus rest
  const reps = exercise.defaultReps || 1;
  const timePerSet = Math.max(reps * 30, 30); // At least 30 seconds per set
  return Math.ceil((timePerSet * exercise.defaultSets + 60 * (exercise.defaultSets - 1)) / 60);
}

export function generateWorkout(options = {}) {
  const {
    duration = 30,
    location = 'gym',
    energy = 'medium',
    focus = 'mix',
    includeStretching = true
  } = options;

  const config = DURATION_CONFIG[duration] || DURATION_CONFIG[30];
  const workout = {
    id: crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
    options,
    exercises: [],
    estimatedMinutes: duration
  };

  // 1. Add warm-up exercises
  const warmupExercises = filterByLocation(
    getExercisesByCategory('warmup'),
    location
  );
  const warmups = getRandomExercises(warmupExercises, 2);
  warmups.forEach(ex => {
    workout.exercises.push({
      ...ex,
      section: 'warmup'
    });
  });

  // 2. Add main exercises based on focus
  const focusCategories = FOCUS_CATEGORIES[focus] || FOCUS_CATEGORIES.mix;
  let mainPool = [];

  focusCategories.forEach(cat => {
    const catExercises = filterByLocation(getExercisesByCategory(cat), location);
    mainPool = [...mainPool, ...catExercises];
  });

  // Adjust for energy level
  if (energy === 'low') {
    // Prefer easier exercises
    mainPool = mainPool.filter(ex => ex.difficulty <= 2);
  } else if (energy === 'high') {
    // Include all, but favor harder ones
    mainPool = shuffleArray(mainPool).sort((a, b) => b.difficulty - a.difficulty);
  }

  // For technique focus (youth), heavily favor technique drills
  if (focus === 'technique' || focus === 'mix') {
    const techniqueExercises = filterByLocation(
      getExercisesByCategory('on-wall-technique'),
      location
    );
    // Add more technique exercises to the pool
    mainPool = [...mainPool, ...techniqueExercises, ...techniqueExercises];
  }

  // Select main exercises
  const mainExercises = getRandomExercises(mainPool, config.mainExercises);
  const seenIds = new Set(warmups.map(e => e.id));

  mainExercises.forEach(ex => {
    if (!seenIds.has(ex.id)) {
      workout.exercises.push({
        ...ex,
        section: 'main'
      });
      seenIds.add(ex.id);
    }
  });

  // 3. Add flexibility if there's time and focus allows
  if (includeStretching && (focus !== 'technique' || duration >= 30)) {
    const flexExercises = filterByLocation(
      getExercisesByCategory('flexibility'),
      location
    );
    const flexPick = getRandomExercises(flexExercises, 1);
    flexPick.forEach(ex => {
      if (!seenIds.has(ex.id)) {
        workout.exercises.push({
          ...ex,
          section: 'main'
        });
        seenIds.add(ex.id);
      }
    });
  }

  // 4. Add cool-down
  const cooldownExercises = filterByLocation(
    getExercisesByCategory('cooldown'),
    location
  );
  const cooldowns = getRandomExercises(cooldownExercises, 2);
  cooldowns.forEach(ex => {
    if (!seenIds.has(ex.id)) {
      workout.exercises.push({
        ...ex,
        section: 'cooldown'
      });
      seenIds.add(ex.id);
    }
  });

  // Calculate actual estimated time
  let totalMinutes = 0;
  workout.exercises.forEach(ex => {
    totalMinutes += getExerciseDuration(ex);
  });
  workout.estimatedMinutes = totalMinutes;

  return workout;
}

export function swapExercise(workout, exerciseIndex, location = 'gym') {
  const currentExercise = workout.exercises[exerciseIndex];
  const section = currentExercise.section;

  // Get category for the current exercise
  let pool;
  if (section === 'warmup') {
    pool = getExercisesByCategory('warmup');
  } else if (section === 'cooldown') {
    pool = getExercisesByCategory('cooldown');
  } else {
    pool = exercises.filter(ex => ex.category === currentExercise.category);
  }

  // Filter by location and exclude current exercises
  pool = filterByLocation(pool, location);
  const usedIds = new Set(workout.exercises.map(e => e.id));
  pool = pool.filter(ex => !usedIds.has(ex.id));

  if (pool.length === 0) {
    // No alternatives available
    return workout;
  }

  const newExercise = getRandomExercises(pool, 1)[0];

  return {
    ...workout,
    exercises: workout.exercises.map((ex, i) =>
      i === exerciseIndex ? { ...newExercise, section } : ex
    )
  };
}

export function getWorkoutType(workout) {
  const categories = workout.exercises
    .filter(ex => ex.section === 'main')
    .map(ex => ex.category);

  const hasTechnique = categories.some(c => c.includes('technique'));
  const hasStrength = categories.some(c => c.includes('strength') || c.includes('pulling'));
  const hasEndurance = categories.some(c => c.includes('endurance'));
  const hasPower = categories.some(c => c.includes('power'));

  if (hasTechnique && !hasStrength && !hasEndurance) return 'technique';
  if (hasStrength && !hasTechnique && !hasEndurance) return 'strength';
  if (hasEndurance && !hasTechnique && !hasStrength) return 'endurance';
  return 'mixed';
}
