import { TopicPageClient } from '@/components/pages/TopicPageClient';
import { TOPIC_MAPPINGS } from '@/lib/constants';

export async function generateStaticParams() {
  return Object.keys(TOPIC_MAPPINGS).map((topicName) => ({
    topicName,
  }));
}

export default async function TopicPage({ 
  params 
}: { 
  params: Promise<{ topicName: string }> 
}) {
  const { topicName } = await params;
  return <TopicPageClient topicName={topicName} />;
}
