import type {
  Thread,
  ManualTagsData,
  TopicInfo,
  TopicCategory,
  TrendingTopic,
  ProcessedData,
  MonthlyDataPoint,
  TopicTips
} from '@/lib/types';
import { TOPIC_MAPPINGS, CATEGORIES, EXTERNAL_LINKS } from '@/lib/constants';
import { groupBy, sortBy, getMonthKey, calculatePercentageChange } from '@/lib/utils';
import { getBasePath } from '@/lib/utils/basePath';

/**
 * Load and process the manual tags data from JSON
 */
export async function loadManualTagsData(): Promise<ManualTagsData> {
  try {
    // Use relative path that works with basePath
    const basePath = getBasePath();
    const dataPath = `${basePath}/data/manual_tags_production.json`;
    
    console.log('Loading data from', dataPath);

    // In production, this would come from an API or static file
    // For now, we'll need to copy the data file to the public directory
    const response = await fetch(dataPath);
    console.log('Fetch response status:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as ManualTagsData;
    console.log('Data loaded successfully:', {
      totalThreads: data.metadata?.total_threads,
      taggedCount: data.metadata?.tagged_count,
      manualTagsKeys: Object.keys(data.manual_tags || {}).length
    });

    return data;
  } catch (error) {
    console.error('Error loading manual tags data:', error);
    console.log('Falling back to mock data...');

    // Return mock data for development
    return getMockData();
  }
}

/**
 * Generate realistic historical dates for threads
 */
function generateRealisticDates(threads: Thread[]): Thread[] {
  // Start from 3 years ago, end at 1 week ago
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 7);
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 3);
  const timeSpan = endDate.getTime() - startDate.getTime();

  return threads.map((thread, index) => {
    // Use simple linear distribution based on index
    const randomFactor = (index / threads.length) * 0.8 + Math.random() * 0.2;
    const threadTime = startDate.getTime() + (timeSpan * randomFactor);
    const generatedDate = new Date(threadTime);

    return {
      ...thread,
      tagged_date: generatedDate.toISOString()
    };
  });
}

/**
 * Process raw manual tags data into structured format
 */
export function processManualTagsData(data: ManualTagsData): ProcessedData {
  console.log('Processing data - threads:', data.metadata.total_threads);
  // Support both old (manual_tags) and new (enhanced_tags) formats
  const rawThreads = Object.values(data.enhanced_tags || data.manual_tags || {});

  // Check if threads have latest_post_date_iso (new format with actual dates)
  const hasLatestDates = rawThreads.length > 0 && rawThreads[0].latest_post_date_iso;
  
  console.log('Has latest post dates?', hasLatestDates);
  
  // Use latest post dates if available, otherwise fall back to generated dates
  const threads = hasLatestDates
    ? rawThreads
    : generateRealisticDates(rawThreads);

  console.log('Grouping threads by topic...');
  // Group threads by topic
  const threadsByTopic = groupThreadsByTopic(threads);

  console.log('Creating topic info map...');
  // Create topic info objects
  const topics = createTopicInfoMap(threadsByTopic);

  console.log('Creating category groups...');
  // Group topics into categories
  const categories = createCategoryGroups(topics);

  console.log('Calculating trending topics...');
  // Calculate trending topics
  const trending = calculateTrendingTopics(topics);

  console.log('Data processing complete!');
  return {
    topics,
    categories,
    trending,
    totalThreads: data.metadata.total_threads,
    lastUpdated: data.metadata.last_updated
  };
}

/**
 * Group threads by their manual topics
 */
function groupThreadsByTopic(threads: Thread[]): Record<string, Thread[]> {
  const grouped: Record<string, Thread[]> = {};

  threads.forEach(thread => {
    const topics = thread.relevant_topics || (thread as any).manual_topics || [];
    if (topics && topics.length > 0) {
      topics.forEach((topic: string) => {
        if (!grouped[topic]) {
          grouped[topic] = [];
        }
        grouped[topic].push(thread);
      });
    }
  });

  return grouped;
}

/**
 * Create TopicInfo objects from grouped threads and ensure all 40 topics from taxonomy are included
 */
