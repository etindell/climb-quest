import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Save, X } from 'lucide-react';
import { Modal, Button, Badge, Card } from '../common';
import { exercises as allExercises, categories, getExerciseById } from '../../data/exercises';

const WORKOUT_TYPES = [
  { value: 'technique', label: 'Technique', emoji: '🎯' },
  { value: 'strength', label: 'Strength', emoji: '💪' },
  { value: 'endurance', label: 'Endurance', emoji: '⏱️' },
  { value: 'mixed', label: 'Mixed', emoji: '🎲' }
];

function ExercisePicker({ isOpen, onClose, onSelect, excludeIds }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = allExercises.filter(ex => {
    if (excludeIds?.includes(ex.id)) return false;
    if (selectedCategory && ex.category !== selectedCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!ex.name.toLowerCase().includes(query)) return false;
    }
    return true;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Exercise" size="lg">
      <div className="space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2
                     focus:ring-teal-400 focus:border-transparent outline-none"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${!selectedCategory ? 'text-white' : 'bg-gray-100 text-gray-700'}`}
            style={!selectedCategory ? { backgroundColor: '#40E0D0' } : undefined}
          >
            All
          </button>
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === key ? 'text-white' : 'bg-gray-100 text-gray-700'}`}
              style={selectedCategory === key ? { backgroundColor: '#40E0D0' } : undefined}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Exercise List */}
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {filteredExercises.map(ex => (
            <button
              key={ex.id}
              onClick={() => { onSelect(ex); onClose(); }}
              className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-xl transition-colors text-left"
            >
              <span className="text-2xl">{ex.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold" style={{ color: '#1E3A5F' }}>{ex.name}</p>
                <p className="text-xs" style={{ color: '#6B7C93' }}>
                  {categories[ex.category]?.name} • {ex.defaultSets} sets
                </p>
              </div>
              <Plus size={18} style={{ color: '#40E0D0' }} />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export function TemplateEditor({ isOpen, onClose, template, onSave }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('mixed');
  const [exerciseList, setExerciseList] = useState([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  // Initialize form when template changes
  useEffect(() => {
    if (template) {
      setName(template.name || '');
      setType(template.type || 'mixed');
      // Convert exercise references to full objects
      const exercises = template.exercises?.map(ex => {
        const exerciseData = getExerciseById(typeof ex === 'string' ? ex : ex.id);
        return {
          ...exerciseData,
          sets: ex.sets || exerciseData?.defaultSets || 3,
          reps: ex.reps || exerciseData?.defaultReps,
          duration: ex.duration || exerciseData?.defaultDuration
        };
      }).filter(Boolean) || [];
      setExerciseList(exercises);
    } else {
      setName('');
      setType('mixed');
      setExerciseList([]);
    }
  }, [template, isOpen]);

  const handleAddExercise = (exercise) => {
    setExerciseList(prev => [...prev, {
      ...exercise,
      sets: exercise.defaultSets,
      reps: exercise.defaultReps,
      duration: exercise.defaultDuration
    }]);
  };

  const handleRemoveExercise = (index) => {
    setExerciseList(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateExercise = (index, field, value) => {
    setExerciseList(prev => prev.map((ex, i) =>
      i === index ? { ...ex, [field]: parseInt(value) || 0 } : ex
    ));
  };

  const handleMoveExercise = (fromIndex, direction) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= exerciseList.length) return;

    const newList = [...exerciseList];
    [newList[fromIndex], newList[toIndex]] = [newList[toIndex], newList[fromIndex]];
    setExerciseList(newList);
  };

  const handleSave = () => {
    if (!name.trim() || exerciseList.length === 0) return;

    // Calculate estimated time
    let estimatedMinutes = 0;
    exerciseList.forEach(ex => {
      if (ex.duration) {
        estimatedMinutes += Math.ceil((ex.duration * ex.sets) / 60);
      } else {
        const timePerSet = Math.max((ex.reps || 1) * 30, 30);
        estimatedMinutes += Math.ceil((timePerSet * ex.sets + 60 * (ex.sets - 1)) / 60);
      }
    });

    onSave({
      id: template?.id,
      name: name.trim(),
      type,
      exercises: exerciseList.map(ex => ({
        id: ex.id,
        sets: ex.sets,
        reps: ex.reps,
        duration: ex.duration
      })),
      estimatedMinutes,
      updatedAt: new Date().toISOString()
    });

    onClose();
  };

  const isValid = name.trim() && exerciseList.length > 0;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={template?.id ? 'Edit Template' : 'Create Template'}
        size="lg"
      >
        <div className="space-y-4">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1E3A5F' }}>
              Template Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Power Session"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2
                         focus:ring-teal-400 focus:border-transparent outline-none"
            />
          </div>

          {/* Workout Type */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
              Workout Type
            </label>
            <div className="flex flex-wrap gap-2">
              {WORKOUT_TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`px-3 py-2 rounded-xl border-2 transition-all flex items-center gap-1
                    ${type === t.value
                      ? 'border-teal-400'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  style={type === t.value ? { backgroundColor: 'rgba(64, 224, 208, 0.1)' } : undefined}
                >
                  <span>{t.emoji}</span>
                  <span className="font-medium" style={{ color: '#1E3A5F' }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Exercise List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: '#1E3A5F' }}>
                Exercises ({exerciseList.length})
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExercisePicker(true)}
              >
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>

            {exerciseList.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {exerciseList.map((ex, index) => (
                  <div
                    key={`${ex.id}-${index}`}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl"
                  >
                    {/* Drag handle / reorder buttons */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleMoveExercise(index, -1)}
                        disabled={index === 0}
                        className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMoveExercise(index, 1)}
                        disabled={index === exerciseList.length - 1}
                        className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Exercise info */}
                    <span className="text-xl">{ex.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" style={{ color: '#1E3A5F' }}>
                        {ex.name}
                      </p>
                    </div>

                    {/* Sets input */}
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={ex.sets}
                        onChange={(e) => handleUpdateExercise(index, 'sets', e.target.value)}
                        className="w-12 p-1 text-center border border-gray-200 rounded-lg text-sm"
                        min="1"
                        max="10"
                      />
                      <span className="text-xs" style={{ color: '#6B7C93' }}>sets</span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveExercise(index)}
                      className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p style={{ color: '#6B7C93' }}>No exercises added yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExercisePicker(true)}
                  className="mt-2"
                >
                  Add Your First Exercise
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isValid}
              className="flex-1"
            >
              <Save size={18} className="mr-2" />
              {template?.id ? 'Update' : 'Create'} Template
            </Button>
          </div>
        </div>
      </Modal>

      {/* Exercise Picker */}
      <ExercisePicker
        isOpen={showExercisePicker}
        onClose={() => setShowExercisePicker(false)}
        onSelect={handleAddExercise}
        excludeIds={exerciseList.map(ex => ex.id)}
      />
    </>
  );
}

export default TemplateEditor;
