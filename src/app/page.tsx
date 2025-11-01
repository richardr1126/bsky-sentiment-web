"use client";

import { useCallback, useState } from "react";
import { PostStreamTabs } from "@/components/PostStreamTabs";
import { SentimentProgress } from "@/components/SentimentProgress";
import { TopicDistribution } from "@/components/TopicDistribution";
import type { Post, SentimentStats, TopicStats } from "@/types/post";

// Lightweight post for stats tracking - only keeps essential data
interface LightPost {
  uri: string;
  sentiment?: { sentiment: "positive" | "negative" | "neutral" };
  topics?: { topics: string[] };
}

const MAX_DISPLAY_POSTS = 25; // Full posts shown in UI
const MAX_STATS_POSTS = 1000; // Lightweight posts for stats

const INITIAL_SENTIMENT_STATS = {
  positive: 0,
  negative: 0,
  neutral: 0,
  total: 0,
};

const INITIAL_TOPIC_STATS = {
  total: 0,
};

type SentimentFilter = "all" | "positive" | "negative" | "neutral";

export default function Home() {
  const [displayPosts, setDisplayPosts] = useState<Post[]>([]);
  const [_statsPosts, setStatsPosts] = useState<LightPost[]>([]);
  const [activeSentiment, setActiveSentiment] =
    useState<SentimentFilter>("all");
  const [stats, setStats] = useState<SentimentStats>(INITIAL_SENTIMENT_STATS);
  const [topicStats, setTopicStats] = useState<TopicStats>(INITIAL_TOPIC_STATS);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  // Handle sentiment tab change
  const handleTabChange = useCallback(
    (value: string) => {
      setActiveSentiment(value as SentimentFilter);

      // Only reset all data if no topic filter is active
      if (selectedTopic === "all") {
        setStats(INITIAL_SENTIMENT_STATS);
        setTopicStats(INITIAL_TOPIC_STATS);
        setDisplayPosts([]);
        setStatsPosts([]);
      }
    },
    [selectedTopic],
  );

  // Handle topic filter change - only clear when going back to "all"
  const handleTopicChange = useCallback(
    (topic: string) => {
      const wasFiltered = selectedTopic !== "all";
      setSelectedTopic(topic);

      // Only clear all data when going back to "all" from a filtered state
      if (topic === "all" && wasFiltered) {
        setStats(INITIAL_SENTIMENT_STATS);
        setTopicStats(INITIAL_TOPIC_STATS);
        setDisplayPosts([]);
        setStatsPosts([]);
      }
    },
    [selectedTopic],
  );

  const handlePostReceived = useCallback((post: Post) => {
    // Update lightweight stats posts
    setStatsPosts((prevPosts) => {
      // Check for duplicate
      if (prevPosts.some((p) => p.uri === post.uri)) {
        return prevPosts;
      }

      const lightPost: LightPost = {
        uri: post.uri,
        sentiment: post.sentiment
          ? { sentiment: post.sentiment.sentiment }
          : undefined,
        topics: post.topics ? { topics: post.topics.topics } : undefined,
      };

      const newStatsPosts = [lightPost, ...prevPosts].slice(0, MAX_STATS_POSTS);

      // Calculate sentiment stats
      const newStats = newStatsPosts.reduce(
        (acc, p) => {
          if (p.sentiment) {
            acc[p.sentiment.sentiment]++;
            acc.total++;
          }
          return acc;
        },
        { ...INITIAL_SENTIMENT_STATS },
      );
      setStats(newStats);

      // Calculate topic stats
      const newTopicStats: TopicStats = { total: 0 };
      for (const p of newStatsPosts) {
        if (p.topics?.topics && p.topics.topics.length > 0) {
          for (const topic of p.topics.topics) {
            newTopicStats[topic] = (newTopicStats[topic] || 0) + 1;
          }
          newTopicStats.total++;
        }
      }
      setTopicStats(newTopicStats);

      return newStatsPosts;
    });

    // Update display posts with full content (server-side filtered)
    setDisplayPosts((prevPosts) => {
      // Check for duplicate
      if (prevPosts.some((p) => p.uri === post.uri)) {
        return prevPosts;
      }
      return [post, ...prevPosts].slice(0, MAX_DISPLAY_POSTS);
    });
  }, []);

  return (
    <main className="flex flex-col bg-background">
      {/* Main content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Stats cards */}
          <div className="lg:col-span-1 space-y-6">
            {(() => {
              const isFiltered =
                activeSentiment !== "all" || selectedTopic !== "all";
              const blurClass = isFiltered
                ? "opacity-50 blur-sm pointer-events-none"
                : "opacity-100 blur-0";
              return (
                <>
                  <div className={`transition-all duration-300 ${blurClass}`}>
                    <SentimentProgress
                      stats={stats}
                      onSentimentClick={(sentiment) => {
                        setActiveSentiment(sentiment);
                      }}
                    />
                  </div>
                  <div className={`transition-all duration-300 ${blurClass}`}>
                    <TopicDistribution
                      stats={topicStats}
                      onTopicClick={(topic) => {
                        handleTopicChange(topic);
                      }}
                    />
                  </div>
                </>
              );
            })()}
          </div>

          {/* Post stream - takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <PostStreamTabs
              activeSentiment={activeSentiment}
              onTabChange={handleTabChange}
              displayPosts={displayPosts}
              onPostReceived={handlePostReceived}
              topicStats={topicStats}
              selectedTopic={selectedTopic}
              onTopicChange={handleTopicChange}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
