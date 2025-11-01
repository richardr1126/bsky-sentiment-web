"use client";

import { Tooltip } from "@base-ui-components/react/tooltip";
import { motion } from "framer-motion";
import type { SentimentStats } from "@/types/post";

interface SentimentProgressProps {
  stats: SentimentStats;
  onSentimentClick?: (sentiment: "positive" | "negative" | "neutral") => void;
}

export function SentimentProgress({
  stats,
  onSentimentClick,
}: SentimentProgressProps) {
  const total = Math.max(1, stats.total); // prevent division by zero
  const positivePercent = Math.round((stats.positive / total) * 100);
  const negativePercent = Math.round((stats.negative / total) * 100);
  const neutralPercent = Math.round((stats.neutral / total) * 100);

  // Sort sentiments by count
  const sortedSentiments = [
    {
      label: "Positive",
      count: stats.positive,
      percent: positivePercent,
      color: "text-sentiment-positive-accent",
      bg: "bg-sentiment-positive-bg",
      border: "border-sentiment-positive-border",
      dot: "bg-sentiment-positive-accent",
    },
    {
      label: "Neutral",
      count: stats.neutral,
      percent: neutralPercent,
      color: "text-sentiment-neutral-accent",
      bg: "bg-sentiment-neutral-bg",
      border: "border-sentiment-neutral-border",
      dot: "bg-sentiment-neutral-accent",
    },
    {
      label: "Negative",
      count: stats.negative,
      percent: negativePercent,
      color: "text-sentiment-negative-accent",
      bg: "bg-sentiment-negative-bg",
      border: "border-sentiment-negative-border",
      dot: "bg-sentiment-negative-accent",
    },
  ].sort((a, b) => b.count - a.count);

  const mostCommon = sortedSentiments[0].label;

  return (
    <div className="rounded-xl border border-border bg-surface shadow-md overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Sentiment Analysis
            </h2>
            <p className="mt-0.5 text-xs text-text-secondary">
              Sentiment breakdown from live stream
            </p>
          </div>

          <Tooltip.Provider delay={250}>
            <Tooltip.Root>
              <Tooltip.Trigger
                className="h-6 w-6 rounded-full border border-border bg-surface-secondary text-xs font-medium text-text-secondary hover:bg-surface-tertiary transition-colors"
                aria-label="About these metrics"
              >
                i
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Positioner side="bottom" align="end" sideOffset={8}>
                  <Tooltip.Popup className="max-w-64 rounded-md border border-border bg-surface-secondary px-3 py-2 text-xs text-text-primary shadow-lg">
                    Values are computed from the most recent posts in the live
                    stream. Percentages reflect the share within the current
                    window.
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>

      {/* Sentiment Pills */}
      <div className="p-4 space-y-3">
        {sortedSentiments.map((s) => (
          <motion.div
            key={s.label}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              layout: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              y: { duration: 0.3 },
            }}
            className="space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  onSentimentClick?.(
                    s.label.toLowerCase() as
                      | "positive"
                      | "negative"
                      | "neutral",
                  )
                }
                disabled={!onSentimentClick}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${s.border} ${s.bg} ${onSentimentClick ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                <span className="text-xs font-medium text-text-primary">
                  {s.label}
                </span>
              </button>
              <div className="flex items-baseline gap-2">
                <span className={`text-lg font-bold ${s.color}`}>
                  {s.percent}%
                </span>
                <span className="text-xs font-semibold text-text-tertiary">
                  {s.count}
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-surface-tertiary overflow-hidden rounded-full">
              <div
                className={`h-full ${s.dot} transition-all duration-500`}
                style={{ width: `${s.percent}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="border-t border-border px-4 py-3 grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="text-xs text-text-secondary">Total</div>
          <div className="text-xl font-bold text-brand-primary">
            {stats.total}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-text-secondary">Leading</div>
          <div className="text-sm font-semibold text-text-primary">
            {mostCommon}
          </div>
        </div>
      </div>
    </div>
  );
}
