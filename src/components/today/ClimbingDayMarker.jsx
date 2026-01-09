import React, { useState } from 'react';
import { Mountain, Check, ChevronRight, Sparkles } from 'lucide-react';
import { Card, Button, Badge } from '../common';
import { SESSIONS } from '../../data/program';

export function ClimbingDayMarker({
  postClimbSession,
  onMarkClimbing,
  alreadyMarked = false
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  const handleMarkClimbing = async () => {
    setIsMarking(true);
    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 300));

    if (onMarkClimbing) {
      onMarkClimbing();
    }
    setShowConfirmation(true);
    setIsMarking(false);
  };

  // Show confirmation after marking
  if (showConfirmation || alreadyMarked) {
    return (
      <Card className="bg-teal-50 border-2 border-teal-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
            <Check size={24} className="text-teal-600" />
          </div>
          <div>
            <p className="font-bold text-teal-800">
              Climbing logged!
            </p>
            <p className="text-sm text-teal-600">
              Great session on the wall
            </p>
          </div>
        </div>

        {postClimbSession && (
          <div className="bg-white rounded-lg p-3 border border-teal-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-amber-500" />
              <span className="text-sm font-medium" style={{ color: '#1E3A5F' }}>
                Post-climb workout unlocked:
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {postClimbSession.id === 'miniA' ? '⚡' :
                 postClimbSession.id === 'miniB' ? '⚡' :
                 postClimbSession.id === 'mobility' ? '🧘' : '💪'}
              </span>
              <div>
                <p className="font-semibold" style={{ color: '#1E3A5F' }}>
                  {postClimbSession.name}
                </p>
                <p className="text-xs" style={{ color: '#6B7C93' }}>
                  {postClimbSession.duration}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  }

  // Initial state - prompt to mark climbing
  return (
    <Card className="border-2 border-dashed border-teal-300 bg-teal-50/50">
      <div className="text-center py-2">
        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-3">
          <Mountain size={32} className="text-teal-600" />
        </div>

        <h3 className="font-bold text-lg mb-1" style={{ color: '#1E3A5F' }}>
          Did you climb today?
        </h3>

        <p className="text-sm mb-4" style={{ color: '#6B7C93' }}>
          Mark your climbing session to unlock today's workout
        </p>

        {postClimbSession && (
          <div className="flex items-center justify-center gap-2 mb-4 text-sm" style={{ color: '#6B7C93' }}>
            <span>Today's workout:</span>
            <Badge variant="primary">{postClimbSession.name}</Badge>
          </div>
        )}

        <Button
          onClick={handleMarkClimbing}
          disabled={isMarking}
          size="lg"
          fullWidth
        >
          {isMarking ? (
            <>
              <span className="animate-spin mr-2">🧗</span>
              Marking...
            </>
          ) : (
            <>
              <Check size={20} className="mr-2" />
              Yes, I Went Climbing!
            </>
          )}
        </Button>

        <p className="text-xs mt-3" style={{ color: '#6B7C93' }}>
          This unlocks your post-climb strength work
        </p>
      </div>
    </Card>
  );
}

// Compact button version for inline use
export function ClimbingDayButton({ onMarkClimbing, disabled = false }) {
  return (
    <Button
      variant="outline"
      onClick={onMarkClimbing}
      disabled={disabled}
      className="border-teal-300 text-teal-700 hover:bg-teal-50"
    >
      <Mountain size={18} className="mr-2" />
      I Went Climbing
    </Button>
  );
}

export default ClimbingDayMarker;
