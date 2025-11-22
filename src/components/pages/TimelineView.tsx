'use client';

import { useState, useMemo } from 'react';
import type { PatientTimeline, TimelineFilters } from '@/lib/types/timeline';
import { TimelineCard } from './TimelineCard';
import { TimelineFilterPanel } from './TimelineFilterPanel';

interface TimelineViewProps {
  timelines: PatientTimeline[];
}

export function TimelineView({ timelines }: TimelineViewProps) {
  const [filters, setFilters] = useState<TimelineFilters>({
    outcomes: [],
    species: [],
    complexity: [],
    storyTypes: [],
  });

  const [sortBy, setSortBy] = useState<'recent' | 'complexity' | 'duration'>('recent');

  // Filter timelines
  const filteredTimelines = useMemo(() => {
    return timelines.filter((timeline) => {
      // Outcome filter
      if (filters.outcomes.length > 0) {
        if (!filters.outcomes.includes(timeline.outcome.category)) {
          return false;
        }
      }

      // Species filter
      if (filters.species.length > 0) {
        if (!filters.species.includes(timeline.disease.species_short)) {
          return false;
        }
      }

      // Complexity filter
      if (filters.complexity.length > 0) {
        if (!filters.complexity.includes(timeline.classification.complexity)) {
          return false;
        }
      }

      // Story type filter
      if (filters.storyTypes.length > 0) {
        const hasMatchingStoryType = timeline.classification.story_types.some((type) =>
          filters.storyTypes.includes(type)
        );
        if (!hasMatchingStoryType) {
          return false;
        }
      }

      return true;
    });
  }, [timelines, filters]);

  // Sort timelines
  const sortedTimelines = useMemo(() => {
    const sorted = [...filteredTimelines];

    switch (sortBy) {
      case 'complexity':
        const complexityOrder: Record<string, number> = {
          'very_complex': 4,
          'complex': 3,
          'moderate': 2,
          'simple': 1,
          'not specified': 0,
        };
        sorted.sort((a, b) => {
          const aVal = complexityOrder[a.classification.complexity] || 0;
          const bVal = complexityOrder[b.classification.complexity] || 0;
          return bVal - aVal;
        });
        break;

      case 'duration':
        sorted.sort((a, b) => {
          const aDuration = a.timeline.duration_months || 0;
          const bDuration = b.timeline.duration_months || 0;
          return bDuration - aDuration;
        });
        break;

      case 'recent':
      default:
        // Keep original order (most recent extraction first)
        break;
    }

    return sorted;
  }, [filteredTimelines, sortBy]);

  // Calculate filter statistics
  const filterStats = useMemo(() => {
    const outcomes = new Map<string, number>();
    const species = new Map<string, number>();
    const complexity = new Map<string, number>();
    const storyTypes = new Map<string, number>();

    timelines.forEach((timeline) => {
      // Count outcomes
      outcomes.set(
        timeline.outcome.category,
        (outcomes.get(timeline.outcome.category) || 0) + 1
      );

      // Count species
      species.set(
        timeline.disease.species_short,
        (species.get(timeline.disease.species_short) || 0) + 1
      );

      // Count complexity
      complexity.set(
        timeline.classification.complexity,
        (complexity.get(timeline.classification.complexity) || 0) + 1
      );

      // Count story types
      timeline.classification.story_types.forEach((type) => {
        storyTypes.set(type, (storyTypes.get(type) || 0) + 1);
      });
    });

    return { outcomes, species, complexity, storyTypes };
  }, [timelines]);

  return (
    <div className="space-y-6">
      {/* Compact filter bar on top */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">🔍 Filters:</span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-semibold text-blue-600">{sortedTimelines.length}</span>
              <span>of {timelines.length} timelines</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {(filters.outcomes.length > 0 || filters.species.length > 0 || 
              filters.complexity.length > 0 || filters.storyTypes.length > 0) && (
              <button
                onClick={() => setFilters({ outcomes: [], species: [], complexity: [], storyTypes: [] })}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Recent</option>
                <option value="complexity">Complexity</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Compact horizontal filter chips */}
        <TimelineFilterPanel
          filters={filters}
          onFilterChange={setFilters}
          stats={filterStats}
        />
      </div>

      {/* Timeline cards - full width */}
      <div className="space-y-4">
        {sortedTimelines.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No timelines match the selected filters.</p>
            <button
              onClick={() => setFilters({ outcomes: [], species: [], complexity: [], storyTypes: [] })}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          sortedTimelines.map((timeline) => (
            <TimelineCard key={timeline.id} timeline={timeline} />
          ))
        )}
      </div>
    </div>
  );
}
