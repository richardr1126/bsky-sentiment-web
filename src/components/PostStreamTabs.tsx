import { Tabs } from "@base-ui-components/react/tabs";
import { Frown, Layers, Meh, Smile } from "lucide-react";
import { useCallback, useMemo } from "react";
import { getTopicColor } from "@/lib/topicColors";
import type { Post, TopicStats } from "@/types/post";
import { PostStream } from "./PostStream";

type SentimentFilter = "all" | "positive" | "negative" | "neutral";

interface PostStreamTabsProps {
  activeSentiment: SentimentFilter;
  onTabChange: (value: string) => void;
  displayPosts: Post[];
  onPostReceived: (post: Post) => void;
  duplicateCount: number;
  topicStats: TopicStats;
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
}

export function PostStreamTabs({
  activeSentiment,
  onTabChange,
  displayPosts,
  onPostReceived,
  duplicateCount,
  topicStats,
  selectedTopic,
  onTopicChange,
}: PostStreamTabsProps) {
  // Extract available topics from topicStats, sorted by count (same as TopicDistribution)
  const availableTopics = useMemo(() => {
    return Object.entries(topicStats)
      .filter(([key]) => key !== "total")
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .map(([topic]) => topic);
  }, [topicStats]);

  const handleTopicChange = useCallback(
    (topic: string) => {
      onTopicChange(topic);
    },
    [onTopicChange],
  );

  return (
    <Tabs.Root value={activeSentiment} onValueChange={onTabChange}>
      {/* Sentiment Tab List */}
      <Tabs.List className="flex gap-2 mb-4 p-1 rounded-lg border border-border bg-surface">
        <Tabs.Tab
          value="all"
          className={`flex-1 px-2 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors data-[selected]:shadow-sm flex items-center justify-center gap-2 ${
            activeSentiment === "all"
              ? "bg-brand-primary text-white"
              : "bg-transparent text-text-secondary hover:bg-surface-secondary"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span className="hidden sm:inline">All Sentiments</span>
        </Tabs.Tab>
        <Tabs.Tab
          value="positive"
          className={`flex-1 px-2 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors data-[selected]:shadow-sm flex items-center justify-center gap-2 ${
            activeSentiment === "positive"
              ? "bg-sentiment-positive-accent text-white"
              : "bg-transparent text-text-secondary hover:bg-surface-secondary"
          }`}
        >
          <Smile className="h-4 w-4" />
          <span className="hidden sm:inline">Positive</span>
        </Tabs.Tab>
        <Tabs.Tab
          value="negative"
          className={`flex-1 px-2 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors data-[selected]:shadow-sm flex items-center justify-center gap-2 ${
            activeSentiment === "negative"
              ? "bg-sentiment-negative-accent text-white"
              : "bg-transparent text-text-secondary hover:bg-surface-secondary"
          }`}
        >
          <Frown className="h-4 w-4" />
          <span className="hidden sm:inline">Negative</span>
        </Tabs.Tab>
        <Tabs.Tab
          value="neutral"
          className={`flex-1 px-2 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors data-[selected]:shadow-sm flex items-center justify-center gap-2 ${
            activeSentiment === "neutral"
              ? "bg-sentiment-neutral-accent text-white"
              : "bg-transparent text-text-secondary hover:bg-surface-secondary"
          }`}
        >
          <Meh className="h-4 w-4" />
          <span className="hidden sm:inline">Neutral</span>
        </Tabs.Tab>
      </Tabs.List>

      {/* Topic Filter */}
      {availableTopics.length > 0 && (
        <div className="mb-4 p-3 rounded-lg border border-border bg-surface">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleTopicChange("all")}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                selectedTopic === "all"
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-surface-secondary text-text-secondary hover:bg-surface-tertiary border-border"
              }`}
            >
              All Topics
            </button>
            {availableTopics.map((topic) => {
              const colorScheme = getTopicColor(topic, availableTopics);
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleTopicChange(topic)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors ${
                    isSelected
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "bg-surface-secondary text-text-secondary hover:bg-surface-tertiary border-border"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${colorScheme.dot}`}
                  />
                  <span className="text-xs font-medium capitalize">
                    {topic.replace(/_/g, " ").replace(/&/g, "and")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Panels - Single panel for all tabs since PostStream handles the filtering */}
      <Tabs.Panel value={activeSentiment}>
        <PostStream
          posts={displayPosts}
          onPostReceived={onPostReceived}
          sentimentFilter={activeSentiment}
          topicFilter={selectedTopic}
          duplicateCount={duplicateCount}
        />
      </Tabs.Panel>
    </Tabs.Root>
  );
}
