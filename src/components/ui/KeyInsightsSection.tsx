'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/basics';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface KeyInsightsSectionProps {
  insights: string[];
}

export function KeyInsightsSection({ insights }: KeyInsightsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  if (insights.length === 0) return null;

  const displayedInsights = showAll ? insights : insights.slice(0, 3);
  const hasMore = insights.length > 3;

  return (
    <Card className="bg-blue-50 border-blue-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>💡</span>
          <span>Key Insights</span>
          <span className="text-sm font-normal text-gray-600">({insights.length})</span>
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="space-y-3">
          <ul className="space-y-3">
            {displayedInsights.map((insight, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                <p className="text-gray-800 leading-relaxed">{insight}</p>
              </li>
            ))}
          </ul>

          {hasMore && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors mt-3"
            >
              {showAll ? 'Show less' : `Show ${insights.length - 3} more insights...`}
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
