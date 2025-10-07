import { Tabs } from "@base-ui-components/react/tabs";
import { Frown, Layers, Meh, Smile } from "lucide-react";
import type { Post } from "@/types/post";
import { PostStream } from "./PostStream";

type SentimentFilter = "all" | "positive" | "negative" | "neutral";

interface PostStreamTabsProps {
  activeSentiment: SentimentFilter;
  onTabChange: (value: string) => void;
  displayPosts: Post[];
  onPostReceived: (post: Post) => void;
}

export function PostStreamTabs({
  activeSentiment,
  onTabChange,
  displayPosts,
  onPostReceived,
}: PostStreamTabsProps) {
  return (
    <Tabs.Root value={activeSentiment} onValueChange={onTabChange}>
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
          onPostReceived={onPostReceived}
          sentimentFilter={activeSentiment}
        />
      </Tabs.Panel>
    </Tabs.Root>
  );
}
