'use client';

import * as React from 'react';
import type { SentimentStats } from '@/types/post';

interface SentimentProgressProps {
  stats: SentimentStats;
}

export function SentimentProgress({ stats }: SentimentProgressProps) {
  const total = stats.total || 1; // Avoid division by zero
  const positivePercent = (stats.positive / total) * 100;
  const negativePercent = (stats.negative / total) * 100;
  const neutralPercent = (stats.neutral / total) * 100;

  return (
    <div className="rounded-lg shadow-lg p-6 space-y-6" style={{ backgroundColor: 'var(--surface)' }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Real-time Sentiment Analysis
      </h2>

      <div className="space-y-4">
        {/* Positive Sentiment */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Positive
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--sentiment-positive-accent)' }}>
              {stats.positive} ({positivePercent.toFixed(1)}%)
            </span>
          </div>
          <div className="relative h-4 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--surface-tertiary)' }}>
            <div
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${positivePercent}%`, backgroundColor: 'var(--sentiment-positive-accent)' }}
            />
          </div>
        </div>

        {/* Negative Sentiment */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Negative
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--sentiment-negative-accent)' }}>
              {stats.negative} ({negativePercent.toFixed(1)}%)
            </span>
          </div>
          <div className="relative h-4 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--surface-tertiary)' }}>
            <div
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${negativePercent}%`, backgroundColor: 'var(--sentiment-negative-accent)' }}
            />
          </div>
        </div>

        {/* Neutral Sentiment */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Neutral
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--sentiment-neutral-accent)' }}>
              {stats.neutral} ({neutralPercent.toFixed(1)}%)
            </span>
          </div>
          <div className="relative h-4 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--surface-tertiary)' }}>
            <div
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${neutralPercent}%`, backgroundColor: 'var(--sentiment-neutral-accent)' }}
            />
          </div>
        </div>
      </div>

      {/* Total Count */}
      <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Total Posts Analyzed
          </span>
          <span className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>
            {stats.total}
          </span>
        </div>
      </div>
    </div>
  );
}
