'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { Card, Badge, Button } from '@/components/ui/basics';
import { ArrowLeftIcon, CalendarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { loadManualTagsData, processManualTagsData, filterThreads } from '@/lib/data/processor';
import type { TopicInfo, Thread, FilterOptions } from '@/lib/types';
import { formatNumber, getRelativeTime, capitalizeWords } from '@/lib/utils';
import { TOPIC_MAPPINGS, FILTER_OPTIONS, EXTERNAL_LINKS } from '@/lib/constants';

export function TopicPageClient({ topicName }: { topicName: string }) {
  const [topic, setTopic] = useState<TopicInfo | null>(null);
  const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    timeRange: 'all',
    sortBy: 'latest',
    searchQuery: ''
  });

  useEffect(() => {
    async function loadTopicData() {
      try {
        setLoading(true);
        const rawData = await loadManualTagsData();
        const processedData = processManualTagsData(rawData);

        const foundTopic = processedData.topics[topicName];
        if (!foundTopic) {
          setError(`Topic "${topicName}" not found`);
          return;
        }

        setTopic(foundTopic);
        setFilteredThreads(foundTopic.threads);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load topic data');
        console.error('Error loading topic:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTopicData();
  }, [topicName]);

  useEffect(() => {
    if (!topic) return;
    
    const filtered = filterThreads(topic.threads, filters.timeRange, filters.searchQuery);
    
    // Apply sorting
    let sorted = [...filtered];
    if (filters.sortBy === 'latest') {
      sorted.sort((a, b) => {
        const dateA = a.latest_post_date_iso || a.tagged_date;
        const dateB = b.latest_post_date_iso || b.tagged_date;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    } else if (filters.sortBy === 'oldest') {
      sorted.sort((a, b) => {
        const dateA = a.latest_post_date_iso || a.tagged_date;
        const dateB = b.latest_post_date_iso || b.tagged_date;
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });
    }
    
    setFilteredThreads(sorted);
  }, [topic, filters]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading topic data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !topic) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Topic Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'Unknown error occurred'}</p>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const topicMapping = TOPIC_MAPPINGS[topicName];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{topicMapping?.displayName || topicName}</h1>
            <p className="text-gray-600 mt-1">{topicMapping?.description}</p>
          </div>

          <div className="text-right">
            <Badge>{topic.category}</Badge>
            <p className="text-sm text-gray-600 mt-2">
              {formatNumber(topic.threadCount)} discussions
            </p>
          </div>
        </div>

        {/* Time Series Chart */}
        {topic.monthlyTrend.length > 0 && (
          <Card>
            <TimeSeriesChart
              data={topic.monthlyTrend}
              title="Discussion Trends Over Time"
              height={300}
            />
          </Card>
        )}

        {/* Filters */}
        <Card>
          <div className="flex flex-wrap gap-4">
            {/* Time Range Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Time Range
              </label>
              <select
                value={filters.timeRange}
                onChange={(e) => setFilters({ ...filters, timeRange: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {FILTER_OPTIONS.timeRange.map((option: any) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Sort By Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {FILTER_OPTIONS.sortBy.map((option: any) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                placeholder="Search discussions..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {filters.timeRange !== 'all' || filters.searchQuery ? (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredThreads.length} of {topic.threadCount} discussions
              <button
                onClick={() => setFilters({ timeRange: 'all', sortBy: 'latest', searchQuery: '' })}
                className="ml-2 text-blue-600 hover:text-blue-500"
              >
                Clear filters
              </button>
            </div>
          ) : null}
        </Card>

        {/* Discussions List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
            Discussions
          </h2>

          {filteredThreads.length === 0 ? (
            <Card>
              <div className="text-center py-8 text-gray-500">
                <p>No discussions found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({ timeRange: 'all', sortBy: 'latest', searchQuery: '' })}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          ) : (
            filteredThreads.map((thread, index) => (
              <Card key={index} hover className="cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {thread.thread_title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {thread.relevant_topics.length > 1 && (
                        <>
                          Also tagged: {thread.relevant_topics
                            .filter(t => t !== topicName)
                            .map(t => TOPIC_MAPPINGS[t]?.displayName || t)
                            .join(', ')}
                        </>
                      )}
                    </p>
                  </div>

                  <div className="text-sm text-gray-500 text-right ml-4">
                    <p>{getRelativeTime(thread.latest_post_date_iso || thread.tagged_date)}</p>
                    <p className="text-xs">
                      <a
                        href={thread.thread_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500"
                      >
                        View Discussion →
                      </a>
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
