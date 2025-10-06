'use client';

import * as React from 'react';
import type { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
}

function getSentimentStyles(sentiment: string): React.CSSProperties {
  switch (sentiment) {
    case 'positive':
      return {
        backgroundColor: 'var(--sentiment-positive-bg)',
        color: 'var(--sentiment-positive-text)',
        borderColor: 'var(--sentiment-positive-border)'
      };
    case 'negative':
      return {
        backgroundColor: 'var(--sentiment-negative-bg)',
        color: 'var(--sentiment-negative-text)',
        borderColor: 'var(--sentiment-negative-border)'
      };
    case 'neutral':
      return {
        backgroundColor: 'var(--sentiment-neutral-bg)',
        color: 'var(--sentiment-neutral-text)',
        borderColor: 'var(--sentiment-neutral-border)'
      };
    default:
      return {
        backgroundColor: 'var(--surface-tertiary)',
        color: 'var(--text-secondary)',
        borderColor: 'var(--border)'
      };
  }
}

function getSentimentEmoji(sentiment: string): string {
  switch (sentiment) {
    case 'positive':
      return '😊';
    case 'negative':
      return '😞';
    case 'neutral':
      return '😐';
    default:
      return '❓';
  }
}

export function PostCard({ post }: PostCardProps) {
  const sentiment = post.sentiment?.sentiment || 'unknown';
  const confidence = post.sentiment?.confidence || 0;
  const text = post.text || 'No text available';
  // Extract a short author identifier from DID (last 8 characters)
  const authorShort = post.author ? post.author.slice(-8) : 'unknown';

  return (
    <div className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      {/* Header with sentiment badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: 'linear-gradient(to bottom right, var(--brand-gradient-from), var(--brand-gradient-to))' }}>
            {authorShort.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
            {authorShort}
          </div>
        </div>
        
        {/* Sentiment badge */}
        {post.sentiment && (
          <div className="px-3 py-1 rounded-full text-xs font-semibold border" style={getSentimentStyles(sentiment)}>
            <span className="mr-1">{getSentimentEmoji(sentiment)}</span>
            {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
          </div>
        )}
      </div>

      {/* Post text */}
      <p className="mb-3 whitespace-pre-wrap break-words" style={{ color: 'var(--text-primary)' }}>
        {text}
      </p>

      {/* Footer with confidence */}
      {post.sentiment && (
        <div className="flex items-center justify-end text-xs pt-2 border-t" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
          <span className="font-medium">
            Confidence: {(confidence * 100).toFixed(1)}%
          </span>
        </div>
      )}

      {/* Probability details */}
      {post.sentiment?.probabilities && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div style={{ color: 'var(--text-secondary)' }}>Positive</div>
              <div className="font-semibold" style={{ color: 'var(--sentiment-positive-accent)' }}>
                {(post.sentiment.probabilities.positive * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div style={{ color: 'var(--text-secondary)' }}>Neutral</div>
              <div className="font-semibold" style={{ color: 'var(--sentiment-neutral-accent)' }}>
                {(post.sentiment.probabilities.neutral * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div style={{ color: 'var(--text-secondary)' }}>Negative</div>
              <div className="font-semibold" style={{ color: 'var(--sentiment-negative-accent)' }}>
                {(post.sentiment.probabilities.negative * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
