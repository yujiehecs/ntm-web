'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CompactTopicCard } from '@/components/ui/TopicCard';
import type { CategorySectionProps, TopicCategory } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';

export function CategorySection({ category, expanded = false, onToggle }: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onToggle?.();
  };

  const categoryInfo = CATEGORIES[category.name];
  const topTopics = category.topics.slice(0, 3); // Show top 3 topics
  const remainingCount = Math.max(0, category.topics.length - 3);

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoryInfo?.emoji}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{category.displayName}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right text-sm text-gray-500">
            <div>{category.topics.length} topics</div>
            <div>{formatNumber(category.totalThreads)} discussions</div>
          </div>
          {isExpanded ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="p-4 space-y-3">
            {category.topics.map((topic) => (
              <CompactTopicCard
                key={topic.name}
                topic={topic}
                onClick={() => {
                  // Navigate to topic page
                  window.location.href = `/topic/${topic.name}`;
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface CategoryGridProps {
  categories: TopicCategory[];
  onTopicClick: (topicName: string) => void;
}

export function CategoryGrid({ categories, onTopicClick }: CategoryGridProps) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <CategorySection
          key={category.name}
          category={category}
          expanded={true}
          onToggle={() => {
            // Optional: Track analytics or state
          }}
        />
      ))}
    </div>
  );
}