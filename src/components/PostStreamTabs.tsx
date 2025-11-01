import { Tabs } from "@base-ui-components/react/tabs";
import { motion } from "framer-motion";
import { Frown, Layers, Meh, Smile } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getTopicColor } from "@/lib/topicColors";
import type { Post, TopicStats } from "@/types/post";
import { PostStream } from "./PostStream";

type SentimentFilter = "all" | "positive" | "negative" | "neutral";

interface PostStreamTabsProps {
  activeSentiment: SentimentFilter;
  onTabChange: (value: string) => void;
  displayPosts: Post[];
  onPostReceived: (post: Post) => void;
  topicStats: TopicStats;
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
}

export function PostStreamTabs({
  activeSentiment,
  onTabChange,
  displayPosts,
  onPostReceived,
  topicStats,
  selectedTopic,
  onTopicChange,
}: PostStreamTabsProps) {
  // Store topicStats in a ref to access latest value without triggering re-renders
  const topicStatsRef = useRef(topicStats);
  topicStatsRef.current = topicStats;

  // Extract available topics from topicStats, sorted by count
  // Update the sorted order every 5 seconds instead of instantly
  const [availableTopics, setAvailableTopics] = useState<string[]>(() => {
    return Object.entries(topicStats)
      .filter(([key]) => key !== "total")
      .sort((a, b) => b[1] - a[1])
      .map(([topic]) => topic);
  });

  useEffect(() => {
    const updateTopics = () => {
      const sorted = Object.entries(topicStatsRef.current)
        .filter(([key]) => key !== "total")
        .sort((a, b) => b[1] - a[1])
        .map(([topic]) => topic);
      setAvailableTopics(sorted);
    };

    // Update instantly for the first 5 seconds
    const instantUpdatesTimeout = setTimeout(() => {
      // After 4 seconds, switch to 5 second intervals
      const interval = setInterval(updateTopics, 5000);
      return () => clearInterval(interval);
    }, 4000);

    // For the first 4 seconds, update on every topicStats change
    const _earlyEffect = () => {
      updateTopics();
    };

    // Set up listener for topicStats changes during first 4 seconds
    const earlyInterval = setInterval(() => {
      updateTopics();
    }, 500); // Check frequently during initial period

    // Clean up early interval after 4 seconds
    const cleanupEarly = setTimeout(() => {
      clearInterval(earlyInterval);
    }, 4000);

    return () => {
      clearTimeout(instantUpdatesTimeout);
      clearInterval(earlyInterval);
      clearTimeout(cleanupEarly);
    };
  }, []); // Empty dependency array - interval runs continuously

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
                <motion.button
                  key={topic}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                  }}
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
                </motion.button>
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
        />
      </Tabs.Panel>
    </Tabs.Root>
  );
}
