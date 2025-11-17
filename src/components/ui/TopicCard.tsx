import { Card, Badge } from '@/components/ui/basics';
import { MiniTrendChart } from '@/components/charts/TimeSeriesChart';
import type { TopicInfo, TopicCardProps } from '@/lib/types';
import { formatNumber, getRelativeTime } from '@/lib/utils';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

export function TopicCard({ topic, showTrend = false, onClick }: TopicCardProps) {
  const recentThreads = topic.threads.slice(0, 3);
  const latestThread = topic.threads[0];

  // Calculate trend from last 3 months vs previous 3 months
  const recentData = topic.monthlyTrend.slice(-3);
  const previousData = topic.monthlyTrend.slice(-6, -3);
  const recentCount = recentData.reduce((sum, d) => sum + d.count, 0);
  const previousCount = previousData.reduce((sum, d) => sum + d.count, 0);
  const trendPercentage = previousCount > 0
    ? Math.round(((recentCount - previousCount) / previousCount) * 100)
    : 0;

  return (
    <Card hover onClick={onClick} className="h-full">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{topic.displayName}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {topic.description}
          </p>
        </div>

        {showTrend && topic.monthlyTrend.length > 0 && (
          <div className="ml-4 flex-shrink-0">
            <MiniTrendChart
              data={topic.monthlyTrend}
              width={80}
              height={30}
              color={trendPercentage >= 0 ? '#10b981' : '#ef4444'}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span>{formatNumber(topic.threadCount)} discussions</span>
        {latestThread && (
          <span>Updated {getRelativeTime(latestThread.latest_post_date_iso || latestThread.tagged_date)}</span>
        )}
      </div>

      {showTrend && (
        <div className="flex items-center gap-1 text-sm">
          {trendPercentage > 0 ? (
            <>
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
              <span className="text-green-600">+{trendPercentage}%</span>
            </>
          ) : trendPercentage < 0 ? (
            <>
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
              <span className="text-red-600">{trendPercentage}%</span>
            </>
          ) : (
            <span className="text-gray-500">No change</span>
          )}
          <span className="text-gray-500">vs previous 3 months</span>
        </div>
      )}

      {!showTrend && recentThreads.length > 0 && (
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs font-medium text-gray-700 mb-2">Recent discussions:</p>
          <div className="space-y-1">
            {recentThreads.map((thread, index) => (
              <div key={index} className="text-xs text-gray-600 truncate">
                • {thread.thread_title}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

interface CompactTopicCardProps {
  topic: TopicInfo;
  onClick: () => void;
}

export function CompactTopicCard({ topic, onClick }: CompactTopicCardProps) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{topic.displayName}</h4>
        <p className="text-sm text-gray-500 truncate">{topic.description}</p>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <Badge variant="secondary" size="sm">
          {formatNumber(topic.threadCount)}
        </Badge>
        <MiniTrendChart data={topic.monthlyTrend} width={60} height={20} />
      </div>
    </div>
  );
}