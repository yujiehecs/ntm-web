'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TableOfContentsProps {
  sections: Array<{
    id: string;
    label: string;
    icon?: string;
  }>;
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
      }
    );

    // Observe all sections
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <aside className="hidden lg:block w-48 flex-shrink-0">
      <nav className="sticky top-20 space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
          📑 On This Page
        </p>
        <div className="border-l-2 border-gray-200">
          {sections.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={cn(
                'block w-full text-left px-3 py-2 text-sm transition-colors border-l-2 -ml-0.5',
                activeSection === id
                  ? 'border-blue-600 text-blue-600 font-medium bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <span className="flex items-center gap-2">
                {icon && <span className="text-base">{icon}</span>}
                <span>{label}</span>
              </span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}
