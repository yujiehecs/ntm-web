'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { CategoryGrid } from '@/components/ui/CategorySection';
import { ClockIcon } from '@heroicons/react/24/outline';
import { loadManualTagsData, processManualTagsData } from '@/lib/data/processor';
import type { ProcessedData } from '@/lib/types';
import type { GlossaryData } from '@/lib/types/glossary';
import { formatNumber } from '@/lib/utils';
import { APP_CONFIG } from '@/lib/constants';
import { GlossaryView } from './GlossaryView';

type TabType = 'topics' | 'glossary';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('topics');
  const [data, setData] = useState<ProcessedData | null>(null);
  const [glossaryData, setGlossaryData] = useState<GlossaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize tab from URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'glossary' || tab === 'topics') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Load data based on active tab
  useEffect(() => {
    async function loadData() {
      try {
        console.log('Dashboard: Starting data load...');
        setLoading(true);
        setError(null);

        if (activeTab === 'topics') {
          const rawData = await loadManualTagsData();
          console.log('Dashboard: Raw data loaded:', {
            metadata: rawData.metadata,
            manualTagsCount: Object.keys(rawData.manual_tags || {}).length
          });

          const processedData = processManualTagsData(rawData);
          console.log('Dashboard: Data processed:', {
            topicsCount: Object.keys(processedData.topics).length,
            categoriesCount: processedData.categories.length,
            trendingCount: processedData.trending.length,
            totalThreads: processedData.totalThreads
          });

          setData(processedData);
        } else if (activeTab === 'glossary') {
          const response = await fetch('/data/glossary.json');
          if (!response.ok) {
            throw new Error('Failed to load glossary data');
          }
          const glossary = await response.json();
          console.log('Dashboard: Glossary data loaded:', {
            version: glossary.version,
            totalTerms: glossary.statistics.total_terms
          });
          setGlossaryData(glossary);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        console.error('Dashboard: Error loading data:', err);
      } finally {
        setLoading(false);
        console.log('Dashboard: Loading complete');
      }
    }

    loadData();
  }, [activeTab]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Loading {activeTab === 'topics' ? 'community insights' : 'glossary'}...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || (activeTab === 'topics' && !data) || (activeTab === 'glossary' && !glossaryData)) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Data</h2>
          <p className="text-gray-600 mb-4">{error || 'Unknown error occurred'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📊 {APP_CONFIG.name}
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            {APP_CONFIG.description}
          </p>

          {/* Tab Switcher */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => {
                setActiveTab('topics');
                window.history.pushState({}, '', '/?tab=topics');
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'topics'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Topics
            </button>
            <button
              onClick={() => {
                setActiveTab('glossary');
                window.history.pushState({}, '', '/?tab=glossary');
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'glossary'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Glossary
            </button>
          </div>

          {/* Stats for Topics tab */}
          {activeTab === 'topics' && data && (
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">{formatNumber(data.totalThreads)}</span>
                <span>Discussions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">{data.categories.length}</span>
                <span>Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">{Object.keys(data.topics).length}</span>
                <span>Topics</span>
              </div>
            </div>
          )}

          {/* Stats for Glossary tab */}
          {activeTab === 'glossary' && glossaryData && (
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">{glossaryData.statistics.total_terms}</span>
                <span>Terms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">{Object.keys(glossaryData.statistics.categories).length}</span>
                <span>Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">{glossaryData.statistics.terms_with_examples}</span>
                <span>With Examples</span>
              </div>
            </div>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'topics' && data && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📂 Browse Topics by Category
            </h2>

            <CategoryGrid
              categories={data.categories}
              onTopicClick={(topicName) => {
                window.location.href = `/topic/${topicName}`;
              }}
            />
          </section>
        )}

        {activeTab === 'glossary' && glossaryData && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📖 Medical Glossary
            </h2>

            <GlossaryView data={glossaryData} />
          </section>
        )}
      </div>
    </Layout>
  );
}