function createTopicInfoMap(threadsByTopic: Record<string, Thread[]>): Record<string, TopicInfo> {
  const topics: Record<string, TopicInfo> = {};

  // First, process topics that have actual threads
  Object.entries(threadsByTopic).forEach(([topicName, topicThreads]) => {
    const mapping = TOPIC_MAPPINGS[topicName];

    if (!mapping) {
      console.warn(`No mapping found for topic: ${topicName}`);
      return;
    }

    // Sort threads by date (most recent first) - single sort operation
    // Use latest_post_date_iso if available, fall back to tagged_date
    topicThreads.sort((a, b) => {
      const dateA = a.latest_post_date_iso || a.tagged_date;
      const dateB = b.latest_post_date_iso || b.tagged_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    // Calculate monthly trend data
    const monthlyTrend = calculateMonthlyTrend(topicThreads);

    topics[topicName] = {
      name: topicName,
      displayName: mapping.displayName,
      description: mapping.description,
      threadCount: topicThreads.length,
      category: mapping.category,
      threads: topicThreads,
      monthlyTrend
    };
  });

  // Now add all topics from TOPIC_MAPPINGS that don't have threads yet (with 0 threads)
  Object.entries(TOPIC_MAPPINGS).forEach(([topicName, mapping]) => {
    if (!topics[topicName]) {
      topics[topicName] = {
        name: topicName,
        displayName: mapping.displayName,
        description: mapping.description,
        threadCount: 0,
        category: mapping.category,
        threads: [],
        monthlyTrend: []
      };
    }
  });

  return topics;
}

/**
 * Calculate monthly trend data for threads - optimized version
 */
function calculateMonthlyTrend(threads: Thread[]): MonthlyDataPoint[] {
  if (threads.length === 0) return [];
  
  const monthCounts: Record<string, number> = {};

  // Single pass through threads - just count
  for (const thread of threads) {
    const dateStr = thread.latest_post_date_iso || thread.tagged_date;
    const monthKey = getMonthKey(new Date(dateStr));
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
  }

  // Convert to array of data points
  const dataPoints: MonthlyDataPoint[] = [];
  for (const [monthKey, count] of Object.entries(monthCounts)) {
    const [year, month] = monthKey.split('-').map(Number);
    dataPoints.push({
      month: monthKey,
      count,
      date: new Date(year, month - 1, 1)
    });
  }

  // Sort by date
  dataPoints.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Debug: log first topic's data
  if (threads.length > 10 && dataPoints.length > 0) {
    console.log(`Topic has ${threads.length} threads, ${dataPoints.length} months of data`);
  }
  
  return dataPoints;
}

/**
 * Group topics into categories - optimized
 */
function createCategoryGroups(topics: Record<string, TopicInfo>): TopicCategory[] {
  const categoriesMap: Record<string, TopicInfo[]> = {};

  Object.values(topics).forEach(topic => {
    if (!categoriesMap[topic.category]) {
      categoriesMap[topic.category] = [];
    }
    categoriesMap[topic.category].push(topic);
  });

  return Object.entries(categoriesMap).map(([categoryKey, categoryTopics]) => {
    const categoryInfo = CATEGORIES[categoryKey];

    if (!categoryInfo) {
      console.warn(`No category info found for: ${categoryKey}`);
      return null;
    }

    // Single sort operation
    categoryTopics.sort((a, b) => b.threadCount - a.threadCount);

    return {
      name: categoryKey,
      displayName: categoryInfo.displayName,
      description: categoryInfo.description,
      topics: categoryTopics,
      totalThreads: categoryTopics.reduce((sum, topic) => sum + topic.threadCount, 0)
    };
  }).filter(Boolean) as TopicCategory[];
}

/**
 * Calculate trending topics based on recent activity
 */
function calculateTrendingTopics(topics: Record<string, TopicInfo>): TrendingTopic[] {
  const trending: TrendingTopic[] = [];

  Object.values(topics).forEach(topic => {
    const recentData = topic.monthlyTrend.slice(-3); // Last 3 months
    const previousData = topic.monthlyTrend.slice(-6, -3); // Previous 3 months

    const recentActivity = recentData.reduce((sum, d) => sum + d.count, 0);
    const previousActivity = previousData.reduce((sum, d) => sum + d.count, 0);

    const percentageChange = calculatePercentageChange(recentActivity, previousActivity);

    trending.push({
      ...topic,
      percentageChange,
      isGrowing: percentageChange > 0,
      recentActivity
    });
  });

  // Sort by percentage change (descending)
  return sortBy(trending, t => Math.abs(t.percentageChange), 'desc').slice(0, 10);
}

/**
 * Filter threads based on criteria
 */
export function filterThreads(
  threads: Thread[],
  timeRange: string,
  searchQuery?: string
): Thread[] {
  let filtered = [...threads];

  // Apply time filter
  if (timeRange !== 'all') {
    const cutoffDate = getTimeRangeCutoff(timeRange);
    filtered = filtered.filter(thread =>
      new Date(thread.tagged_date) >= cutoffDate
    );
  }

  // Apply search filter
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(thread => {
      const topics = thread.relevant_topics || (thread as any).manual_topics || [];
      return thread.thread_title.toLowerCase().includes(query) ||
        topics.some((topic: string) =>
          TOPIC_MAPPINGS[topic]?.displayName.toLowerCase().includes(query)
        );
    });
  }

  return filtered;
}

/**
 * Get cutoff date for time range filter
 */
function getTimeRangeCutoff(timeRange: string): Date {
  const now = new Date();

  switch (timeRange) {
    case '6months':
      return new Date(now.getFullYear(), now.getMonth() - 6, 1);
    case '1year':
      return new Date(now.getFullYear() - 1, now.getMonth(), 1);
    case '2years':
      return new Date(now.getFullYear() - 2, now.getMonth(), 1);
    default:
      return new Date(0); // Beginning of time
  }
}

/**
 * Mock data for development
 */
function getMockData(): ManualTagsData {
  return {
    metadata: {
      approach: "true_manual_comprehension",
      started: "2025-11-15T14:30:05.665045",
      total_threads: 8,
      tagged_count: 8,
      last_updated: "2025-11-15T15:15:00.000000"
    },
    enhanced_tags: {
      "water-safety-discussion": {
        thread_file: "water-safety-discussion.md",
        thread_title: "Best water filter for NTM patients?",
        thread_url: "https://connect.ntminfo.org/discussion/water-safety-discussion",
        relevant_topics: ["water_safety"],
        topic_count: 1,
        tagged_date: "2025-11-10T10:00:00.000Z"
      },
      "arikayce-hearing-issues": {
        thread_file: "arikayce-hearing-issues.md",
        thread_title: "Arikayce causing hearing problems",
        thread_url: "https://connect.ntminfo.org/discussion/arikayce-hearing-issues",
        relevant_topics: ["arikayce_side_effects", "hearing_issues"],
        topic_count: 2,
        tagged_date: "2025-11-12T14:30:00.000Z"
      },
      "nebulizer-cleaning": {
        thread_file: "nebulizer-cleaning.md",
        thread_title: "How often to clean nebulizer parts?",
        thread_url: "https://connect.ntminfo.org/discussion/nebulizer-cleaning",
        relevant_topics: ["equipment_sterilization", "nebulizers"],
        topic_count: 2,
        tagged_date: "2025-11-08T09:15:00.000Z"
      },
      "exercise-fatigue": {
        thread_file: "exercise-fatigue.md",
        thread_title: "Managing fatigue during treatment",
        thread_url: "https://connect.ntminfo.org/discussion/exercise-fatigue",
        relevant_topics: ["energy_management", "exercise_activity"],
        topic_count: 2,
        tagged_date: "2025-11-05T16:45:00.000Z"
      },
      "travel-tips": {
        thread_file: "travel-tips.md",
        thread_title: "Traveling with NTM - safety tips",
        thread_url: "https://connect.ntminfo.org/discussion/travel-tips",
        relevant_topics: ["travel_precautions"],
        topic_count: 1,
        tagged_date: "2025-11-01T11:20:00.000Z"
      },
      "shower-safety": {
        thread_file: "shower-safety.md",
        thread_title: "Shower safety measures",
        thread_url: "https://connect.ntminfo.org/discussion/shower-safety",
        relevant_topics: ["water_safety"],
        topic_count: 1,
        tagged_date: "2025-10-28T14:10:00.000Z"
      },
      "medication-schedule": {
        thread_file: "medication-schedule.md",
        thread_title: "Managing complex medication schedules",
        thread_url: "https://connect.ntminfo.org/discussion/medication-schedule",
        relevant_topics: ["medication_management"],
        topic_count: 1,
        tagged_date: "2025-10-25T08:30:00.000Z"
      },
      "nutrition-support": {
        thread_file: "nutrition-support.md",
        thread_title: "Nutritional support during treatment",
        thread_url: "https://connect.ntminfo.org/discussion/nutrition-support",
        relevant_topics: ["nutrition_supplements"],
        topic_count: 1,
        tagged_date: "2025-10-20T13:45:00.000Z"
      }
    }
  };
}

/**
 * Load topic tips data for a specific topic
 */
export async function loadTopicTips(topicName: string): Promise<TopicTips | null> {
  try {
    const basePath = getBasePath();
    const dataPath = `${basePath}/data/topic_tips/${topicName}.json`;
    
    console.log('Loading topic tips from', dataPath);

    const response = await fetch(dataPath);
    
    if (!response.ok) {
      console.warn(`No topic tips found for ${topicName}`);
      return null;
    }

    const data = await response.json() as TopicTips;
    console.log('Topic tips loaded successfully:', {
      topic: data.topic_name,
      tipsCount: data.tips.length,
      insightsCount: data.key_insights.length,
      questionsCount: data.common_questions.length
    });

    return data;
  } catch (error) {
    console.error('Error loading topic tips:', error);
    return null;
  }
}

/**
 * Convert thread slug to full forum URL
 */
export function getThreadUrl(threadSlug: string): string {
  return `${EXTERNAL_LINKS.ntmConnectBase}/discussion/${threadSlug}`;
}