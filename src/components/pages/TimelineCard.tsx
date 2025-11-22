'use client';

import { useState } from 'react';
import type { PatientTimeline } from '@/lib/types/timeline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface TimelineCardProps {
  timeline: PatientTimeline;
}

// Outcome color mapping
const OUTCOME_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  'sustained_negative': {
    bg: 'bg-green-50',
    text: 'text-green-700',
    bar: 'bg-green-500',
  },
  'ongoing_treatment': {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    bar: 'bg-yellow-500',
  },
  'treatment_ongoing': {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    bar: 'bg-yellow-500',
  },
  'recurrence': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    bar: 'bg-blue-500',
  },
  'treatment_failure': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    bar: 'bg-red-500',
  },
  'treatment_stopped': {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    bar: 'bg-gray-500',
  },
  'treatment_decision_pending': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    bar: 'bg-purple-500',
  },
};

export function TimelineCard({ timeline }: TimelineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const outcomeStyle = OUTCOME_COLORS[timeline.outcome.category] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    bar: 'bg-gray-500',
  };

  // Format outcome category for display
  const formatOutcome = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format complexity for display
  const formatComplexity = (complexity: string) => {
    return complexity.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Create visual segments for timeline based on actual dates
  const createTimelineSegments = () => {
    const events = timeline.timeline.events;
    if (events.length === 0) return null;

    // Parse dates and calculate positions
    const eventsWithDates: { event: typeof events[0]; date: Date | null; monthOffset: number }[] = [];
    
    events.forEach((event) => {
      let date: Date | null = null;
      let monthOffset = 0;

      if (event.date) {
        // Try to parse absolute dates
        if (event.date.match(/^\d{4}-\d{2}/)) {
          try {
            const dateStr = event.date.length === 7 ? `${event.date}-01` : event.date;
            date = new Date(dateStr);
          } catch (e) {
            // Invalid date
          }
        } else if (event.date.match(/^\+(\d+)mo$/)) {
          // Relative date like "+12mo"
          const match = event.date.match(/^\+(\d+)mo$/);
          if (match) {
            monthOffset = parseInt(match[1]);
          }
        }
      }

      eventsWithDates.push({ event, date, monthOffset });
    });

    // Find the first valid date as reference
    const firstDate = eventsWithDates.find(e => e.date)?.date;
    if (!firstDate && eventsWithDates.every(e => e.monthOffset === 0)) {
      // No date information, fall back to even distribution
      return null;
    }

    // Calculate month offsets from start
    const monthOffsets = eventsWithDates.map((item, idx) => {
      if (item.date && firstDate) {
        const diffMs = item.date.getTime() - firstDate.getTime();
        const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30.44);
        return Math.max(0, diffMonths);
      }
      return item.monthOffset || idx;
    });

    const maxMonths = Math.max(...monthOffsets, 1);
    const minMonth = Math.min(...monthOffsets);

    // Create segments between events
    const segments: { 
      label: string; 
      type: string; 
      startMonth: number; 
      endMonth: number;
      widthPercent: number;
    }[] = [];

    // Add a pre-treatment segment if timeline doesn't start at 0
    if (minMonth > 0) {
      segments.push({
        label: '',
        type: 'monitoring',
        startMonth: 0,
        endMonth: minMonth,
        widthPercent: (minMonth / maxMonths) * 100
      });
    }

    for (let i = 0; i < eventsWithDates.length; i++) {
      const event = eventsWithDates[i].event;
      const startMonth = monthOffsets[i];
      const endMonth = i < eventsWithDates.length - 1 ? monthOffsets[i + 1] : maxMonths;
      const widthPercent = ((endMonth - startMonth) / maxMonths) * 100;

      if (widthPercent < 0.5) continue; // Skip tiny segments

      const shortLabel = 
        event.event_type === 'diagnosis' ? 'DX' :
        event.event_type === 'treatment_start' ? (
          i === 0 ? 'Start' : 
          event.description.toLowerCase().includes('restart') ? 'Restart' :
          event.description.toLowerCase().includes('new') ? 'New Rx' :
          'Start'
        ) :
        event.event_type === 'treatment_change' ? 'Change' :
        event.event_type === 'treatment_stop' ? 'Stop' :
        event.event_type === 'clinical_milestone' ? event.culture_result === 'negative' ? 'NEG' : 'Mile' :
        event.event_type === 'side_effect' ? 'SE' :
        event.event_type === 'monitoring' ? 'Mon' :
        'Event';

      // Determine segment type based on culture results and event type
      let segmentType = 'treatment'; // default
      if (event.culture_result === 'negative') {
        segmentType = 'negative';
      } else if (event.event_type === 'monitoring') {
        segmentType = 'monitoring';
      } else if (event.event_type === 'side_effect') {
        segmentType = 'side_effect';
      } else if (event.event_type === 'treatment_stop') {
        segmentType = 'monitoring';
      }

      segments.push({
        label: shortLabel,
        type: segmentType,
        startMonth,
        endMonth,
        widthPercent
      });
    }

    return segments;
  };

  const timelineSegments = createTimelineSegments();

  return (
    <div className={`bg-white rounded-lg border-2 border-gray-200 overflow-hidden transition-all hover:shadow-lg ${outcomeStyle.bg}`}>
      {/* Header */}
      <div className="p-6">
        {/* Top line: Patient ID, Species, Location */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-gray-900">{timeline.patient_label}</h3>
            <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
              {timeline.disease.species_short}
            </span>
            {timeline.demographics.diagnosis_year && (
              <span className="text-sm text-gray-500">
                {typeof timeline.demographics.diagnosis_year === 'string' 
                  ? timeline.demographics.diagnosis_year.split('(')[0].trim()
                  : timeline.demographics.diagnosis_year}
              </span>
            )}
          </div>
          <div className="text-sm font-medium text-gray-600">
            {timeline.demographics.location}
          </div>
        </div>

        {/* Duration summary */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">
            {timeline.timeline.duration_months ? (
              `⏱️ ${Math.round(timeline.timeline.duration_months)} months`
            ) : (
              `📅 ${timeline.timeline.event_count} events`
            )}
          </span>
        </div>

        {/* Outcome badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${outcomeStyle.bg} ${outcomeStyle.text}`}>
            🎯 {formatOutcome(timeline.outcome.category)}
          </span>
          <span className="text-xs text-gray-500">
            Complexity: {formatComplexity(timeline.classification.complexity)}
          </span>
        </div>

        {/* Key insight */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          💡 {timeline.key_insight}
        </p>

        {/* Metadata row */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>📊 {timeline.classification.educational_value} value</span>
            {timeline.classification.story_types.length > 0 && (
              <span className="flex items-center gap-1">
                🏷️ {timeline.classification.story_types.slice(0, 2).join(', ')}
                {timeline.classification.story_types.length > 2 && (
                  <span> +{timeline.classification.story_types.length - 2}</span>
                )}
              </span>
            )}
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
          >
            {isExpanded ? (
              <>
                <span>Collapse</span>
                <ChevronUpIcon className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>View Details</span>
                <ChevronDownIcon className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          {/* Patient details */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Patient Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Diagnosis Year:</span>
                <span className="ml-2 text-gray-900">{timeline.demographics.diagnosis_year}</span>
              </div>
              <div>
                <span className="text-gray-600">Disease Type:</span>
                <span className="ml-2 text-gray-900">{timeline.disease.disease_type}</span>
              </div>
              <div>
                <span className="text-gray-600">Severity:</span>
                <span className="ml-2 text-gray-900">{timeline.disease.severity}</span>
              </div>
              {timeline.disease.comorbidities.length > 0 && (
                <div>
                  <span className="text-gray-600">Comorbidities:</span>
                  <span className="ml-2 text-gray-900">{timeline.disease.comorbidities.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline events */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Timeline Events</h4>
            <div className="space-y-3">
              {timeline.timeline.events.map((event) => (
                <div key={event.event_number} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                      {event.event_number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500">
                          {event.event_type.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                        </span>
                        {event.date && (
                          <span className="text-xs text-gray-500">{event.date}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 mb-2">
                        {event.description || <span className="italic text-gray-400">No description available</span>}
                      </p>
                      
                      {event.medications.length > 0 && (
                        <div className="text-xs text-gray-600 mb-1">
                          💊 {event.medications.join(', ')}
                        </div>
                      )}
                      
                      {event.culture_result && (
                        <div className="text-xs text-gray-600 mb-1">
                          🔬 Culture: {event.culture_result}
                        </div>
                      )}
                      
                      {event.side_effects && event.side_effects.length > 0 && (
                        <div className="text-xs text-orange-600 mb-1">
                          ⚠️ Side effects: {Array.isArray(event.side_effects) 
                            ? event.side_effects.map((se: any) => {
                                if (typeof se === 'string') return se;
                                // Handle object side effects - extract meaningful text
                                if (typeof se === 'object' && se !== null) {
                                  return se.side_effect || se.symptom || se.side_effect_type || 
                                         se.description || 'Side effect noted';
                                }
                                return String(se);
                              }).join(', ')
                            : String(event.side_effects)}
                        </div>
                      )}
                      
                      {event.notes && (
                        <div className="text-xs text-gray-500 italic mt-2">
                          {event.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source link */}
          <div className="text-sm mt-4 pt-4 border-t border-gray-200">
            <a
              href={timeline.source.thread_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline font-medium cursor-pointer"
            >
              View original forum discussion →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
