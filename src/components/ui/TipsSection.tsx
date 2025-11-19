'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/basics';
import { TipCard } from '@/components/ui/TipCard';
import type { Tip } from '@/lib/types';

interface TipsSectionProps {
  tips: Tip[];
}

type PriorityFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';
type SourceFilter = 'all' | 'expert' | 'patient' | 'research';

export function TipsSection({ tips }: TipsSectionProps) {
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');

  const filteredTips = useMemo(() => {
    return tips.filter((tip) => {
      // Priority filter
      if (priorityFilter !== 'all' && tip.priority !== priorityFilter) {
        return false;
      }

      // Source filter
      if (sourceFilter !== 'all') {
        if (sourceFilter === 'expert' && !['expert', 'expert_validated'].includes(tip.source_type)) {
          return false;
        }
        if (sourceFilter === 'patient' && !['patient_experience', 'patient_validated', 'patient_wisdom'].includes(tip.source_type)) {
          return false;
        }
        if (sourceFilter === 'research' && tip.source_type !== 'research_evidence') {
          return false;
        }
      }

      return true;
    });
  }, [tips, priorityFilter, sourceFilter]);

  // Count tips by priority
  const counts = useMemo(() => {
    return {
      critical: tips.filter(t => t.priority === 'critical').length,
      high: tips.filter(t => t.priority === 'high').length,
      medium: tips.filter(t => t.priority === 'medium').length,
      low: tips.filter(t => t.priority === 'low').length,
    };
  }, [tips]);

  if (tips.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Header and Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>🎯</span>
              <span>Expert Tips & Guidance</span>
              <span className="text-sm font-normal text-gray-600">({tips.length})</span>
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Priority Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities ({tips.length})</option>
                <option value="critical">🔴 Critical ({counts.critical})</option>
                <option value="high">🟠 High ({counts.high})</option>
                <option value="medium">🟡 Medium ({counts.medium})</option>
                <option value="low">⚪ Low ({counts.low})</option>
              </select>
            </div>

            {/* Source Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Type
              </label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sources</option>
                <option value="expert">👨‍🔬 Expert Validated</option>
                <option value="patient">👥 Patient Experience</option>
                <option value="research">📚 Research Evidence</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          {filteredTips.length !== tips.length && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-600">
                Showing {filteredTips.length} of {tips.length} tips
              </p>
              <button
                onClick={() => {
                  setPriorityFilter('all');
                  setSourceFilter('all');
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Tips List */}
      <div className="space-y-4">
        {filteredTips.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">
              No tips match your current filters. Try adjusting your selection.
            </p>
          </Card>
        ) : (
          filteredTips.map((tip, index) => (
            <TipCard key={index} tip={tip} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
