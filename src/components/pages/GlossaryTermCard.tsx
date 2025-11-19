'use client';

import type { GlossaryTerm } from '@/lib/types/glossary';
import { Badge } from '@/components/ui/basics';

interface GlossaryTermCardProps {
  term: GlossaryTerm;
  termTitle: string;
  onClick?: () => void;
}

export function GlossaryTermCard({ term, termTitle, onClick }: GlossaryTermCardProps) {
  // Get definition preview
  const definition = term.definition_short || term.definition_long || '';
  
  const definitionPreview = definition.length > 120 
    ? definition.substring(0, 120) + '...' 
    : definition;

  // Count related terms
  const relatedCount = term.related_terms?.length || 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
    >
      {/* Term Name */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {term.canonical}
      </h3>

      {/* Category Badge */}
      <div className="mb-3">
        <Badge variant="secondary" className="text-xs">
          {term.category}
        </Badge>
      </div>

      {/* Definition Preview */}
      {definitionPreview && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {definitionPreview}
        </p>
      )}

      {/* Variants (if exists and space permits) */}
      {term.variants && term.variants.length > 0 && (
        <p className="text-xs text-gray-500 mb-3 italic">
          Also: {term.variants.slice(0, 2).join(', ')}
          {term.variants.length > 2 && ` +${term.variants.length - 2} more`}
        </p>
      )}

      {/* Related Terms Count */}
      {relatedCount > 0 && (
        <div className="flex items-center text-sm text-blue-600 font-medium">
          <span>{relatedCount} related term{relatedCount !== 1 ? 's' : ''}</span>
          <span className="ml-1">→</span>
        </div>
      )}
    </div>
  );
}
