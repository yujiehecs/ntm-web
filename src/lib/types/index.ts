// Core data types for the NTM Community Insights platform

export interface Thread {
  thread_file: string;
  thread_title: string;
  thread_url: string;
  relevant_topics: string[];
  topic_count: number;
  tagged_date: string;
  original_post_date?: string;
  original_post_date_iso?: string;
  latest_post_date?: string;
  latest_post_date_iso?: string;
  post_count?: number;
  user_count?: number;
  method?: string;
  last_updated?: string;
  reply_count?: number;
}

export interface ThreadsMetadata {
  approach: string;
  started: string;
  total_threads: number;  // Changed from totalThreads
  tagged_count: number;   // Changed from taggedCount
  last_updated: string;   // Changed from lastUpdated
  conservative_corrections?: number;
  correction_method?: string;
  last_corrected?: string;
}

export interface ManualTagsData {
  metadata: ThreadsMetadata;
  manual_tags?: Record<string, Thread>;
  enhanced_tags?: Record<string, Thread>;
}

export interface TopicInfo {
  name: string;
  displayName: string;
  description?: string;
  threadCount: number;
  category: string;
  threads: Thread[];
  monthlyTrend: MonthlyDataPoint[];
}

export interface MonthlyDataPoint {
  month: string; // YYYY-MM format
  count: number;
  date: Date;
}

export interface TopicCategory {
  name: string;
  displayName: string;
  description: string;
  topics: TopicInfo[];
  totalThreads: number;
}

export interface FilterOptions {
  timeRange: 'all' | '6months' | '1year' | '2years';
  sortBy: 'latest' | 'oldest' | 'mostActive' | 'alphabetical';
  searchQuery: string;
}

export interface TrendingTopic extends TopicInfo {
  percentageChange: number;
  isGrowing: boolean;
  recentActivity: number;
}

// UI Component Props
export interface TopicCardProps {
  topic: TopicInfo;
  showTrend?: boolean;
  onClick?: () => void;
}

export interface CategorySectionProps {
  category: TopicCategory;
  expanded?: boolean;
  onToggle?: () => void;
}

export interface TimeSeriesChartProps {
  data: MonthlyDataPoint[];
  title?: string;
  height?: number;
}

export interface ThreadListProps {
  threads: Thread[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  isLoading?: boolean;
}

// Data processing types
export interface ProcessedData {
  topics: Record<string, TopicInfo>;
  categories: TopicCategory[];
  trending: TrendingTopic[];
  totalThreads: number;
  lastUpdated: string;
}

export type ViewMode = 'dashboard' | 'topic' | 'search';

export interface AppState {
  currentView: ViewMode;
  selectedTopic?: string;
  searchQuery: string;
  filters: FilterOptions;
}

// Topic Tips types
export interface Tip {
  tip: string;
  cited_threads: string[];
  source_type: 'expert' | 'expert_validated' | 'patient_experience' | 'patient_validated' | 'patient_wisdom' | 'research_evidence' | 'practical_guidance' | 'community_debate';
  priority: 'critical' | 'high' | 'medium' | 'low';
  notes: string;
}

export interface CommonQuestion {
  question: string;
  answer: string;
}

export interface TopicTips {
  topic_name: string;
  category: string;
  threads_reviewed: number;
  threads_total: number;
  thread_list: string[];
  tips: Tip[];
  key_insights: string[];
  common_questions: CommonQuestion[];
}

export interface TopicTipsIndex {
  metadata: {
    project: string;
    created: string;
    source_file: string;
    total_threads_in_source: number;
    methodology: string;
    quality_standards: string;
  };
  topics: Array<{
    topic_name: string;
    category: string;
    status: string;
    tips_count: number;
    threads_analyzed: number;
    threads_total: number;
    completed_date: string;
    file: string;
  }>;
}