// Achievements/Badges for Climb Quest

export const achievements = [
  // General achievements
  {
    id: 'first-workout',
    name: 'First Steps',
    emoji: '🏅',
    description: 'Log your first workout',
    category: 'general',
    hidden: false
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    emoji: '🔥',
    description: 'Complete a 7-day workout streak',
    category: 'general',
    hidden: false
  },
  {
    id: 'month-master',
    name: 'Month Master',
    emoji: '📅',
    description: 'Complete a 30-day workout streak',
    category: 'general',
    hidden: false
  },
  {
    id: 'century-club',
    name: 'Century Club',
    emoji: '🌟',
    description: 'Log 100 workouts',
    category: 'general',
    hidden: false
  },
  {
    id: 'goal-crusher',
    name: 'Goal Crusher',
    emoji: '🎯',
    description: 'Complete any goal',
    category: 'general',
    hidden: false
  },
  {
    id: 'data-nerd',
    name: 'Data Nerd',
    emoji: '📈',
    description: 'Use detailed logging 10 times',
    category: 'general',
    hidden: false
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    emoji: '🌄',
    description: 'Log a workout before 9am',
    category: 'general',
    hidden: false
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    emoji: '🦉',
    description: 'Log a workout after 8pm',
    category: 'general',
    hidden: false
  },

  // Technique achievements
  {
    id: 'technique-trainee',
    name: 'Technique Trainee',
    emoji: '🦎',
    description: 'Complete 5 technique-focused sessions',
    category: 'technique',
    hidden: false
  },
  {
    id: 'silent-ninja',
    name: 'Silent Ninja',
    emoji: '🤫',
    description: 'Do Silent Feet drill 10 times',
    category: 'technique',
    hidden: false
  },
  {
    id: 'dyno-daredevil',
    name: 'Dyno Daredevil',
    emoji: '🦘',
    description: 'Log 10 dyno sessions',
    category: 'technique',
    hidden: false
  },

  // Strength achievements
  {
    id: 'strength-starter',
    name: 'Strength Starter',
    emoji: '💪',
    description: 'Complete 10 strength workouts',
    category: 'strength',
    hidden: false
  },
  {
    id: 'flexibility-fan',
    name: 'Flexibility Fan',
    emoji: '🧘',
    description: 'Complete 10 stretch sessions',
    category: 'strength',
    hidden: false
  },
  {
    id: 'plank-pro',
    name: 'Plank Pro',
    emoji: '⏱️',
    description: 'Hold a 2-minute plank',
    category: 'strength',
    hidden: false
  },

  // Pull-up achievements
  {
    id: 'training-wheels',
    name: 'Training Wheels',
    emoji: '🎡',
    description: 'Log your first assisted pull-up workout',
    category: 'pullups',
    hidden: false
  },
  {
    id: 'less-help',
    name: 'Less Help Please!',
    emoji: '📉',
    description: 'Set a PR at a lower assist level than before',
    category: 'pullups',
    hidden: false
  },
  {
    id: 'five-lb-club',
    name: '5 lb Club',
    emoji: '🏅',
    description: 'Do pull-ups with only 5 lbs of assist',
    category: 'pullups',
    hidden: false
  },
  {
    id: 'liftoff',
    name: 'Liftoff!',
    emoji: '🚀',
    description: 'Do your first unassisted pull-up',
    category: 'pullups',
    hidden: false
  },
  {
    id: 'high-five',
    name: 'High Five',
    emoji: '🖐️',
    description: 'Do 5 unassisted pull-ups',
    category: 'pullups',
    hidden: false
  },
  {
    id: 'double-digits',
    name: 'Double Digits',
    emoji: '🔟',
    description: 'Do 10 unassisted pull-ups',
    category: 'pullups',
    hidden: false
  },
  {
    id: 'pullup-champion',
    name: 'Pull-up Champion',
    emoji: '👑',
    description: 'Achieve 12 unassisted pull-ups',
    category: 'pullups',
    hidden: false
  },

  // Climbing grade achievements
  {
    id: 'v1-victor',
    name: 'V1 Victor',
    emoji: '🪨',
    description: 'Send your first V1',
    category: 'grades',
    hidden: false
  },
  {
    id: 'v2-vanquisher',
    name: 'V2 Vanquisher',
    emoji: '🪨',
    description: 'Send your first V2',
    category: 'grades',
    hidden: false
  },
  {
    id: 'v3-crusher',
    name: 'V3 Crusher',
    emoji: '🪨',
    description: 'Send your first V3',
    category: 'grades',
    hidden: false
  },
  {
    id: 'v4-slayer',
    name: 'V4 Slayer',
    emoji: '🪨',
    description: 'Send your first V4',
    category: 'grades',
    hidden: false
  },
  {
    id: 'v5-boss',
    name: 'V5 Boss',
    emoji: '🪨',
    description: 'Send your first V5',
    category: 'grades',
    hidden: false
  },
  {
    id: 'v6-legend',
    name: 'V6 Legend',
    emoji: '🪨',
    description: 'Send your first V6 - Main Goal!',
    category: 'grades',
    hidden: false
  },

  // Hidden/discoverable achievements
  {
    id: 'random-warrior',
    name: 'Random Warrior',
    emoji: '🎲',
    description: 'Use the random workout generator 20 times',
    category: 'hidden',
    hidden: true
  },
  {
    id: 'storyteller',
    name: 'Storyteller',
    emoji: '📝',
    description: 'Write notes on 25 workouts',
    category: 'hidden',
    hidden: true
  },
  {
    id: 'creature-of-habit',
    name: 'Creature of Habit',
    emoji: '🔄',
    description: 'Use the same template 10 times',
    category: 'hidden',
    hidden: true
  }
];

export const getAchievementById = (id) => {
  return achievements.find(a => a.id === id);
};

export const getAchievementsByCategory = (category) => {
  return achievements.filter(a => a.category === category && !a.hidden);
};

export const getVisibleAchievements = () => {
  return achievements.filter(a => !a.hidden);
};

export const getHiddenAchievements = () => {
  return achievements.filter(a => a.hidden);
};
