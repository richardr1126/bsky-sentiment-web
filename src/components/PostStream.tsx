'use client';

import * as React from 'react';
import { PostCard } from './PostCard';
import type { Post } from '@/types/post';

interface PostStreamProps {
  posts: Post[];
  onPostReceived: (post: Post) => void;
}

export function PostStream({ posts, onPostReceived }: PostStreamProps) {
  const [isConnected, setIsConnected] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isPaused, setIsPaused] = React.useState(false);
  const [pendingPostCount, setPendingPostCount] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const pendingPostsRef = React.useRef<Post[]>([]);

  // Handle scroll to pause/resume
  React.useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop } = scrollElement;
      // If user scrolled down more than 100px, pause updates
      if (scrollTop > 100 && !isPaused) {
        setIsPaused(true);
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [isPaused]);

  // Handle incoming posts - either add immediately or queue them
  const handleIncomingPost = React.useCallback((post: Post) => {
    if (isPaused) {
      pendingPostsRef.current.push(post);
      setPendingPostCount(prev => prev + 1);
    } else {
      onPostReceived(post);
    }
  }, [isPaused, onPostReceived]);

  // Resume live updates
  const handleResume = React.useCallback(() => {
    // Add all pending posts
    pendingPostsRef.current.forEach(post => onPostReceived(post));
    pendingPostsRef.current = [];
    setPendingPostCount(0);
    setIsPaused(false);
    
    // Scroll back to top
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [onPostReceived]);

  React.useEffect(() => {
    let eventSource: EventSource | null = null;

    const connectToStream = () => {
      try {
        eventSource = new EventSource('/api/stream');
        
        eventSource.onopen = () => {
          console.log('Connected to stream');
          setIsConnected(true);
          setError(null);
        };

        eventSource.onmessage = (event) => {
          try {
            const post = JSON.parse(event.data) as Post;
            handleIncomingPost(post);
          } catch (parseError) {
            console.error('Error parsing post:', parseError);
          }
        };

        eventSource.onerror = (err) => {
          console.error('EventSource error:', err);
          setIsConnected(false);
          setError('Connection lost. Reconnecting...');
          
          if (eventSource) {
            eventSource.close();
          }
          
          // Reconnect after 3 seconds
          setTimeout(connectToStream, 3000);
        };
      } catch (err) {
        console.error('Error connecting to stream:', err);
        setError('Failed to connect to stream');
      }
    };

    connectToStream();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [handleIncomingPost]);

  return (
    <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: 'var(--surface)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Live Post Stream
        </h2>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'animate-pulse' : ''
            }`}
            style={{ backgroundColor: isConnected ? 'var(--status-success)' : 'var(--status-error)' }}
          />
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Resume button when paused */}
      {isPaused && pendingPostCount > 0 && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleResume}
            className="w-full px-4 py-3 text-white font-medium rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center space-x-2 group"
            style={{ backgroundColor: 'var(--brand-primary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-primary)'}
          >
            <span>↑</span>
            <span>
              {pendingPostCount} new post{pendingPostCount !== 1 ? 's' : ''} available
            </span>
            <span className="text-xs opacity-80 group-hover:opacity-100">• Click to resume</span>
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 border rounded-lg" style={{ backgroundColor: 'var(--sentiment-negative-bg)', borderColor: 'var(--sentiment-negative-border)' }}>
          <p className="text-sm" style={{ color: 'var(--sentiment-negative-text)' }}>{error}</p>
        </div>
      )}

      {/* Posts container */}
      <div
        ref={scrollRef}
        className="space-y-4 h-[600px] overflow-y-auto pr-2 scrollbar-thin"
      >
        {posts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center" style={{ color: 'var(--text-secondary)' }}>
              <div className="text-4xl mb-2">📡</div>
              <p>Waiting for posts...</p>
            </div>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.uri} post={post} />
          ))
        )}
      </div>

      {/* Post count */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
          Showing {posts.length} recent post{posts.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
