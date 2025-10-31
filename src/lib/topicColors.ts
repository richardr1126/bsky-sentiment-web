// Shared color palette for topics (cycling through colors)
export const topicColors = [
  {
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  {
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    dot: "bg-purple-500",
  },
  {
    color: "text-pink-500",
    bg: "bg-pink-50 dark:bg-pink-950/30",
    border: "border-pink-200 dark:border-pink-800",
    dot: "bg-pink-500",
  },
  {
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  {
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  {
    color: "text-cyan-500",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    border: "border-cyan-200 dark:border-cyan-800",
    dot: "bg-cyan-500",
  },
  {
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-200 dark:border-rose-800",
    dot: "bg-rose-500",
  },
  {
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "border-indigo-200 dark:border-indigo-800",
    dot: "bg-indigo-500",
  },
];

/**
 * Get a consistent color scheme for a topic based on its name
 * This ensures the same topic always gets the same color across components
 */
export function getTopicColor(topic: string, allTopics: string[]) {
  const sortedTopics = [...allTopics].sort();
  const index = sortedTopics.indexOf(topic);
  return topicColors[index % topicColors.length];
}
