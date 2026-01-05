// Achievement condition checking utility
// Returns array of achievement IDs that should be unlocked based on current state

export function checkAchievements(state, currentlyUnlocked = []) {
  const newAchievements = [];
  const { workouts, personalRecords, goals, stats, streaks } = state;

  // Helper to check if achievement is already unlocked
  const isUnlocked = (id) => currentlyUnlocked.some(a => a.id === id);

  // --- GENERAL ACHIEVEMENTS ---

  // First workout
  if (!isUnlocked('first-workout') && workouts.length >= 1) {
    newAchievements.push('first-workout');
  }

  // Week warrior (7-day streak)
  if (!isUnlocked('week-warrior') && streaks.current >= 7) {
    newAchievements.push('week-warrior');
  }

  // Month master (30-day streak)
  if (!isUnlocked('month-master') && streaks.current >= 30) {
    newAchievements.push('month-master');
  }

  // Century club (100 workouts)
  if (!isUnlocked('century-club') && workouts.length >= 100) {
    newAchievements.push('century-club');
  }

  // Data nerd (10 detailed logs)
  if (!isUnlocked('data-nerd') && (stats.detailedLogsCount || 0) >= 10) {
    newAchievements.push('data-nerd');
  }

  // Early bird (workout before 9am)
  if (!isUnlocked('early-bird')) {
    const hasEarlyWorkout = workouts.some(w => {
      const hour = new Date(w.date).getHours();
      return hour < 9;
    });
    if (hasEarlyWorkout) newAchievements.push('early-bird');
  }

  // Night owl (workout after 8pm)
  if (!isUnlocked('night-owl')) {
    const hasLateWorkout = workouts.some(w => {
      const hour = new Date(w.date).getHours();
      return hour >= 20;
    });
    if (hasLateWorkout) newAchievements.push('night-owl');
  }

  // --- TECHNIQUE ACHIEVEMENTS ---

  // Technique trainee (5 technique sessions)
  if (!isUnlocked('technique-trainee')) {
    const techniqueWorkouts = workouts.filter(w => w.type === 'technique');
    if (techniqueWorkouts.length >= 5) newAchievements.push('technique-trainee');
  }

  // --- STRENGTH ACHIEVEMENTS ---

  // Strength starter (10 strength workouts)
  if (!isUnlocked('strength-starter')) {
    const strengthWorkouts = workouts.filter(w => w.type === 'strength');
    if (strengthWorkouts.length >= 10) newAchievements.push('strength-starter');
  }

  // Plank pro (2 minute plank)
  if (!isUnlocked('plank-pro')) {
    const plankRecords = personalRecords.plank || [];
    const maxPlank = plankRecords.length > 0 ? Math.max(...plankRecords.map(r => r.value)) : 0;
    if (maxPlank >= 120) newAchievements.push('plank-pro');
  }

  // --- PULL-UP ACHIEVEMENTS ---

  // Training wheels (first assisted pull-up workout)
  if (!isUnlocked('training-wheels')) {
    const hasAssistedRecord = Object.values(personalRecords.assistedPullUps || {}).some(
      records => records && records.length > 0
    );
    if (hasAssistedRecord) newAchievements.push('training-wheels');
  }

  // 5 lb club (pull-ups with 5 lbs assist)
  if (!isUnlocked('five-lb-club')) {
    const fiveLbRecords = personalRecords.assistedPullUps?.[5] || [];
    if (fiveLbRecords.length > 0) newAchievements.push('five-lb-club');
  }

  // Liftoff (first unassisted pull-up)
  if (!isUnlocked('liftoff')) {
    const pullUps = personalRecords.pullUps || [];
    const maxPullUps = pullUps.length > 0 ? Math.max(...pullUps.map(r => r.value)) : 0;
    if (maxPullUps >= 1) newAchievements.push('liftoff');
  }

  // High five (5 unassisted pull-ups)
  if (!isUnlocked('high-five')) {
    const pullUps = personalRecords.pullUps || [];
    const maxPullUps = pullUps.length > 0 ? Math.max(...pullUps.map(r => r.value)) : 0;
    if (maxPullUps >= 5) newAchievements.push('high-five');
  }

  // Double digits (10 unassisted pull-ups)
  if (!isUnlocked('double-digits')) {
    const pullUps = personalRecords.pullUps || [];
    const maxPullUps = pullUps.length > 0 ? Math.max(...pullUps.map(r => r.value)) : 0;
    if (maxPullUps >= 10) newAchievements.push('double-digits');
  }

  // Pull-up champion (12 unassisted pull-ups)
  if (!isUnlocked('pullup-champion')) {
    const pullUps = personalRecords.pullUps || [];
    const maxPullUps = pullUps.length > 0 ? Math.max(...pullUps.map(r => r.value)) : 0;
    if (maxPullUps >= 12) newAchievements.push('pullup-champion');
  }

  // --- CLIMBING GRADE ACHIEVEMENTS ---

  const gradeAchievements = [
    { id: 'v1-victor', grade: 'V1' },
    { id: 'v2-vanquisher', grade: 'V2' },
    { id: 'v3-crusher', grade: 'V3' },
    { id: 'v4-slayer', grade: 'V4' },
    { id: 'v5-boss', grade: 'V5' },
    { id: 'v6-legend', grade: 'V6' }
  ];

  const boulderGrades = personalRecords.boulderGrade || [];
  const sentGrades = boulderGrades.map(r => r.value);

  gradeAchievements.forEach(({ id, grade }) => {
    if (!isUnlocked(id) && sentGrades.includes(grade)) {
      newAchievements.push(id);
    }
  });

  // --- HIDDEN ACHIEVEMENTS ---

  // Random warrior (20 random generator uses)
  if (!isUnlocked('random-warrior') && (stats.randomGeneratorUses || 0) >= 20) {
    newAchievements.push('random-warrior');
  }

  // Storyteller (25 workouts with notes)
  if (!isUnlocked('storyteller') && (stats.notesWritten || 0) >= 25) {
    newAchievements.push('storyteller');
  }

  // Creature of habit (same template 10 times)
  if (!isUnlocked('creature-of-habit')) {
    const templateUses = stats.templateUses || {};
    const maxUses = Math.max(0, ...Object.values(templateUses));
    if (maxUses >= 10) newAchievements.push('creature-of-habit');
  }

  return newAchievements;
}

// Check for PR-related achievements specifically after logging
export function checkPRBasedAchievements(prType, value, currentlyUnlocked = []) {
  const newAchievements = [];
  const isUnlocked = (id) => currentlyUnlocked.some(a => a.id === id);

  if (prType === 'pullUps') {
    if (!isUnlocked('liftoff') && value >= 1) newAchievements.push('liftoff');
    if (!isUnlocked('high-five') && value >= 5) newAchievements.push('high-five');
    if (!isUnlocked('double-digits') && value >= 10) newAchievements.push('double-digits');
    if (!isUnlocked('pullup-champion') && value >= 12) newAchievements.push('pullup-champion');
  }

  if (prType === 'plank' && value >= 120) {
    if (!isUnlocked('plank-pro')) newAchievements.push('plank-pro');
  }

  if (prType === 'boulderGrade') {
    const gradeMap = {
      'V1': 'v1-victor',
      'V2': 'v2-vanquisher',
      'V3': 'v3-crusher',
      'V4': 'v4-slayer',
      'V5': 'v5-boss',
      'V6': 'v6-legend'
    };
    const achievementId = gradeMap[value];
    if (achievementId && !isUnlocked(achievementId)) {
      newAchievements.push(achievementId);
    }
  }

  return newAchievements;
}
