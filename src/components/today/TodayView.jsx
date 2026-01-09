import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Target, ChevronRight, Play } from 'lucide-react';
import { PageContainer, PageSection } from '../layout';
import { Card, Button, Badge, ProgressBar } from '../common';
import { SessionView, SessionCard } from '../session';
import { WeekOverview } from '../program';
import { DeloadBanner } from '../program';
import { ClimbingLogCard } from './ClimbingLogCard';
import { StreakCard, useGamification } from '../gamification';
import { getLevelForXP, getProgressToNextLevel, XP_REWARDS } from '../../data/levels';
import { SESSIONS } from '../../data/program';
import { getTodaySession, getWeekProgress, getProgressionSummary } from '../../utils/programHelpers';
import { checkAchievements } from '../../utils/achievementChecker';

export function TodayView({
  appState,
  onAddWorkout,
  onSaveTemplate,
  onSavePRs,
  onCheckAchievements,
  onUseStreakFreeze,
  onIncrementStat,
  // Program actions
  onStartProgram,
  onLogClimbingSession,
  onMarkClimbingDay,
  onCompleteSession,
  onUpdateExerciseProgress,
  onSyncProgramWeek
}) {
  const [activeSession, setActiveSession] = useState(null);
  const [showSessionView, setShowSessionView] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const { showXPGain, showAchievementUnlock, showLevelUp, showStreakMilestone } = useGamification();

  const { profile, workouts, streaks, goals, achievements, program } = appState;
  const today = format(new Date(), 'EEEE, MMMM d');

  // Sync program week on load
  useEffect(() => {
    if (program?.isActive && onSyncProgramWeek) {
      onSyncProgramWeek();
    }
  }, []);

  // Get today's session info
  const todaySessionInfo = program?.isActive
    ? getTodaySession(program)
    : null;

  // Get week progress
  const weekProgress = program?.isActive
    ? getWeekProgress(program)
    : null;

  // Get progression summary
  const progressionSummary = program?.isActive
    ? getProgressionSummary(program)
    : [];

  // Level info
  const levelInfo = getLevelForXP(profile.totalXP);
  const progressInfo = getProgressToNextLevel(profile.totalXP);

  // Active goals
  const activeGoals = goals.filter(g => !g.completed).slice(0, 2);

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Handle logging a climbing session
  const handleLogClimbing = (notes = '') => {
    if (onLogClimbingSession) {
      onLogClimbingSession(new Date(), notes);
      showXPGain(30);
    }
  };

  // Handle marking climbing day (deprecated)
  const handleMarkClimbing = () => {
    handleLogClimbing('');
  };

  // Handle starting a session
  const handleStartSession = (session) => {
    setActiveSession(session);
    setShowSessionView(true);
  };

  // Handle session completion
  const handleSessionComplete = (sessionData) => {
    const previousLevel = levelInfo.level;
    const previousXP = profile.totalXP;
    const sessionType = activeSession?.id || todaySessionInfo?.session?.id;

    // Complete the session
    if (onCompleteSession) {
      onCompleteSession(sessionType, sessionData);
    }

    // Calculate XP (this is also done in completeSession, but we need it for animations)
    let xpEarned = XP_REWARDS.COMPLETE_WORKOUT;
    if (sessionData.detailedLog) {
      xpEarned += XP_REWARDS.DETAILED_LOG_BONUS || 10;
    }

    // Show XP gain
    showXPGain(xpEarned);

    // Check for level up
    const newXP = previousXP + xpEarned;
    const newLevel = getLevelForXP(newXP);
    if (newLevel.level > previousLevel) {
      setTimeout(() => showLevelUp(newLevel), 1500);
    }

    // Check for achievements
    setTimeout(() => {
      const newAchievementIds = checkAchievements(
        { ...appState, workouts: [...workouts, sessionData] },
        achievements
      );
      newAchievementIds.forEach((id, index) => {
        if (onCheckAchievements) onCheckAchievements(id);
        setTimeout(() => showAchievementUnlock(id), index * 500);
      });
    }, 2000);

    // Check streak milestones
    const newStreak = streaks.current + 1;
    if ([7, 14, 30, 60, 100].includes(newStreak)) {
      setTimeout(() => showStreakMilestone(newStreak), 3500);
    }

    setActiveSession(null);
    setShowSessionView(false);
  };

  // Handle exercise progress update
  const handleExerciseProgress = (exerciseId, logData) => {
    if (onUpdateExerciseProgress) {
      onUpdateExerciseProgress(exerciseId, logData);
    }
  };

  // If showing session view, render that
  if (showSessionView && activeSession) {
    return (
      <SessionView
        session={activeSession}
        isDeloadWeek={program?.isDeloadWeek || program?.currentWeek === 4}
        onComplete={handleSessionComplete}
        onCancel={() => {
          setShowSessionView(false);
          setActiveSession(null);
        }}
        onUpdateExerciseProgress={handleExerciseProgress}
      />
    );
  }

  // Program onboarding if not started
  if (!program?.isActive) {
    return (
      <PageContainer>
        <div className="mb-6">
          <p style={{ color: '#6B7C93' }}>{today}</p>
          <h1 className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>
            {greeting}{profile.name ? `, ${profile.name}` : ''}!
          </h1>
        </div>

        <Card className="text-center py-8">
          <div className="text-6xl mb-4">🧗‍♀️</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#1E3A5F' }}>
            Ready for Your Training Program?
          </h2>
          <p className="text-sm mb-6 px-4" style={{ color: '#6B7C93' }}>
            A structured 4-week climbing program with pull-up training,
            strength work, and recovery built in.
          </p>

          <div className="space-y-2 text-left px-6 mb-6">
            <div className="flex items-center gap-2">
              <span>💪</span>
              <span className="text-sm">2 strength sessions per week</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span className="text-sm">Quick post-climb workouts</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📈</span>
              <span className="text-sm">Guided progression tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔄</span>
              <span className="text-sm">Built-in deload weeks</span>
            </div>
          </div>

          <Button onClick={onStartProgram} size="lg">
            <Play size={20} className="mr-2" />
            Start Program
          </Button>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header with greeting and week info */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p style={{ color: '#6B7C93' }}>{today}</p>
            <h1 className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>
              {greeting}{profile.name ? `, ${profile.name}` : ''}!
            </h1>
          </div>
          {weekProgress && (
            <div className="text-right">
              <Badge variant={weekProgress.isDeloadWeek ? 'warning' : 'primary'}>
                Week {weekProgress.currentWeek}
              </Badge>
              <p className="text-xs mt-1" style={{ color: '#6B7C93' }}>
                Cycle {weekProgress.cycleNumber}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Deload banner */}
      {weekProgress?.isDeloadWeek && (
        <div className="mb-4">
          <DeloadBanner />
        </div>
      )}

      {/* Level & XP Card */}
      <Card
        className="mb-4 text-white"
        style={{ background: 'linear-gradient(to right, #1E3A5F, #2D4A6F)' }}
      >
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

      {/* Streak Card */}
      <div className="mb-4">
        <StreakCard
          streaks={streaks}
          onUseFreeze={onUseStreakFreeze}
        />
      </div>

      {/* Today's Session(s) */}
      <PageSection title="Today's Training">
        {todaySessionInfo?.allComplete ? (
          // All sessions complete
          <Card className="bg-green-50 border-2 border-green-200">
            <div className="flex items-center gap-4">
              <span className="text-4xl">✅</span>
              <div>
                <p className="font-bold" style={{ color: '#1E3A5F' }}>
                  All done for today!
                </p>
                <p className="text-sm text-green-600">
                  Great work! Rest up for tomorrow.
                </p>
              </div>
            </div>
          </Card>
        ) : todaySessionInfo?.isRestDay ? (
          // Rest day
          <Card className="text-center py-6">
            <span className="text-4xl mb-3 block">😴</span>
            <p className="font-bold mb-1" style={{ color: '#1E3A5F' }}>
              Rest Day
            </p>
            <p className="text-sm" style={{ color: '#6B7C93' }}>
              Recovery is when you get stronger. Take it easy!
            </p>
            {SESSIONS.rest?.tips && (
              <ul className="mt-4 text-left space-y-1 px-4">
                {SESSIONS.rest.tips.map((tip, idx) => (
                  <li key={idx} className="text-xs flex items-start gap-2" style={{ color: '#6B7C93' }}>
                    <span>•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ) : todaySessionInfo?.sessions?.length > 0 ? (
          // Multi-session day - show all sessions
          <div className="space-y-4">
            {todaySessionInfo.sessions.map((sessionInfo) => (
              sessionInfo.isClimbing ? (
                <ClimbingLogCard
                  key="climbing"
                  completed={sessionInfo.completed}
                  onLogClimbing={handleLogClimbing}
                />
              ) : (
                <SessionCard
                  key={sessionInfo.sessionId}
                  session={sessionInfo.session}
                  sessionType={sessionInfo.sessionId}
                  isDeloadWeek={sessionInfo.isDeloadWeek}
                  completed={sessionInfo.completed}
                  progressionCount={progressionSummary.filter(p =>
                    sessionInfo.session?.exercises?.some(e => e.id === p.exerciseId)
                  ).length}
                  onStart={() => handleStartSession(sessionInfo.session)}
                />
              )
            ))}
          </div>
        ) : (
          // Fallback
          <Card className="text-center py-6">
            <p style={{ color: '#6B7C93' }}>No session scheduled for today</p>
          </Card>
        )}
      </PageSection>

      {/* Week Overview */}
      {weekProgress && (
        <PageSection title="This Week">
          <WeekOverview
            weekProgress={weekProgress}
            compact
            onDayClick={(day) => setSelectedDay(selectedDay?.dateStr === day.dateStr ? null : day)}
          />

          {/* Selected Day Details */}
          {selectedDay && (
            <Card className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold" style={{ color: '#1E3A5F' }}>
                  {format(selectedDay.date, 'EEEE, MMM d')}
                </h4>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-xs hover:opacity-80"
                  style={{ color: '#6B7C93' }}
                >
                  Close
                </button>
              </div>

              {/* Show sessions for this day */}
              {selectedDay.sessions?.length > 0 ? (
                <div className="space-y-2">
                  {selectedDay.sessions.map((s, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        s.completed ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">
                        {s.completed ? '✅' :
                         s.sessionId === 'climb' ? '🧗' :
                         s.sessionId === 'strength1' || s.sessionId === 'strength2' ? '💪' :
                         s.sessionId === 'miniA' || s.sessionId === 'miniB' ? '⚡' :
                         s.sessionId === 'mobility' ? '🧘' : '📅'}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: '#1E3A5F' }}>
                          {s.sessionId === 'climb' ? 'Climbing' :
                           s.sessionId === 'strength1' ? 'Strength 1' :
                           s.sessionId === 'strength2' ? 'Strength 2' :
                           s.sessionId === 'miniA' ? 'Mini A' :
                           s.sessionId === 'miniB' ? 'Mini B' :
                           s.sessionId === 'mobility' ? 'Mobility' : s.sessionId}
                        </p>
                        <p className="text-xs" style={{ color: '#6B7C93' }}>
                          {s.completed ? 'Completed' : selectedDay.isPast ? 'Missed' : 'Upcoming'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedDay.isRestDay ? (
                <p className="text-sm" style={{ color: '#6B7C93' }}>Rest day - no workouts scheduled</p>
              ) : (
                <p className="text-sm" style={{ color: '#6B7C93' }}>No sessions</p>
              )}
            </Card>
          )}
        </PageSection>
      )}

      {/* Goals Preview */}
      {activeGoals.length > 0 && (
        <PageSection
          title="Goals"
          action={
            <button
              className="text-sm font-medium flex items-center"
              style={{ color: '#40E0D0' }}
            >
              See all <ChevronRight size={16} />
            </button>
          }
        >
          <div className="space-y-2">
            {activeGoals.map(goal => (
              <Card key={goal.id} padding="sm">
                <div className="flex items-center gap-3">
                  <Target size={20} style={{ color: '#40E0D0' }} />
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: '#1E3A5F' }}>{goal.text}</p>
                    {goal.deadline && (
                      <p className="text-xs" style={{ color: '#6B7C93' }}>
                        Due: {format(new Date(goal.deadline), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </PageSection>
      )}

      {/* Progression alerts */}
      {progressionSummary.length > 0 && (
        <PageSection title="Ready to Progress">
          <Card className="bg-green-50 border border-green-200">
            <p className="text-sm text-green-700 mb-2">
              {progressionSummary.length} exercise{progressionSummary.length > 1 ? 's' : ''} ready to advance!
            </p>
            <div className="space-y-1">
              {progressionSummary.slice(0, 3).map(item => (
                <p key={item.exerciseId} className="text-xs text-green-600">
                  • {item.exerciseId}: {item.message}
                </p>
              ))}
            </div>
          </Card>
        </PageSection>
      )}

      {/* Bottom padding for navigation */}
      <div className="h-20" />
    </PageContainer>
  );
}

export default TodayView;
