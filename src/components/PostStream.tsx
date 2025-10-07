"use client";

import { ScrollArea } from "@base-ui-components/react/scroll-area";
import { Switch } from "@base-ui-components/react/switch";
import { Toolbar } from "@base-ui-components/react/toolbar";
import { Tooltip } from "@base-ui-components/react/tooltip";
import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Post } from "@/types/post";
import { PostCard } from "./PostCard";

type SentimentFilter = "all" | "positive" | "negative" | "neutral";

interface PostStreamProps {
  posts: Post[];
  onPostReceived: (post: Post) => void;
  sentimentFilter: SentimentFilter;
  duplicateCount: number;
}

export function PostStream({
  posts,
  onPostReceived,
  sentimentFilter,
  duplicateCount,
}: PostStreamProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [pendingPostCount, setPendingPostCount] = useState(0);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const pendingPostsRef = useRef<Post[]>([]);
  const isResuming = useRef(false);

  // Pause when user scrolls down; resume when scrolled back to top.
  const handleScroll = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const { scrollTop } = el;
    if (scrollTop > 120 && !isPaused && !isResuming.current) {
      setIsPaused(true);
    }
  }, [isPaused]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Handle incoming posts - queue while paused
  const handleIncomingPost = useCallback(
    (post: Post) => {
      if (isPaused) {
        pendingPostsRef.current.push(post);
        setPendingPostCount((prev) => prev + 1);
      } else {
        onPostReceived(post);
      }
    },
    [isPaused, onPostReceived],
  );

  // Resume stream and flush queued posts
  const handleResume = useCallback(() => {
    isResuming.current = true;

    if (pendingPostsRef.current.length) {
      for (const p of pendingPostsRef.current) onPostReceived(p);
      pendingPostsRef.current = [];
    }
    setPendingPostCount(0);
    setIsPaused(false);

    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: 0, behavior: "smooth" });
      // Reset the flag after scroll completes
      setTimeout(() => {
        isResuming.current = false;
      }, 500); // Match smooth scroll duration
    } else {
      isResuming.current = false;
    }
  }, [onPostReceived]);

  // EventSource connection lifecycle
  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connectToStream = () => {
      try {
        const url =
          sentimentFilter === "all"
            ? "/api/stream"
            : `/api/stream?sentiment=${sentimentFilter}`;
        eventSource = new EventSource(url);

        eventSource.onopen = () => {
          setIsConnected(true);
          setError(null);
          // slight visual pulse is handled in UI
        };

        eventSource.onmessage = (event) => {
          try {
            const post = JSON.parse(event.data) as Post;
            handleIncomingPost(post);
          } catch (parseError) {
            console.error("Error parsing post:", parseError);
          }
        };

        eventSource.onerror = (err) => {
          console.error("EventSource error:", err);
          setIsConnected(false);
          setError("Connection lost. Reconnecting...");
          if (eventSource) eventSource.close();
          setTimeout(connectToStream, 3000);
        };
      } catch (err) {
        console.error("Error connecting to stream:", err);
        setError("Failed to connect to stream");
      }
    };

    connectToStream();

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [handleIncomingPost, sentimentFilter]);

  return (
    <div className="rounded-xl border border-border bg-surface shadow-md overflow-hidden">
      {/* Toolbar Header */}
      <Toolbar.Root className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected
                ? "animate-pulse bg-status-success"
                : "bg-status-error"
            }`}
            aria-hidden
          />
          <div className="text-sm font-semibold text-text-primary">
            Live NATS Stream
          </div>
          <div className="text-xs text-text-secondary">
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Resume button - shown when paused with pending posts */}
          {isPaused && pendingPostCount > 0 && (
            <button
              type="button"
              onClick={handleResume}
              className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-2 py-1 text-xs font-medium text-white shadow-sm transition-colors hover:opacity-90"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              {pendingPostCount} new post{pendingPostCount !== 1 ? "s" : ""}
            </button>
          )}

          <Tooltip.Provider delay={300}>
            <Tooltip.Root>
              <Tooltip.Trigger
                render={<Toolbar.Button />}
                className="rounded-md border border-border bg-surface-secondary px-2 py-1 text-xs font-medium text-text-secondary"
              >
                {isPaused ? "Paused" : "Live"}
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Positioner side="bottom" align="end" sideOffset={8}>
                  <Tooltip.Popup className="rounded-md border border-border bg-surface-secondary px-3 py-2 text-xs text-text-primary shadow-lg">
                    Toggle to pause/resume live updates
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>

          <Switch.Root
            checked={!isPaused}
            onCheckedChange={(checked) => {
              if (checked) {
                handleResume();
              } else {
                setIsPaused(true);
              }
            }}
            className={`relative flex h-5 w-9 items-center rounded-full p-px outline-1 -outline-offset-1 outline-border transition-all ${
              !isPaused ? "bg-brand-primary" : "bg-surface-tertiary"
            }`}
          >
            <Switch.Thumb className="h-full aspect-square rounded-full bg-white transition-transform duration-150 data-[checked]:translate-x-4 shadow" />
          </Switch.Root>
        </div>
      </Toolbar.Root>

      {/* Error message */}
      {error && (
        <div className="bg-sentiment-negative-bg px-4 py-3">
          <p className="text-xs font-medium text-sentiment-negative-text">
            {error}
          </p>
        </div>
      )}

      {/* Scrollable posts */}
      <ScrollArea.Root className="h-[600px]">
        <ScrollArea.Viewport
          ref={viewportRef}
          className="h-full overscroll-contain outline-none"
        >
          <ScrollArea.Content className="flex flex-col">
            {posts.length === 0 ? (
              <div className="flex h-[520px] items-center justify-center">
                <div className="text-center">
                  <div className="mb-2 text-4xl">📡</div>
                  <p className="text-sm text-text-secondary">
                    Waiting for posts...
                  </p>
                </div>
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.uri} post={post} />)
            )}
          </ScrollArea.Content>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar className="m-2 flex w-1 justify-center rounded bg-surface-tertiary opacity-0 transition-opacity delay-300 data-[hovering]:opacity-100 data-[hovering]:delay-0 data-[hovering]:duration-75 data-[scrolling]:opacity-100 data-[scrolling]:delay-0 data-[scrolling]:duration-75">
          <ScrollArea.Thumb className="w-full rounded bg-text-tertiary" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* Footer count */}
      <div className="border-t border-border px-4 py-3 text-center text-xs text-text-secondary">
        <div className="flex items-center justify-center gap-4">
          <span>
            Showing {posts.length} recent post{posts.length !== 1 ? "s" : ""}
          </span>
          {duplicateCount > 0 && (
            <>
              <span>·</span>
              <span className="text-status-warning">
                {duplicateCount} duplicate{duplicateCount !== 1 ? "s" : ""}{" "}
                filtered
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
