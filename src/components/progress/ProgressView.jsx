import React, { useState } from 'react';
import { format } from 'date-fns';
import { Target, Trophy, TrendingUp, Award, ChevronRight, Plus, ChevronDown } from 'lucide-react';
import { PageContainer, PageSection } from '../layout';
import { Card, Button, Badge, ProgressBar, Modal } from '../common';
import { FrequencyHeatmap, StrengthChart, PullupLadder, GradeProgression, WorkoutTypeChart } from './charts';
import { achievements, getAchievementById } from '../../data/achievements';

export function ProgressView({ appState, onAddGoal, onCompleteGoal, onAddPersonalRecord }) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ text: '', type: 'custom', deadline: '' });
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'goals' | 'charts' | 'achievements'

  const { goals, personalRecords, achievements: unlockedAchievements, workouts } = appState;

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  const handleAddGoal = () => {
    if (newGoal.text && newGoal.deadline) {
      onAddGoal({
        ...newGoal,
        target: newGoal.text
      });
      setNewGoal({ text: '', type: 'custom', deadline: '' });
      setShowAddGoal(false);
    }
  };

  const handleAddGrade = (type, value) => {
    if (onAddPersonalRecord) {
      onAddPersonalRecord(type, value);
    }
  };

  // Get unlocked achievements with details
  const unlockedWithDetails = unlockedAchievements.map(ua => ({
    ...getAchievementById(ua.id),
    unlockedDate: ua.unlockedDate
  })).filter(Boolean);

  const tabs = [
    { key: 'overview', label: 'Overview', emoji: '📊' },
    { key: 'charts', label: 'Charts', emoji: '📈' },
    { key: 'goals', label: 'Goals', emoji: '🎯' },
    { key: 'achievements', label: 'Badges', emoji: '🏆' }
  ];

  return (
    <PageContainer
      title="Progress"
      subtitle="Track your climbing journey"
      action={
        <Button size="sm" onClick={() => setShowAddGoal(true)}>
          <Plus size={16} />
        </Button>
      }
    >
      {/* Tab Navigation */}
      <div className="flex gap-1 bg-white rounded-xl p-1 mb-4 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`
              flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
              whitespace-nowrap flex items-center justify-center gap-1
              ${activeSection === tab.key
                ? 'text-white'
                : 'hover:bg-gray-100'
              }
            `}
            style={activeSection === tab.key
              ? { backgroundColor: '#40E0D0' }
              : { color: '#6B7C93' }
            }
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-4">
          {/* Activity Heatmap */}
          <FrequencyHeatmap workouts={workouts} weeks={12} />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="text-center">
              <p className="text-3xl mb-1">💪</p>
              <p className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>
                {personalRecords.pullUps?.length > 0
                  ? Math.max(...personalRecords.pullUps.map(r => r.value))
                  : '-'
                }
              </p>
              <p className="text-sm" style={{ color: '#6B7C93' }}>Pull-ups PR</p>
            </Card>

            <Card className="text-center">
              <p className="text-3xl mb-1">🪨</p>
              <p className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>
                {personalRecords.boulderGrade?.length > 0
                  ? personalRecords.boulderGrade[personalRecords.boulderGrade.length - 1].value
                  : '-'
                }
              </p>
              <p className="text-sm" style={{ color: '#6B7C93' }}>Highest Send</p>
            </Card>
          </div>

          {/* Active Goals Preview */}
          {activeGoals.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold" style={{ color: '#1E3A5F' }}>Active Goals</h3>
                <button
                  onClick={() => setActiveSection('goals')}
                  className="text-sm flex items-center"
                  style={{ color: '#40E0D0' }}
                >
                  See all <ChevronRight size={16} />
                </button>
              </div>
              <div className="space-y-2">
                {activeGoals.slice(0, 2).map(goal => (
                  <div key={goal.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <Target style={{ color: '#40E0D0' }} size={18} />
                    <span className="text-sm font-medium flex-1" style={{ color: '#1E3A5F' }}>
                      {goal.text}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Achievements Preview */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold" style={{ color: '#1E3A5F' }}>Recent Badges</h3>
              <button
                onClick={() => setActiveSection('achievements')}
                className="text-sm flex items-center"
                style={{ color: '#40E0D0' }}
              >
                See all <ChevronRight size={16} />
              </button>
            </div>
            {unlockedWithDetails.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {unlockedWithDetails.slice(0, 6).map(achievement => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-1 px-2 py-1 rounded-full"
                    style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}
                  >
                    <span>{achievement.emoji}</span>
                    <span className="text-xs font-medium text-amber-700">
                      {achievement.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center py-2" style={{ color: '#6B7C93' }}>
                Complete workouts to earn badges!
              </p>
            )}
          </Card>
        </div>
      )}

      {/* Charts Section */}
      {activeSection === 'charts' && (
        <div className="space-y-4">
          <StrengthChart personalRecords={personalRecords} />
          <PullupLadder personalRecords={personalRecords} />
          <GradeProgression
            personalRecords={personalRecords}
            onAddGrade={handleAddGrade}
          />
          <WorkoutTypeChart workouts={workouts} />
        </div>
      )}

      {/* Goals Section */}
      {activeSection === 'goals' && (
        <div className="space-y-4">
          <PageSection
            title="Active Goals"
            action={
              <Button size="sm" variant="outline" onClick={() => setShowAddGoal(true)}>
                <Plus size={16} className="mr-1" /> Add
              </Button>
            }
          >
            {activeGoals.length > 0 ? (
              <div className="space-y-3">
                {activeGoals.map(goal => (
                  <Card key={goal.id}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target style={{ color: '#40E0D0' }} size={20} />
                        <span className="font-semibold" style={{ color: '#1E3A5F' }}>
                          {goal.text}
                        </span>
                      </div>
                      <Badge variant="primary" size="sm">
                        {goal.type}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#6B7C93' }}>
                      Due: {format(new Date(goal.deadline), 'MMM d, yyyy')}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCompleteGoal(goal.id)}
                      fullWidth
                    >
                      Mark as Complete
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-6">
                <p className="text-3xl mb-2">🎯</p>
                <p style={{ color: '#6B7C93' }}>No active goals</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddGoal(true)}
                  className="mt-3"
                >
                  Add a Goal
                </Button>
              </Card>
            )}
          </PageSection>

          {completedGoals.length > 0 && (
            <PageSection title="Completed Goals">
              <div className="space-y-2">
                {completedGoals.map(goal => (
                  <Card key={goal.id} padding="sm" className="bg-green-50">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">✅</span>
                      <div className="flex-1">
                        <p className="font-medium line-through opacity-70" style={{ color: '#1E3A5F' }}>
                          {goal.text}
                        </p>
                        <p className="text-xs" style={{ color: '#6B7C93' }}>
                          Completed {format(new Date(goal.completedDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </PageSection>
          )}
        </div>
      )}

      {/* Achievements Section */}
      {activeSection === 'achievements' && (
        <div className="space-y-4">
          <Card className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy style={{ color: '#FFD700' }} size={24} />
              <span className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>
                {unlockedAchievements.length}
              </span>
              <span style={{ color: '#6B7C93' }}>
                / {achievements.filter(a => !a.hidden).length}
              </span>
            </div>
            <p className="text-sm" style={{ color: '#6B7C93' }}>Badges Unlocked</p>
          </Card>

          {/* Achievement categories */}
          {['general', 'technique', 'strength', 'pullups', 'grades'].map(category => {
            const categoryAchievements = achievements.filter(
              a => a.category === category && !a.hidden
            );
            const categoryLabel = {
              general: 'General',
              technique: 'Technique',
              strength: 'Strength',
              pullups: 'Pull-ups',
              grades: 'Climbing Grades'
            }[category];

            return (
              <Card key={category}>
                <h3 className="font-semibold mb-3" style={{ color: '#1E3A5F' }}>{categoryLabel}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categoryAchievements.map(achievement => {
                    const isUnlocked = unlockedAchievements.some(ua => ua.id === achievement.id);
                    return (
                      <div
                        key={achievement.id}
                        className={`
                          p-3 rounded-xl text-center transition-all
                          ${!isUnlocked ? 'bg-gray-100 opacity-50' : ''}
                        `}
                        style={isUnlocked ? { backgroundColor: 'rgba(255, 215, 0, 0.1)' } : {}}
                      >
                        <p className="text-2xl mb-1">
                          {isUnlocked ? achievement.emoji : '🔒'}
                        </p>
                        <p className={`text-xs font-medium ${isUnlocked ? 'text-amber-700' : 'text-gray-500'}`}>
                          {achievement.name}
                        </p>
                        <p className="text-[10px] mt-0.5" style={{ color: '#6B7C93' }}>
                          {achievement.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      <Modal
        isOpen={showAddGoal}
        onClose={() => setShowAddGoal(false)}
        title="Add New Goal"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1E3A5F' }}>
              What's your goal?
            </label>
            <input
              type="text"
              value={newGoal.text}
              onChange={(e) => setNewGoal(prev => ({ ...prev, text: e.target.value }))}
              placeholder="e.g., Do 10 pull-ups"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2
                         focus:ring-teal-400 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1E3A5F' }}>
              Goal Type
            </label>
            <select
              value={newGoal.type}
              onChange={(e) => setNewGoal(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2
                         focus:ring-teal-400 focus:border-transparent outline-none"
            >
              <option value="custom">Custom</option>
              <option value="grade">Climbing Grade</option>
              <option value="strength">Strength</option>
              <option value="consistency">Consistency</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1E3A5F' }}>
              Target Date
            </label>
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2
                         focus:ring-teal-400 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowAddGoal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddGoal} className="flex-1">
              Add Goal
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}

export default ProgressView;
