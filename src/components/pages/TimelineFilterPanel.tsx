'use client';

import { useState } from 'react';
import type { TimelineFilters } from '@/lib/types/timeline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface TimelineFilterPanelProps {
  filters: TimelineFilters;
  onFilterChange: (filters: TimelineFilters) => void;
  stats: {
    outcomes: Map<string, number>;
    species: Map<string, number>;
    complexity: Map<string, number>;
    storyTypes: Map<string, number>;
  };
}

export function TimelineFilterPanel({ filters, onFilterChange, stats }: TimelineFilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleFilter = (category: keyof TimelineFilters, value: string) => {
    const currentValues = filters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    
    onFilterChange({
      ...filters,
      [category]: newValues,
    });
  };

  const formatLabel = (text: string) => {
    return text.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Sort by count descending
  const sortedOutcomes = Array.from(stats.outcomes.entries()).sort((a, b) => b[1] - a[1]);
  const sortedSpecies = Array.from(stats.species.entries()).sort((a, b) => b[1] - a[1]);
  const sortedComplexity = Array.from(stats.complexity.entries()).sort((a, b) => b[1] - a[1]);

  const FilterSection = ({ 
    id, 
    title, 
    items, 
    selectedItems 
  }: { 
    id: keyof TimelineFilters; 
    title: string; 
    items: [string, number][]; 
    selectedItems: string[];
  }) => {
    const isExpanded = expandedSections.has(id);
    const hasSelection = selectedItems.length > 0;

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{title}</span>
            {hasSelection && (
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                {selectedItems.length}
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        
        {isExpanded && (
          <div className="p-3 bg-white space-y-2 max-h-64 overflow-y-auto">
            {items.map(([value, count]) => (
              <label 
                key={value} 
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(value)}
                  onChange={() => toggleFilter(id, value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-gray-700 flex-1">
                  {formatLabel(value)}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  ({count})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <FilterSection
        id="outcomes"
        title="Outcome"
        items={sortedOutcomes}
        selectedItems={filters.outcomes}
      />
      
      <FilterSection
        id="species"
        title="Species"
        items={sortedSpecies}
        selectedItems={filters.species}
      />
      
      <FilterSection
        id="complexity"
        title="Complexity"
        items={sortedComplexity}
        selectedItems={filters.complexity}
      />
    </div>
  );
}
