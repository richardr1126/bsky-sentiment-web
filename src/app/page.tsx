"use client";

import { useCallback, useRef, useState } from "react";
import { Footer } from "@/components/Footer";
import { PostStreamTabs } from "@/components/PostStreamTabs";
import { SentimentProgress } from "@/components/SentimentProgress";
import type { Post, SentimentStats } from "@/types/post";

const MAX_DISPLAY_POSTS = 25; // Limit visible posts for better performance
const MAX_STATS_POSTS = 1000; // Keep more posts for accurate sentiment analysis

type SentimentFilter = "all" | "positive" | "negative" | "neutral";

export default function Home() {
  const [displayPosts, setDisplayPosts] = useState<Post[]>([]);
  const [_allPosts, setAllPosts] = useState<Post[]>([]);
  const [activeSentiment, setActiveSentiment] =
    useState<SentimentFilter>("all");
  const [stats, setStats] = useState<SentimentStats>({
    positive: 0,
    negative: 0,
    neutral: 0,
    total: 0,
  });
  const [duplicateCount, setDuplicateCount] = useState(0);

  // Track seen post URIs to prevent duplicates
  const seenUrisRef = useRef<Set<string>>(new Set());

  // Reset stats when switching tabs
  const handleTabChange = useCallback((value: string) => {
    setActiveSentiment(value as SentimentFilter);
    // Clear stats when switching tabs
    setStats({
      positive: 0,
      negative: 0,
      neutral: 0,
      total: 0,
    });
    // Clear all posts to start fresh
    setAllPosts([]);
    setDisplayPosts([]);
    // Reset duplicate tracking
    seenUrisRef.current.clear();
    setDuplicateCount(0);
  }, []);

  const handlePostReceived = useCallback(
    (post: Post) => {
      // Check for duplicate post
      if (seenUrisRef.current.has(post.uri)) {
        setDuplicateCount((prev) => prev + 1);
        return; // Skip duplicate posts
      }

      // Add to seen set
      seenUrisRef.current.add(post.uri);

      setAllPosts((prevPosts) => {
        const newAllPosts = [post, ...prevPosts].slice(0, MAX_STATS_POSTS);

        // Only calculate stats when on "all" tab
        if (activeSentiment === "all") {
          const newStats = newAllPosts.reduce(
            (acc, p) => {
              if (p.sentiment) {
                acc[p.sentiment.sentiment]++;
                acc.total++;
              }
              return acc;
            },
            { positive: 0, negative: 0, neutral: 0, total: 0 },
          );

          setStats(newStats);
        }

        // Update display posts separately (smaller dataset)
        setDisplayPosts(newAllPosts.slice(0, MAX_DISPLAY_POSTS));

        return newAllPosts;
      });
    },
    [activeSentiment],
  );

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Main content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sentiment progress - takes up 1 column on large screens */}
          <div className="lg:col-span-1">
            <div
              className={`transition-all duration-300 ${
                activeSentiment !== "all"
                  ? "opacity-90 blur-xs pointer-events-none"
                  : "opacity-100 blur-0"
              }`}
            >
              <SentimentProgress stats={stats} />
            </div>
          </div>

          {/* Post stream - takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <PostStreamTabs
              activeSentiment={activeSentiment}
              onTabChange={handleTabChange}
              displayPosts={displayPosts}
              onPostReceived={handlePostReceived}
              duplicateCount={duplicateCount}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
