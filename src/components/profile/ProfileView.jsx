import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  User, Settings, Download, Upload, Trash2, Edit2, Check,
  Calendar, Trophy, Flame, Dumbbell
} from 'lucide-react';
import { PageContainer, PageSection } from '../layout';
import { Card, Button, Badge, Modal, ProgressBar } from '../common';
import { ProgramSettings } from '../program';
import { getLevelForXP, getProgressToNextLevel, levels } from '../../data/levels';

export function ProfileView({
  appState,
  updateProfile,
  exportData,
  importData,
  resetData,
  // Program actions
  onResetProgram,
  onUpdateWeekTemplate,
  onAdvanceWeek
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(appState.profile.name);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [importText, setImportText] = useState('');

  const { profile, workouts, achievements, streaks, stats } = appState;

  const levelInfo = getLevelForXP(profile.totalXP);
  const progressInfo = getProgressToNextLevel(profile.totalXP);

  const handleSaveName = () => {
    updateProfile({ name: editName });
    setIsEditing(false);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `climbquest-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      importData(importText);
      setShowImportModal(false);
      setImportText('');
    } catch (error) {
      alert('Failed to import data. Please check the file format.');
    }
  };

  const handleReset = () => {
    resetData();
    setShowResetModal(false);
  };

  // Calculate stats
  const totalWorkouts = workouts.length;
  const totalXP = profile.totalXP;
  const daysSinceStart = Math.floor(
    (new Date() - new Date(profile.startDate)) / (1000 * 60 * 60 * 24)
  );

  return (
    <PageContainer
      title="Profile"
      subtitle="Your climbing journey"
    >
      {/* Profile Card */}
      <Card className="mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(64, 224, 208, 0.2)' }}
          >
            <span className="text-3xl">{levelInfo.emoji}</span>
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2
                             focus:ring-teal-400 focus:border-transparent outline-none"
                  placeholder="Your name"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-2 text-white rounded-lg"
                  style={{ backgroundColor: '#40E0D0' }}
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold" style={{ color: '#1E3A5F' }}>
                  {profile.name || 'Climber'}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:opacity-70"
                  style={{ color: '#6B7C93' }}
                >
                  <Edit2 size={14} />
                </button>
              </div>
            )}
            <p style={{ color: '#6B7C93' }}>
              Level {levelInfo.level} - {levelInfo.name}
            </p>
          </div>
        </div>

        <ProgressBar
          value={progressInfo.progress}
          max={100}
          showLabel
          label={`${profile.totalXP} XP`}
        />
        <p className="text-xs mt-1" style={{ color: '#6B7C93' }}>
          {progressInfo.xpToNext > 0
            ? `${progressInfo.xpToNext} XP to ${levels[levelInfo.level]?.name || 'next level'}`
            : 'Max level reached!'
          }
        </p>
      </Card>

      {/* Stats Grid */}
      <PageSection title="Stats">
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <Dumbbell className="mx-auto mb-2" style={{ color: '#40E0D0' }} size={24} />
            <p className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>{totalWorkouts}</p>
            <p className="text-sm" style={{ color: '#6B7C93' }}>Workouts</p>
          </Card>

          <Card className="text-center">
            <Flame className="mx-auto text-orange-500 mb-2" size={24} />
            <p className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>{streaks.best}</p>
            <p className="text-sm" style={{ color: '#6B7C93' }}>Best Streak</p>
          </Card>

          <Card className="text-center">
            <Trophy className="mx-auto mb-2" style={{ color: '#FFD700' }} size={24} />
            <p className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>{achievements.length}</p>
            <p className="text-sm" style={{ color: '#6B7C93' }}>Badges</p>
          </Card>

          <Card className="text-center">
            <Calendar className="mx-auto mb-2" style={{ color: '#1E3A5F' }} size={24} />
            <p className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>{daysSinceStart}</p>
            <p className="text-sm" style={{ color: '#6B7C93' }}>Days Active</p>
          </Card>
        </div>
      </PageSection>

      {/* Level Progress */}
      <PageSection title="Level Progress">
        <Card>
          <div className="space-y-3">
            {levels.map((level, index) => {
              const isUnlocked = profile.totalXP >= level.minXP;
              const isCurrent = level.level === levelInfo.level;

              return (
                <div
                  key={level.level}
                  className={`
                    flex items-center gap-3 p-2 rounded-lg
                    ${!isUnlocked ? 'opacity-50' : ''}
                  `}
                  style={isCurrent ? { backgroundColor: 'rgba(64, 224, 208, 0.1)' } : {}}
                >
                  <span className="text-2xl">{level.emoji}</span>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: isCurrent ? '#40E0D0' : '#1E3A5F' }}>
                      {level.name}
                    </p>
                    <p className="text-xs" style={{ color: '#6B7C93' }}>{level.minXP} XP</p>
                  </div>
                  {isUnlocked && <Check size={16} className="text-green-500" />}
                </div>
              );
            })}
          </div>
        </Card>
      </PageSection>

      {/* Training Program */}
      {appState.program?.isActive && (
        <PageSection title="Training Program">
          <ProgramSettings
            programState={appState.program}
            onResetProgram={onResetProgram}
            onUpdateWeekTemplate={onUpdateWeekTemplate}
            onAdvanceWeek={onAdvanceWeek}
          />
        </PageSection>
      )}

      {/* Data Management */}
      <PageSection title="Data">
        <div className="space-y-2">
          <Button variant="outline" fullWidth onClick={handleExport}>
            <Download size={18} className="mr-2" />
            Export Data
          </Button>

          <Button variant="outline" fullWidth onClick={() => setShowImportModal(true)}>
            <Upload size={18} className="mr-2" />
            Import Data
          </Button>

          <Button variant="danger" fullWidth onClick={() => setShowResetModal(true)}>
            <Trash2 size={18} className="mr-2" />
            Reset All Data
          </Button>
        </div>
      </PageSection>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Data"
      >
        <div className="space-y-4">
          <p className="text-sm" style={{ color: '#6B7C93' }}>
            Paste your backup JSON data below. This will overwrite all existing data.
          </p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="w-full h-40 p-3 border border-gray-200 rounded-xl resize-none
                       focus:ring-2 focus:ring-teal-400 focus:border-transparent
                       outline-none font-mono text-sm"
            placeholder='{"profile": {...}, "workouts": [...]}'
          />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowImportModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleImport} className="flex-1">
              Import
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset All Data?"
      >
        <div className="space-y-4">
          <p style={{ color: '#6B7C93' }}>
            This will delete all your workouts, achievements, and progress. This action cannot be undone!
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowResetModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReset} className="flex-1">
              Reset Everything
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}

export default ProfileView;
