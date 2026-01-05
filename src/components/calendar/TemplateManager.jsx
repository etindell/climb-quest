import React, { useState } from 'react';
import { Trash2, Edit2, Copy, Play, Calendar, MoreVertical, X } from 'lucide-react';
import { Card, Button, Badge, Modal } from '../common';
import { getExerciseById } from '../../data/exercises';

const WORKOUT_TYPE_COLORS = {
  technique: 'bg-[--color-primary]',
  strength: 'bg-orange-400',
  endurance: 'bg-green-500',
  mixed: 'bg-purple-500'
};

const WORKOUT_TYPE_LABELS = {
  technique: { label: 'Technique', emoji: '🎯' },
  strength: { label: 'Strength', emoji: '💪' },
  endurance: { label: 'Endurance', emoji: '⏱️' },
  mixed: { label: 'Mixed', emoji: '🎲' }
};

function TemplateCard({ template, onEdit, onDelete, onDuplicate, onSchedule, onStart }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const typeInfo = WORKOUT_TYPE_LABELS[template.type] || WORKOUT_TYPE_LABELS.mixed;

  // Get exercise details
  const exercises = template.exercises?.map(ex => {
    const exerciseData = getExerciseById(typeof ex === 'string' ? ex : ex.id);
    return exerciseData || { name: 'Unknown', emoji: '❓' };
  }) || [];

  return (
    <>
      <Card className="relative" hoverable onClick={() => setShowDetails(true)}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${WORKOUT_TYPE_COLORS[template.type]}`} />
              <h3 className="font-bold text-[--color-secondary]">{template.name}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-[--color-text-muted]">
              <span>{typeInfo.emoji} {typeInfo.label}</span>
              <span>•</span>
              <span>~{template.estimatedMinutes} min</span>
              <span>•</span>
              <span>{exercises.length} exercises</span>
            </div>
          </div>

          {/* Menu button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical size={18} className="text-[--color-text-muted]" />
          </button>
        </div>

        {/* Exercise preview */}
        <div className="flex flex-wrap gap-1 mt-3">
          {exercises.slice(0, 4).map((ex, i) => (
            <span key={i} className="text-lg" title={ex.name}>
              {ex.emoji}
            </span>
          ))}
          {exercises.length > 4 && (
            <span className="text-sm text-[--color-text-muted]">
              +{exercises.length - 4}
            </span>
          )}
        </div>

        {/* Dropdown menu */}
        {showMenu && (
          <div
            className="absolute right-2 top-12 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 min-w-[160px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { onStart(template); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Play size={16} /> Start Workout
            </button>
            <button
              onClick={() => { onSchedule(template); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Calendar size={16} /> Schedule
            </button>
            <button
              onClick={() => { onDuplicate(template); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Copy size={16} /> Duplicate
            </button>
            <button
              onClick={() => { onEdit(template); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit2 size={16} /> Edit
            </button>
            <hr className="my-1" />
            <button
              onClick={() => { onDelete(template.id); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </Card>

      {/* Template Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={template.name}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="primary">{typeInfo.emoji} {typeInfo.label}</Badge>
            <Badge variant="secondary">~{template.estimatedMinutes} min</Badge>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-[--color-secondary] mb-3">
              Exercises ({exercises.length})
            </h4>
            <div className="space-y-2">
              {exercises.map((ex, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                  <span className="text-xl">{ex.emoji}</span>
                  <div className="flex-1">
                    <p className="font-medium text-[--color-secondary]">{ex.name}</p>
                    <p className="text-xs text-[--color-text-muted]">
                      {template.exercises[i]?.sets || ex.defaultSets} sets
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => { onSchedule(template); setShowDetails(false); }}
              className="flex-1"
            >
              <Calendar size={18} className="mr-2" />
              Schedule
            </Button>
            <Button
              onClick={() => { onStart(template); setShowDetails(false); }}
              className="flex-1"
            >
              <Play size={18} className="mr-2" />
              Start Now
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function TemplateManager({ templates, onEdit, onDelete, onDuplicate, onSchedule, onStart }) {
  if (!templates || templates.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-4xl mb-3">📋</p>
        <p className="font-semibold text-[--color-secondary]">No templates yet</p>
        <p className="text-sm text-[--color-text-muted] mt-1">
          Save a workout to create your first template!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {templates.map(template => (
        <TemplateCard
          key={template.id}
          template={template}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onSchedule={onSchedule}
          onStart={onStart}
        />
      ))}
    </div>
  );
}

export default TemplateManager;
