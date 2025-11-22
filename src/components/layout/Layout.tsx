import { ReactNode } from 'react';
import { HomeIcon } from '@heroicons/react/24/outline';
import { APP_CONFIG } from '@/lib/constants';
import { navigateTo } from '@/lib/navigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateTo('/')}
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <span className="text-2xl">🔬</span>
                <h1 className="text-xl font-bold text-gray-900">
                  {APP_CONFIG.name}
                </h1>
              </button>
              <div className="hidden sm:block text-sm text-gray-500">
                {APP_CONFIG.totalThreads} discussions • {APP_CONFIG.totalTopics} topics • Human-curated
              </div>
            </div>

            <nav className="flex items-center gap-4">
              <button
                onClick={() => navigateTo('/')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <HomeIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>
              {APP_CONFIG.description} | Last updated: {new Date(APP_CONFIG.lastUpdated).toLocaleDateString()}
            </p>
            <p className="mt-2">
              Built with community data from{' '}
              <a
                href="https://ntmforum.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500"
              >
                NTM Forum
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}