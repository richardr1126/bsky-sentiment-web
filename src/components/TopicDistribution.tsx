"use client";

import { Tooltip } from "@base-ui-components/react/tooltip";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { getTopicColor } from "@/lib/topicColors";
import type { TopicStats } from "@/types/post";

interface TopicDistributionProps {
  stats: TopicStats;
  onTopicClick?: (topic: string) => void;
}

export function TopicDistribution({
  stats,
  onTopicClick,
}: TopicDistributionProps) {
  const [showAll, setShowAll] = useState(false);
  const total = Math.max(1, stats.total); // Prevent division by zero

  // Get ALL topics excluding 'total', sorted by count
  const allTopics = Object.entries(stats)
    .filter(([key]) => key !== "total")
    .map(([topic, count]) => ({
      label: topic.replace(/_/g, " ").replace(/&/g, "and"),
      rawLabel: topic,
      count,
      percent: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  // Get all topic names for consistent color mapping
  const allTopicNames = allTopics.map((t) => t.rawLabel);

  // Split into top 5 and remaining
  const topTopics = allTopics.slice(0, 5);
  const remainingTopics = allTopics.slice(5);

  return (
    <div className="rounded-xl border border-border bg-surface shadow-md overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Topic Analysis
            </h2>
            <p className="mt-0.5 text-xs text-text-secondary">
              Top topics breakdown from live stream
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
                    Topics are identified using multi-label classification. A
                    post can have multiple topics. Showing top{" "}
                    {topTopics.length} topics
                    {remainingTopics.length > 0 &&
                      ` with ${remainingTopics.length} more available`}
                    .
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>

      {/* Topic Pills */}
      <div className="p-4 space-y-3">
        {allTopics.length === 0 ? (
          <div className="text-center py-8 text-text-tertiary text-sm">
            No topics classified yet
          </div>
        ) : (
          <>
            {/* Top 5 Topics - Always Visible */}
            {topTopics.map((t) => {
              const colorScheme = getTopicColor(t.rawLabel, allTopicNames);
              return (
                <motion.div
                  key={t.rawLabel}
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
                      onClick={() => onTopicClick?.(t.rawLabel)}
                      disabled={!onTopicClick}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${colorScheme.border} ${colorScheme.bg} ${onTopicClick ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${colorScheme.dot}`}
                      />
                      <span className="text-xs font-medium text-text-primary capitalize">
                        {t.label}
                      </span>
                    </button>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-lg font-bold ${colorScheme.color}`}
                      >
                        {t.percent}%
                      </span>
                      <span className="text-xs font-semibold text-text-tertiary">
                        {t.count}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-surface-tertiary overflow-hidden rounded-full">
                    <div
                      className={`h-full ${colorScheme.dot} transition-all duration-500`}
                      style={{ width: `${t.percent}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}

            {/* Remaining Topics - Animated Expansion */}
            {remainingTopics.length > 0 && (
              <div
                className={`space-y-3 overflow-hidden transition-all duration-300 ease-in-out ${
                  showAll ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {remainingTopics.map((t) => {
                  const colorScheme = getTopicColor(t.rawLabel, allTopicNames);
                  return (
                    <motion.div
                      key={t.rawLabel}
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
                          onClick={() => onTopicClick?.(t.rawLabel)}
                          disabled={!onTopicClick}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${colorScheme.border} ${colorScheme.bg} ${onTopicClick ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"}`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${colorScheme.dot}`}
                          />
                          <span className="text-xs font-medium text-text-primary capitalize">
                            {t.label}
                          </span>
                        </button>
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`text-lg font-bold ${colorScheme.color}`}
                          >
                            {t.percent}%
                          </span>
                          <span className="text-xs font-semibold text-text-tertiary">
                            {t.count}
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-surface-tertiary overflow-hidden rounded-full">
                        <div
                          className={`h-full ${colorScheme.dot} transition-all duration-500`}
                          style={{ width: `${t.percent}%` }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Show More/Less Button */}
            {remainingTopics.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="w-full flex items-center justify-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5 transition-transform" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5 transition-transform" />
                    Show {remainingTopics.length} More
                  </>
                )}
              </button>
            )}
          </>
        )}
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
          <div className="text-sm font-semibold text-text-primary capitalize">
            {allTopics[0]?.label || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}
