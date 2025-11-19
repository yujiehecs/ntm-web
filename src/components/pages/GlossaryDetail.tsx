'use client';

import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/basics';
import type { GlossaryTerm } from '@/lib/types/glossary';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface GlossaryDetailProps {
  term: GlossaryTerm;
  termTitle: string;
  allTerms: Record<string, GlossaryTerm>;
}

export function GlossaryDetail({ term, termTitle, allTerms }: GlossaryDetailProps) {
  const definition = term.definition_long || term.definition_short || '';

  // Helper to convert term name to slug
  const termToSlug = (termName: string) => {
    const termData = allTerms[termName];
    if (!termData) return '';
    return termData.canonical.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => {
            const basePath = process.env.NODE_ENV === 'production' ? '/ntm-web' : '';
            window.location.href = `${basePath}/?tab=glossary`;
          }}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Glossary</span>
        </button>

        {/* Term Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {term.canonical}
          </h1>

          {/* Variants */}
          {term.variants && term.variants.length > 0 && (
            <div className="mb-4">
              <span className="text-gray-600 text-sm font-medium">Also known as: </span>
              <span className="text-gray-700 text-sm">
                {term.variants.join(', ')}
              </span>
            </div>
          )}

          {/* Category Badge */}
          <div className="mb-4">
            <Badge variant="secondary">{term.category}</Badge>
          </div>

          {/* Type */}
          {term.type && (
            <div className="text-sm text-gray-500">
              <span className="font-medium">Type: </span>
              {term.type}
            </div>
          )}
        </div>

        {/* Definition Section */}
        {definition && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📖</span>
              <span>Definition</span>
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {definition}
            </p>
          </div>
        )}

        {/* Usage Examples Section */}
        {term.extracted_examples && term.extracted_examples.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>💬</span>
              <span>Usage Examples</span>
              <span className="text-sm text-gray-500 font-normal">
                (from patient forum)
              </span>
            </h2>
            <div className="space-y-4">
              {term.extracted_examples.slice(0, 5).map((example, idx) => (
                <div key={idx} className="border-l-4 border-blue-200 pl-4 py-2">
                  <p className="text-gray-700 italic">"{example.text}"</p>
                  {example.context && (
                    <p className="text-sm text-gray-500 mt-1">
                      Context: {example.context}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Terms Section */}
        {term.related_terms && term.related_terms.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔗</span>
              <span>Related Terms</span>
              <span className="text-sm text-gray-500 font-normal">
                ({term.related_terms.length})
              </span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {term.related_terms.map((relatedTermTitle) => {
                const relatedTerm = allTerms[relatedTermTitle];
                if (!relatedTerm) return null;
                
                const slug = termToSlug(relatedTermTitle);
                
                return (
                  <button
                    key={relatedTermTitle}
                    onClick={() => {
                      const basePath = process.env.NODE_ENV === 'production' ? '/ntm-web' : '';
                      window.location.href = `${basePath}/glossary/${slug}`;
                    }}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    {relatedTerm.canonical}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
