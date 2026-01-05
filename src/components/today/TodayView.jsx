import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Target, ChevronRight } from 'lucide-react';
import { PageContainer, PageSection } from '../layout';
import { Card, Button, Badge, ProgressBar } from '../common';
import { WorkoutGenerator } from '../generator';
import { WorkoutLogger } from '../logging';
import { StreakCard, useGamification } from '../gamification';
import { getLevelForXP, getProgressToNextLevel, XP_REWARDS } from '../../data/levels';
import { checkAchievements } from '../../utils/achievementChecker';

export function TodayView({
  appState,
  onAddWorkout,
  onSaveTemplate,
  onSavePRs,
  onCheckAchievements,
  onUseStreakFreeze,
  onIncrementStat,
  activeWorkout: externalActiveWorkout,
  setActiveWorkout: setExternalActiveWorkout
}) {
  const [showGenerator, setShowGenerator] = useState(false);
  const [internalActiveWorkout, setInternalActiveWorkout] = useState(null);
  const [showLogger, setShowLogger] = useState(false);

  const { showXPGain, showAchievementUnlock, showLevelUp, showStreakMilestone } = useGamification();

  // Use external active workout if provided, otherwise use internal
  const activeWorkout = externalActiveWorkout || internalActiveWorkout;
  const setActiveWorkout = setExternalActiveWorkout || setInternalActiveWorkout;

  const { profile, workouts, streaks, goals, personalRecords, achievements } = appState;
  const today = format(new Date(), 'EEEE, MMMM d');

  // Get today's workouts
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todaysWorkouts = workouts.filter(w =>
    w.date && w.date.startsWith(todayStr)
  );

  // Level info
  const levelInfo = getLevelForXP(profile.totalXP);
  const progressInfo = getProgressToNextLevel(profile.totalXP);

  // Active goals
  const activeGoals = goals.filter(g => !g.completed).slice(0, 2);

  const handleStartWorkout = (workout) => {
    setActiveWorkout(workout);
    setShowGenerator(false);
  };

  const handleSaveTemplate = (workout) => {
    if (onSaveTemplate) {
      onSaveTemplate({
        name: `Workout ${format(new Date(), 'MMM d')}`,
        type: workout.options?.focus || 'mixed',
        exercises: workout.exercises.map(e => e.id),
        estimatedMinutes: workout.estimatedMinutes
      });
    }
  };

  const handleLogWorkout = () => {
    if (activeWorkout) {
      setShowLogger(true);
    }
  };

  const handleCompleteLog = (logData) => {
    const previousLevel = levelInfo.level;
    const previousXP = profile.totalXP;

    // Add the workout
    if (onAddWorkout) {
      onAddWorkout({
        ...activeWorkout,
        ...logData,
        exercises: activeWorkout.exercises.map(e => ({
          exerciseId: e.id,
          sets: e.defaultSets,
          completed: true
        }))
      });
    }

    // Calculate XP earned
    let xpEarned = XP_REWARDS.COMPLETE_WORKOUT;
    if (logData.exerciseLogs) {
      // Detailed log bonus
      xpEarned += XP_REWARDS.DETAILED_LOG_BONUS;
      if (onIncrementStat) {
        onIncrementStat('detailedLogsCount');
      }
    }
    if (logData.notes) {
      if (onIncrementStat) {
        onIncrementStat('notesWritten');
      }
    }

    // Show XP gain animation
    showXPGain(xpEarned);

    // Check for new level
    const newXP = previousXP + xpEarned;
    const newLevel = getLevelForXP(newXP);
    if (newLevel.level > previousLevel) {
      setTimeout(() => {
        showLevelUp(newLevel);
      }, 1500);
    }

    // Check for new achievements
    setTimeout(() => {
      const newAchievementIds = checkAchievements(
        { ...appState, workouts: [...workouts, logData] },
        achievements
      );

      newAchievementIds.forEach((id, index) => {
        if (onCheckAchievements) {
          onCheckAchievements(id);
        }
        setTimeout(() => {
          showAchievementUnlock(id);
        }, index * 500);
      });
    }, 2000);

    // Check for streak milestones
    const newStreak = streaks.current + 1;
    if ([7, 14, 30, 60, 100].includes(newStreak)) {
      setTimeout(() => {
        showStreakMilestone(newStreak);
      }, 3500);
    }

    setActiveWorkout(null);
    setShowLogger(false);
  };

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (showGenerator) {
    return (
      <PageContainer>
        <WorkoutGenerator
          onStartWorkout={handleStartWorkout}
          onSaveWorkout={handleSaveTemplate}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header with greeting */}
      <div className="mb-6">
        <p className="text-[--color-text-muted]">{today}</p>
        <h1 className="text-2xl font-bold text-[--color-secondary]">
          {greeting}{profile.name ? `, ${profile.name}` : ''}! 🧗
        </h1>
      </div>

      {/* Level & XP Card */}
      <Card className="mb-4 bg-gradient-to-r from-[--color-secondary] to-[--color-secondary-light] text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white/70 text-sm">Level {levelInfo.level}</p>
            <p className="text-xl font-bold">{levelInfo.emoji} {levelInfo.name}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{profile.totalXP}</p>
            <p className="text-white/70 text-sm">Total XP</p>
          </div>
        </div>
        <ProgressBar
          value={progressInfo.progress}
          max={100}
          size="sm"
          color="celebration"
        />
        <p className="text-xs text-white/70 mt-2">
          {progressInfo.xpToNext > 0
            ? `${progressInfo.xpToNext} XP to next level`
            : 'Max level reached!'
          }
        </p>
      </Card>

      {/* Enhanced Streak Card */}
      <div className="mb-4">
        <StreakCard
          streaks={streaks}
          onUseFreeze={onUseStreakFreeze}
        />
      </div>

      {/* Active Workout */}
      {activeWorkout && (
        <PageSection title="Current Workout">
          <Card className="border-2 border-[--color-primary]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <Badge variant="primary">In Progress</Badge>
                <p className="font-bold text-[--color-secondary] mt-2">
                  {activeWorkout.exercises?.length || 0} exercises
                </p>
              </div>
              <p className="text-2xl">💪</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveWorkout(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleLogWorkout}
                className="flex-1"
              >
                Finish & Log
              </Button>
            </div>
          </Card>
        </PageSection>
      )}

      {/* Today's Activity */}
      <PageSection title="Today's Activity">
        {todaysWorkouts.length > 0 ? (
          <div className="space-y-2">
            {todaysWorkouts.map(workout => (
              <Card key={workout.id} padding="sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {workout.completed ? '✅' : '📝'}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-[--color-secondary]">
                      {workout.type || 'Workout'} completed
                    </p>
                    <p className="text-xs text-[--color-text-muted]">
                      +{workout.xpEarned || 50} XP
                    </p>
                  </div>
                  {workout.rating && (
                    <span className="text-xl">{workout.rating}</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <p className="text-4xl mb-3">🎯</p>
            <p className="font-semibold text-[--color-secondary]">
              No workouts yet today
            </p>
            <p className="text-sm text-[--color-text-muted] mt-1 mb-4">
              Ready to crush it?
            </p>
            <Button onClick={() => setShowGenerator(true)}>
              <Plus size={18} className="mr-1" />
              Start a Workout
            </Button>
          </Card>
        )}
      </PageSection>

      {/* Goals Preview */}
      {activeGoals.length > 0 && (
        <PageSection
          title="Goals"
          action={
            <button className="text-[--color-primary] text-sm font-medium flex items-center">
              See all <ChevronRight size={16} />
            </button>
          }
        >
          <div className="space-y-2">
            {activeGoals.map(goal => (
              <Card key={goal.id} padding="sm">
                <div className="flex items-center gap-3">
                  <Target className="text-[--color-primary]" size={20} />
                  <div className="flex-1">
                    <p className="font-medium text-[--color-secondary]">{goal.text}</p>
                    <p className="text-xs text-[--color-text-muted]">
                      Due: {format(new Date(goal.deadline), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </PageSection>
      )}

      {/* Quick Actions */}
      {!activeWorkout && todaysWorkouts.length === 0 && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-[--color-background] to-transparent">
          <Button
            onClick={() => setShowGenerator(true)}
            fullWidth
            size="lg"
            className="shadow-lg"
          >
            <Plus size={20} className="mr-2" />
            Create Workout
          </Button>
        </div>
      )}

      {/* Workout Logger Modal */}
      <WorkoutLogger
        workout={activeWorkout}
        personalRecords={personalRecords}
        isOpen={showLogger}
        onClose={() => setShowLogger(false)}
        onComplete={handleCompleteLog}
        onSavePRs={onSavePRs}
      />
    </PageContainer>
  );
}

export default TodayView;
