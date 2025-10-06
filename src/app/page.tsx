
'use client';

import * as React from 'react';
import { PostStream } from '@/components/PostStream';
import { SentimentProgress } from '@/components/SentimentProgress';
import type { Post, SentimentStats } from '@/types/post';

const MAX_POSTS = 200; // Keep the last 200 posts for better readability

export default function Home() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [stats, setStats] = React.useState<SentimentStats>({
    positive: 0,
    negative: 0,
    neutral: 0,
    total: 0,
  });

  const handlePostReceived = React.useCallback((post: Post) => {
    setPosts((prevPosts) => {
      const newPosts = [post, ...prevPosts].slice(0, MAX_POSTS);
      
      // Calculate stats from the new posts array
      const newStats = newPosts.reduce(
        (acc, p) => {
          if (p.sentiment) {
            acc[p.sentiment.sentiment]++;
            acc.total++;
          }
          return acc;
        },
        { positive: 0, negative: 0, neutral: 0, total: 0 }
      );
      
      setStats(newStats);
      return newPosts;
    });
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="shadow-md" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">🔍</div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Bluesky Sentiment Analysis
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Real-time sentiment analysis of Bluesky posts using NATS streaming
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Post stream - takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <PostStream posts={posts} onPostReceived={handlePostReceived} />
          </div>

          {/* Sentiment progress - takes up 1 column on large screens */}
          <div className="lg:col-span-1">
            <SentimentProgress stats={stats} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
        <p>
          Built with Next.js, Base UI, NATS, and AI sentiment analysis
        </p>
      </footer>
    </main>
  );
}
