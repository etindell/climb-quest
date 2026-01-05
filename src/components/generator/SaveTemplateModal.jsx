import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Modal, Button, Badge } from '../common';

const WORKOUT_TYPES = [
  { value: 'technique', label: 'Technique', emoji: '🎯' },
  { value: 'strength', label: 'Strength', emoji: '💪' },
  { value: 'endurance', label: 'Endurance', emoji: '⏱️' },
  { value: 'mixed', label: 'Mixed', emoji: '🎲' }
];

export function SaveTemplateModal({ isOpen, onClose, workout, onSave }) {
  const [name, setName] = useState('');
  const [type, setType] = useState(workout?.options?.focus || 'mixed');

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      type,
      exercises: workout.exercises.map(e => ({
        id: e.id,
        sets: e.defaultSets,
        reps: e.defaultReps,
        duration: e.defaultDuration
      })),
      estimatedMinutes: workout.estimatedMinutes,
      createdAt: new Date().toISOString()
    });

    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save as Template" size="md">
      <div className="space-y-4">
        {/* Template Name */}
        <div>
          <label className="block text-sm font-medium text-[--color-secondary] mb-1">
            Template Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Monday Power Session"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2
                       focus:ring-[--color-primary] focus:border-transparent outline-none"
            autoFocus
          />
        </div>

        {/* Workout Type */}
        <div>
          <label className="block text-sm font-medium text-[--color-secondary] mb-2">
            Workout Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {WORKOUT_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`
                  p-3 rounded-xl border-2 transition-all text-left
                  flex items-center gap-2
                  ${type === t.value
                    ? 'border-[--color-primary] bg-[--color-primary]/10'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <span className="text-xl">{t.emoji}</span>
                <span className="font-medium text-[--color-secondary]">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-[--color-secondary] mb-2">
            Exercises ({workout?.exercises?.length || 0})
          </h4>
          <div className="flex flex-wrap gap-1">
            {workout?.exercises?.slice(0, 6).map((ex, i) => (
              <Badge key={i} variant="default" size="sm">
                {ex.emoji} {ex.name}
              </Badge>
            ))}
            {workout?.exercises?.length > 6 && (
              <Badge variant="default" size="sm">
                +{workout.exercises.length - 6} more
              </Badge>
            )}
          </div>
          <p className="text-sm text-[--color-text-muted] mt-2">
            ~{workout?.estimatedMinutes || 30} minutes
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1"
          >
            <Save size={18} className="mr-2" />
            Save Template
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default SaveTemplateModal;
