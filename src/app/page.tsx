"use client";

import { useCallback, useRef, useState } from "react";
import { PostStreamTabs } from "@/components/PostStreamTabs";
import { SentimentProgress } from "@/components/SentimentProgress";
import { TopicDistribution } from "@/components/TopicDistribution";
import type { Post, SentimentStats, TopicStats } from "@/types/post";

const MAX_DISPLAY_POSTS = 25; // Limit visible posts for better performance
const MAX_STATS_POSTS = 1000; // Keep more posts for accurate sentiment analysis

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
  const [_allPosts, setAllPosts] = useState<Post[]>([]);
  const [activeSentiment, setActiveSentiment] =
    useState<SentimentFilter>("all");
  const [stats, setStats] = useState<SentimentStats>(INITIAL_SENTIMENT_STATS);
  const [topicStats, setTopicStats] = useState<TopicStats>(INITIAL_TOPIC_STATS);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  // Track seen post URIs to prevent duplicates
  const seenUrisRef = useRef<Set<string>>(new Set());

  // Handle sentiment tab change
  const handleTabChange = useCallback(
    (value: string) => {
      setActiveSentiment(value as SentimentFilter);

      // Always clear display posts to show new filtered results
      setDisplayPosts([]);

      // Only reset all data if no topic filter is active
      if (selectedTopic === "all") {
        setStats(INITIAL_SENTIMENT_STATS);
        setTopicStats(INITIAL_TOPIC_STATS);
        setAllPosts([]);
        seenUrisRef.current.clear();
        setDuplicateCount(0);
      }
    },
    [selectedTopic],
  );

  // Handle topic filter change - only clear when going back to "all"
  const handleTopicChange = useCallback(
    (topic: string) => {
      const wasFiltered = selectedTopic !== "all";
      setSelectedTopic(topic);

      // Always clear display posts when changing topic
      setDisplayPosts([]);

      // Only clear all data when going back to "all" from a filtered state
      if (topic === "all" && wasFiltered) {
        setStats(INITIAL_SENTIMENT_STATS);
        setTopicStats(INITIAL_TOPIC_STATS);
        setAllPosts([]);
        seenUrisRef.current.clear();
        setDuplicateCount(0);
      }
    },
    [selectedTopic],
  );

  const handlePostReceived = useCallback((post: Post) => {
    // Check for duplicate post
    if (seenUrisRef.current.has(post.uri)) {
      setDuplicateCount((prev) => prev + 1);
      return; // Skip duplicate posts
    }

    // Add to seen set
    seenUrisRef.current.add(post.uri);

    setAllPosts((prevPosts) => {
      const newAllPosts = [post, ...prevPosts].slice(0, MAX_STATS_POSTS);

      // Calculate sentiment stats from all posts
      const newStats = newAllPosts.reduce(
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

      // Calculate topic stats from all posts
      const newTopicStats: TopicStats = { total: 0 };
      for (const p of newAllPosts) {
        if (p.topics?.topics && p.topics.topics.length > 0) {
          for (const topic of p.topics.topics) {
            newTopicStats[topic] = (newTopicStats[topic] || 0) + 1;
          }
          newTopicStats.total++;
        }
      }
      setTopicStats(newTopicStats);

      return newAllPosts;
    });

    // Update display posts with server-side filtered results
    setDisplayPosts((prevPosts) =>
      [post, ...prevPosts].slice(0, MAX_DISPLAY_POSTS),
    );
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
                        setDisplayPosts([]);
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
              duplicateCount={duplicateCount}
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
