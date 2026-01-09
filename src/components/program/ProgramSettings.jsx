import React, { useState } from 'react';
import { RefreshCw, Trash2, Calendar, TrendingUp, AlertTriangle, Settings } from 'lucide-react';
import { Card, Button, Badge } from '../common';
import { DELOAD_CONFIG, DEFAULT_WEEK_TEMPLATE } from '../../data/program';
import { ScheduleCustomizer } from './ScheduleCustomizer';

export function ProgramSettings({
  programState,
  onResetProgram,
  onResetProgressions,
  onAdvanceWeek,
  onUpdateWeekTemplate
}) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmProgressReset, setShowConfirmProgressReset] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const {
    currentWeek,
    cycleNumber,
    startDate,
    sessionHistory,
    exerciseProgress
  } = programState || {};

  const totalSessions = sessionHistory?.length || 0;
  const progressionCount = Object.keys(exerciseProgress || {}).length;
  const startDateFormatted = startDate
    ? new Date(startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Not started';

  return (
    <div className="space-y-4">
      {/* Program Status */}
      <Card>
        <h3 className="font-bold mb-4" style={{ color: '#1E3A5F' }}>
          Program Status
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold" style={{ color: '#40E0D0' }}>
              {currentWeek || 1}
            </p>
            <p className="text-xs" style={{ color: '#6B7C93' }}>Current Week</p>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold" style={{ color: '#40E0D0' }}>
              {cycleNumber || 1}
            </p>
            <p className="text-xs" style={{ color: '#6B7C93' }}>Cycle</p>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold" style={{ color: '#40E0D0' }}>
              {totalSessions}
            </p>
            <p className="text-xs" style={{ color: '#6B7C93' }}>Sessions Done</p>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold" style={{ color: '#40E0D0' }}>
              {progressionCount}
            </p>
            <p className="text-xs" style={{ color: '#6B7C93' }}>Exercises Tracked</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar size={16} style={{ color: '#6B7C93' }} />
            <span className="text-sm" style={{ color: '#6B7C93' }}>
              Started: {startDateFormatted}
            </span>
          </div>
        </div>
      </Card>

      {/* Cycle Info */}
      <Card>
        <h3 className="font-bold mb-3" style={{ color: '#1E3A5F' }}>
          About the {DELOAD_CONFIG.frequency}-Week Cycle
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
              1-3
            </div>
            <div>
              <p className="font-medium" style={{ color: '#1E3A5F' }}>Training Weeks</p>
              <p className="text-xs" style={{ color: '#6B7C93' }}>Full volume, building strength</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-600">
              4
            </div>
            <div>
              <p className="font-medium" style={{ color: '#1E3A5F' }}>Deload Week</p>
              <p className="text-xs" style={{ color: '#6B7C93' }}>
                {Math.round(DELOAD_CONFIG.setMultiplier * 100)}% volume - recovery & adaptation
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Schedule Customizer */}
      <Card>
        <h3 className="font-bold mb-3" style={{ color: '#1E3A5F' }}>
          Weekly Schedule
        </h3>
        <p className="text-sm mb-4" style={{ color: '#6B7C93' }}>
          Customize which workouts happen on which days. Mix and match climbing, strength, and mobility sessions.
        </p>
        <Button
          variant="outline"
          fullWidth
          onClick={() => setShowCustomizer(true)}
        >
          <Settings size={16} className="mr-2" />
          Customize Weekly Schedule
        </Button>
      </Card>

      {/* Actions */}
      <Card>
        <h3 className="font-bold mb-4" style={{ color: '#1E3A5F' }}>
          Actions
        </h3>

        <div className="space-y-3">
          {/* Reset progressions */}
          {!showConfirmProgressReset ? (
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowConfirmProgressReset(true)}
            >
              <RefreshCw size={16} className="mr-2" />
              Reset Exercise Progressions
            </Button>
          ) : (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800 mb-3">
                This will reset all progression tracking. Your session history will be kept.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowConfirmProgressReset(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600"
                  onClick={() => {
                    onResetProgressions && onResetProgressions();
                    setShowConfirmProgressReset(false);
                  }}
                >
                  Reset Progressions
                </Button>
              </div>
            </div>
          )}

          {/* Advance week (dev/testing) */}
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="outline"
              fullWidth
              onClick={onAdvanceWeek}
            >
              <TrendingUp size={16} className="mr-2" />
              Advance Week (Dev)
            </Button>
          )}

          {/* Reset program */}
          {!showConfirmReset ? (
            <Button
              variant="outline"
              fullWidth
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setShowConfirmReset(true)}
            >
              <Trash2 size={16} className="mr-2" />
              Reset Entire Program
            </Button>
          ) : (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-2 mb-3">
                <AlertTriangle size={18} className="text-red-500 mt-0.5" />
                <p className="text-sm text-red-800">
                  This will delete all program data including session history and progressions. This cannot be undone.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowConfirmReset(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => {
                    onResetProgram && onResetProgram();
                    setShowConfirmReset(false);
                  }}
                >
                  Yes, Reset Everything
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Schedule Customizer Modal */}
      {showCustomizer && (
        <ScheduleCustomizer
          currentTemplate={programState?.weekTemplate || DEFAULT_WEEK_TEMPLATE}
          onSave={(template) => {
            onUpdateWeekTemplate && onUpdateWeekTemplate(template);
            setShowCustomizer(false);
          }}
          onCancel={() => setShowCustomizer(false)}
        />
      )}
    </div>
  );
}

export default ProgramSettings;
