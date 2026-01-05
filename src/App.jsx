import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navigation } from './components/layout';
import { TodayView } from './components/today';
import { CalendarView } from './components/calendar';
import { ProgressView } from './components/progress';
import { ExerciseLibrary } from './components/library';
import { ProfileView } from './components/profile';
import { GamificationProvider } from './components/gamification';
import { WelcomeFlow } from './components/onboarding';
import { useAppState } from './hooks/useAppState';

function AppContent() {
  const {
    state,
    updateProfile,
    addWorkout,
    saveTemplate,
    deleteTemplate,
    scheduleWorkout,
    unscheduleWorkout,
    addGoal,
    completeGoal,
    addPersonalRecord,
    checkAndUnlockAchievement,
    useStreakFreeze,
    incrementStat,
    exportData,
    importData,
    resetData
  } = useAppState();

  const navigate = useNavigate();
  const [activeWorkout, setActiveWorkout] = useState(null);

  // Check if user has completed onboarding
  const needsOnboarding = !state.profile.name && !state.profile.onboardingComplete;

  // Handle onboarding completion
  const handleOnboardingComplete = ({ name }) => {
    updateProfile({
      name,
      onboardingComplete: true
    });
  };

  // Handle starting a workout from a template
  const handleStartWorkout = (template) => {
    // Convert template to workout format
    const workout = {
      templateId: template.id,
      type: template.type,
      exercises: template.exercises,
      estimatedMinutes: template.estimatedMinutes,
      options: { focus: template.type }
    };
    setActiveWorkout(workout);
    navigate('/');
  };

  // Show onboarding for new users
  if (needsOnboarding) {
    return <WelcomeFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[--color-background]">
      <Routes>
        <Route
          path="/"
          element={
            <TodayView
              appState={state}
              onAddWorkout={addWorkout}
              onSaveTemplate={saveTemplate}
              onSavePRs={addPersonalRecord}
              onCheckAchievements={checkAndUnlockAchievement}
              onUseStreakFreeze={useStreakFreeze}
              onIncrementStat={incrementStat}
              activeWorkout={activeWorkout}
              setActiveWorkout={setActiveWorkout}
            />
          }
        />
        <Route
          path="/plan"
          element={
            <CalendarView
              appState={state}
              onScheduleWorkout={scheduleWorkout}
              onDeleteTemplate={deleteTemplate}
              onSaveTemplate={saveTemplate}
              onStartWorkout={handleStartWorkout}
              onUnscheduleWorkout={unscheduleWorkout}
            />
          }
        />
        <Route
          path="/progress"
          element={
            <ProgressView
              appState={state}
              onAddGoal={addGoal}
              onCompleteGoal={completeGoal}
              onAddPersonalRecord={addPersonalRecord}
            />
          }
        />
        <Route
          path="/library"
          element={<ExerciseLibrary />}
        />
        <Route
          path="/profile"
          element={
            <ProfileView
              appState={state}
              updateProfile={updateProfile}
              exportData={exportData}
              importData={importData}
              resetData={resetData}
            />
          }
        />
      </Routes>
      <Navigation />

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
}

// PWA Install Prompt Component
function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  React.useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show prompt after a delay if user hasn't dismissed
      const dismissed = localStorage.getItem('installPromptDismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 30000); // 30 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="install-prompt">
      <div className="flex items-center gap-3">
        <span className="text-3xl">📱</span>
        <div className="flex-1">
          <p className="font-bold text-[--color-secondary]">Install Climb Quest</p>
          <p className="text-sm text-[--color-text-muted]">Add to home screen for the best experience!</p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleDismiss}
          className="flex-1 py-2 px-4 text-[--color-text-muted] text-sm"
        >
          Not now
        </button>
        <button
          onClick={handleInstall}
          className="flex-1 py-2 px-4 bg-[--color-primary] text-white rounded-lg font-semibold text-sm"
        >
          Install
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <GamificationProvider>
        <AppContent />
      </GamificationProvider>
    </Router>
  );
}

export default App;
