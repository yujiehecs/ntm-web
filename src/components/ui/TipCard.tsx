'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/basics';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import type { Tip } from '@/lib/types';
import { getThreadUrl } from '@/lib/data/processor';

interface TipCardProps {
  tip: Tip;
  index: number;
}

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: 'danger', icon: '🔴' },
  high: { label: 'High', color: 'warning', icon: '🟠' },
  medium: { label: 'Medium', color: 'secondary', icon: '🟡' },
  low: { label: 'Low', color: 'secondary', icon: '⚪' },
} as const;

const SOURCE_CONFIG = {
  expert: { label: 'Expert', icon: '👨‍🔬' },
  expert_validated: { label: 'Expert Validated', icon: '✓' },
  patient_experience: { label: 'Patient Experience', icon: '👥' },
  patient_validated: { label: 'Patient Validated', icon: '✓' },
  patient_wisdom: { label: 'Patient Wisdom', icon: '💡' },
  research_evidence: { label: 'Research', icon: '📚' },
  practical_guidance: { label: 'Practical', icon: '🔧' },
  community_debate: { label: 'Community Debate', icon: '💬' },
} as const;

export function TipCard({ tip, index }: TipCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const priorityConfig = PRIORITY_CONFIG[tip.priority];
  const sourceConfig = SOURCE_CONFIG[tip.source_type];

  // Determine left border color based on priority
  const borderColorClass = {
    critical: 'border-l-red-500',
    high: 'border-l-orange-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-gray-400',
  }[tip.priority];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm border-l-4 ${borderColorClass} p-5 space-y-3`}>
      {/* Header with badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={priorityConfig.color as any} size="sm">
          {priorityConfig.icon} {priorityConfig.label}
        </Badge>
        <Badge variant="secondary" size="sm">
          {sourceConfig.icon} {sourceConfig.label}
        </Badge>
      </div>

      {/* Tip text */}
      <p className="text-gray-800 leading-relaxed">
        {tip.tip}
      </p>

      {/* Cited threads */}
      {tip.cited_threads.length > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">📎 Cited in discussions:</p>
          <div className="flex flex-wrap gap-2">
            {tip.cited_threads.map((threadSlug) => (
              <a
                key={threadSlug}
                href={getThreadUrl(threadSlug)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2 py-1 rounded"
              >
                {threadSlug}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Notes - expandable */}
      {tip.notes && (
        <div className="pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="font-medium">Additional context</span>
            {isExpanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
          {isExpanded && (
            <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {tip.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
