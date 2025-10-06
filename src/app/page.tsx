"use client";

import { Tabs } from "@base-ui-components/react/tabs";
import { Frown, Layers, Meh, Smile } from "lucide-react";
import * as React from "react";
import { Footer } from "@/components/Footer";
import { PostStream } from "@/components/PostStream";
import { SentimentProgress } from "@/components/SentimentProgress";
import type { Post, SentimentStats } from "@/types/post";

const MAX_DISPLAY_POSTS = 25; // Limit visible posts for better performance
const MAX_STATS_POSTS = 1000; // Keep more posts for accurate sentiment analysis

type SentimentFilter = "all" | "positive" | "negative" | "neutral";

export default function Home() {
  const [displayPosts, setDisplayPosts] = React.useState<Post[]>([]);
  const [_allPosts, setAllPosts] = React.useState<Post[]>([]);
  const [activeSentiment, setActiveSentiment] =
    React.useState<SentimentFilter>("all");
  const [stats, setStats] = React.useState<SentimentStats>({
    positive: 0,
    negative: 0,
    neutral: 0,
    total: 0,
  });

  // Reset stats when switching tabs
  const handleTabChange = React.useCallback((value: string) => {
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
  }, []);

  const handlePostReceived = React.useCallback(
    (post: Post) => {
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
            <Tabs.Root value={activeSentiment} onValueChange={handleTabChange}>
              {/* Tab List */}
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
                  <span className="hidden sm:inline">All Posts</span>
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

              {/* Tab Panels - Single panel for all tabs since PostStream handles the filtering */}
              <Tabs.Panel value={activeSentiment}>
                <PostStream
                  posts={displayPosts}
                  onPostReceived={handlePostReceived}
                  sentimentFilter={activeSentiment}
                />
              </Tabs.Panel>
            </Tabs.Root>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
