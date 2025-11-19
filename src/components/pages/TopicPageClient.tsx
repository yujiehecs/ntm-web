'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { Card, Badge, Button } from '@/components/ui/basics';
import { TipsSection } from '@/components/ui/TipsSection';
import { KeyInsightsSection } from '@/components/ui/KeyInsightsSection';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { TableOfContents } from '@/components/ui/TableOfContents';
import { ArrowLeftIcon, CalendarIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { loadManualTagsData, processManualTagsData, filterThreads, loadTopicTips } from '@/lib/data/processor';
import type { TopicInfo, Thread, FilterOptions, TopicTips } from '@/lib/types';
import { formatNumber, getRelativeTime, capitalizeWords } from '@/lib/utils';
import { TOPIC_MAPPINGS, FILTER_OPTIONS, EXTERNAL_LINKS } from '@/lib/constants';
import { navigateTo } from '@/lib/navigation';

export function TopicPageClient({ topicName }: { topicName: string }) {
  const [topic, setTopic] = useState<TopicInfo | null>(null);
  const [topicTips, setTopicTips] = useState<TopicTips | null>(null);
  const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discussionsCollapsed, setDiscussionsCollapsed] = useState(false);
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

        // Load topic tips (non-blocking)
        const tips = await loadTopicTips(topicName);
        setTopicTips(tips);
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
            onClick={() => navigateTo('/')}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const topicMapping = TOPIC_MAPPINGS[topicName];

  // Table of contents sections
  const tocSections = [
    { id: 'trends', label: 'Discussion Trends', icon: '📊' },
    ...(topicTips?.tips.length ? [{ id: 'tips', label: 'Expert Tips', icon: '🎯' }] : []),
    ...(topicTips?.key_insights.length ? [{ id: 'insights', label: 'Key Insights', icon: '💡' }] : []),
    ...(topicTips?.common_questions.length ? [{ id: 'faq', label: 'FAQ', icon: '❓' }] : []),
    { id: 'discussions', label: 'Discussions', icon: '💬' },
  ];

  return (
    <Layout>
      <div className="flex gap-8 max-w-7xl mx-auto">
        {/* Sticky Sidebar - Table of Contents */}
        <TableOfContents sections={tocSections} />

        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigateTo('/')}
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
          <section id="trends">
            {topic.monthlyTrend.length > 0 && (
              <Card>
                <TimeSeriesChart
                  data={topic.monthlyTrend}
                  title="Discussion Trends Over Time"
                  height={300}
                />
              </Card>
            )}
          </section>

          {/* Expert Tips & Guidance */}
          {topicTips?.tips && topicTips.tips.length > 0 && (
            <section id="tips">
              <TipsSection tips={topicTips.tips} />
            </section>
          )}

          {/* Key Insights */}
          {topicTips?.key_insights && topicTips.key_insights.length > 0 && (
            <section id="insights">
              <KeyInsightsSection insights={topicTips.key_insights} />
            </section>
          )}

          {/* FAQ */}
          {topicTips?.common_questions && topicTips.common_questions.length > 0 && (
            <section id="faq">
              <FAQAccordion questions={topicTips.common_questions} />
            </section>
          )}

          {/* Discussions Section */}
          <section id="discussions">
            <Card>
              <div className="space-y-4">
                {/* Collapsible header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span>💬</span>
                    <span>All Discussions</span>
                    <span className="text-sm font-normal text-gray-600">({topic.threadCount})</span>
                  </h2>
                  <button
                    onClick={() => setDiscussionsCollapsed(!discussionsCollapsed)}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label={discussionsCollapsed ? 'Expand' : 'Collapse'}
                  >
                    {discussionsCollapsed ? (
                      <ChevronDownIcon className="h-5 w-5" />
                    ) : (
                      <ChevronUpIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Filters and List */}
                {!discussionsCollapsed && (
                  <>
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
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
                      <div className="text-sm text-gray-600 flex items-center justify-between">
                        <span>
                          Showing {filteredThreads.length} of {topic.threadCount} discussions
                        </span>
                        <button
                          onClick={() => setFilters({ timeRange: 'all', sortBy: 'latest', searchQuery: '' })}
                          className="text-blue-600 hover:text-blue-500 font-medium"
                        >
                          Clear filters
                        </button>
                      </div>
                    ) : null}

                    {/* Discussions List */}
                    <div className="space-y-3 pt-4">
                      {filteredThreads.length === 0 ? (
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
                      ) : (
                        filteredThreads.map((thread, index) => (
                          <div
                            key={index}
                            className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow bg-gray-50"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">
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
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </Card>
          </section>
        </main>
      </div>
    </Layout>
  );
}
