'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/basics';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import type { CommonQuestion } from '@/lib/types';

interface FAQAccordionProps {
  questions: CommonQuestion[];
}

export function FAQAccordion({ questions }: FAQAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (questions.length === 0) return null;

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>❓</span>
          <span>Common Questions</span>
          <span className="text-sm font-normal text-gray-600">({questions.length})</span>
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
        <div className="space-y-2">
          {questions.map((qa, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Question button */}
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">
                  {qa.question}
                </span>
                {openIndex === index ? (
                  <MinusIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <PlusIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>

              {/* Answer */}
              {openIndex === index && (
                <div className="px-4 pb-4 pt-0 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {qa.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
