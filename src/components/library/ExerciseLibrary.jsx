import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { PageContainer, PageSection } from '../layout';
import { Button, Badge } from '../common';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseDetail } from './ExerciseDetail';
import { exercises, categories } from '../../data/exercises';

export function ExerciseLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!ex.name.toLowerCase().includes(query) &&
            !ex.description.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && ex.category !== selectedCategory) {
        return false;
      }

      // Location filter
      if (selectedLocation) {
        if (selectedLocation === 'home' && ex.location === 'gym') {
          return false;
        }
        if (selectedLocation === 'gym' && ex.location === 'home') {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedLocation]);

  const groupedExercises = useMemo(() => {
    const groups = {};
    filteredExercises.forEach(ex => {
      if (!groups[ex.category]) {
        groups[ex.category] = [];
      }
      groups[ex.category].push(ex);
    });
    return groups;
  }, [filteredExercises]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedLocation(null);
  };

  const hasFilters = searchQuery || selectedCategory || selectedLocation;

  return (
    <PageContainer
      title="Exercise Library"
      subtitle={`${exercises.length} exercises to explore`}
    >
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-white rounded-xl border-0
                     focus:ring-2 focus:ring-[--color-primary] outline-none
                     text-[--color-secondary] placeholder:text-gray-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={showFilters ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} className="mr-1" />
          Filters
          {hasFilters && (
            <span className="ml-1 w-2 h-2 bg-[--color-celebration] rounded-full" />
          )}
        </Button>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl p-4 mb-4 space-y-4">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-semibold text-[--color-secondary] mb-2">
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categories).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(
                    selectedCategory === key ? null : key
                  )}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium
                    transition-colors duration-200
                    ${selectedCategory === key
                      ? 'bg-[--color-primary] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <h3 className="text-sm font-semibold text-[--color-secondary] mb-2">
              Location
            </h3>
            <div className="flex gap-2">
              {[
                { key: null, label: 'All' },
                { key: 'gym', label: 'At Gym' },
                { key: 'home', label: 'At Home' }
              ].map(({ key, label }) => (
                <button
                  key={label}
                  onClick={() => setSelectedLocation(key)}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium
                    transition-colors duration-200
                    ${selectedLocation === key
                      ? 'bg-[--color-primary] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-[--color-text-muted] mb-4">
        Showing {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''}
      </p>

      {/* Exercise List by Category */}
      {selectedCategory ? (
        // Single category view
        <div className="space-y-3">
          {filteredExercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onClick={() => setSelectedExercise(exercise)}
            />
          ))}
        </div>
      ) : (
        // Grouped by category view
        Object.entries(groupedExercises).map(([category, exs]) => (
          <PageSection
            key={category}
            title={`${categories[category]?.emoji} ${categories[category]?.name}`}
          >
            <div className="space-y-3">
              {exs.map(exercise => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onClick={() => setSelectedExercise(exercise)}
                />
              ))}
            </div>
          </PageSection>
        ))
      )}

      {/* Empty State */}
      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-[--color-secondary] font-semibold">No exercises found</p>
          <p className="text-[--color-text-muted] text-sm mt-1">
            Try adjusting your filters
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="mt-4"
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* Exercise Detail Modal */}
      <ExerciseDetail
        exercise={selectedExercise}
        isOpen={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </PageContainer>
  );
}

export default ExerciseLibrary;
