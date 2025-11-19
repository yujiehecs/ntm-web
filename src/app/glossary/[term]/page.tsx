import { notFound } from 'next/navigation';
import { GlossaryDetail } from '@/components/pages/GlossaryDetail';
import type { GlossaryData } from '@/lib/types/glossary';

async function loadGlossaryData(): Promise<GlossaryData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/data/glossary.json`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to load glossary data');
  }

  return response.json();
}

function slugToTermTitle(slug: string, glossary: GlossaryData): string | null {
  // Try to find matching term by slug
  const entries = Object.entries(glossary.terms);
  
  for (const [title, term] of entries) {
    const termSlug = term.canonical.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
    if (termSlug === slug) {
      return title;
    }
  }
  
  return null;
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term: slug } = await params;
  
  try {
    const glossary = await loadGlossaryData();
    const termTitle = slugToTermTitle(slug, glossary);
    
    if (!termTitle) {
      notFound();
    }
    
    const term = glossary.terms[termTitle];
    
    return (
      <GlossaryDetail 
        term={term}
        termTitle={termTitle}
        allTerms={glossary.terms}
      />
    );
  } catch (error) {
    console.error('Error loading glossary term:', error);
    notFound();
  }
}

// Generate static params for all terms
export async function generateStaticParams() {
  try {
    const glossary = await loadGlossaryData();
    
    return Object.values(glossary.terms).map((term) => ({
      term: term.canonical.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
