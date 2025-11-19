'use client';

import { useState, useMemo } from 'react';
import type { GlossaryData, GlossaryTerm } from '@/lib/types/glossary';
import { GlossaryTermCard } from '@/components/pages/GlossaryTermCard';

interface GlossaryViewProps {
  data: GlossaryData;
}

export function GlossaryView({ data }: GlossaryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract and sort categories
  const categories = useMemo(() => {
    const cats = Object.entries(data.statistics.categories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    return [{ name: 'All', count: data.statistics.total_terms }, ...cats];
  }, [data]);

  // Filter and search terms
  const filteredTerms = useMemo(() => {
    const termsArray = Object.entries(data.terms).map(([title, term]) => ({
      title,
      term,
    }));

    let filtered = termsArray;

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(({ term }) => term.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(({ title, term }) => {
        return (
          title.toLowerCase().includes(query) ||
          term.canonical.toLowerCase().includes(query) ||
          term.variants.some(v => v.toLowerCase().includes(query)) ||
          (term.definition_short?.toLowerCase().includes(query)) ||
          (term.definition_long?.toLowerCase().includes(query))
        );
      });
    }

    // Sort alphabetically by canonical name
    return filtered.sort((a, b) => 
      a.term.canonical.localeCompare(b.term.canonical)
    );
  }, [data.terms, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search 80 terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                Clear
              </button>
            )}
            <span className="text-sm text-gray-500">
              {filteredTerms.length} terms
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-gray-600">
        Showing {filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'}
      </div>

      {/* Terms Grid */}
      {filteredTerms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map(({ title, term }) => (
            <GlossaryTermCard
              key={title}
              term={term}
              termTitle={title}
              onClick={() => {
                const slug = term.canonical.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
                window.location.href = `/glossary/${slug}`;
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No terms found matching your search.
        </div>
      )}
    </div>
  );
}
