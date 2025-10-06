"use client";

import type { Post } from "@/types/post";

type Sentiment = "positive" | "negative" | "neutral" | "unknown";

function sentimentOf(post: Post): Sentiment {
  const s = post.sentiment?.sentiment as Sentiment | undefined;
  return s ?? "unknown";
}

function palette(sentiment: Sentiment) {
  switch (sentiment) {
    case "positive":
      return {
        badgeClasses:
          "bg-sentiment-positive-bg text-sentiment-positive-text border-sentiment-positive-border",
        accentClass: "text-sentiment-positive-accent",
        accentBgClass: "bg-sentiment-positive-accent",
        emoji: "😊",
      };
    case "negative":
      return {
        badgeClasses:
          "bg-sentiment-negative-bg text-sentiment-negative-text border-sentiment-negative-border",
        accentClass: "text-sentiment-negative-accent",
        accentBgClass: "bg-sentiment-negative-accent",
        emoji: "😞",
      };
    case "neutral":
      return {
        badgeClasses:
          "bg-sentiment-neutral-bg text-sentiment-neutral-text border-sentiment-neutral-border",
        accentClass: "text-sentiment-neutral-accent",
        accentBgClass: "bg-sentiment-neutral-accent",
        emoji: "😐",
      };
    default:
      return {
        badgeClasses: "bg-surface-tertiary text-text-secondary border-border",
        accentClass: "text-brand-primary",
        accentBgClass: "bg-brand-primary",
        emoji: "❓",
      };
  }
}

export function PostCard({ post }: { post: Post }) {
  const sentiment = sentimentOf(post);
  const ui = palette(sentiment);
  const text = post.text || "No text available";
  const _confidence = post.sentiment?.confidence ?? 0;
  const probs = post.sentiment?.probabilities;
  const authorShort = post.author ? post.author.slice(-8) : "unknown";

  const positivePct = probs ? Math.round(probs.positive * 100) : 0;
  const neutralPct = probs ? Math.round(probs.neutral * 100) : 0;
  const negativePct = probs ? Math.round(probs.negative * 100) : 0;

  // Sort sentiments by percentage (highest first)
  const sortedSentiments = probs
    ? [
        {
          label: "positive",
          pct: positivePct,
          bg: "bg-sentiment-positive-bg",
          border: "border-sentiment-positive-border",
          dot: "bg-sentiment-positive-accent",
          text: "text-sentiment-positive-text",
        },
        {
          label: "neutral",
          pct: neutralPct,
          bg: "bg-sentiment-neutral-bg",
          border: "border-sentiment-neutral-border",
          dot: "bg-sentiment-neutral-accent",
          text: "text-sentiment-neutral-text",
        },
        {
          label: "negative",
          pct: negativePct,
          bg: "bg-sentiment-negative-bg",
          border: "border-sentiment-negative-border",
          dot: "bg-sentiment-negative-accent",
          text: "text-sentiment-negative-text",
        },
      ].sort((a, b) => b.pct - a.pct)
    : [];

  return (
    <article className="border-b border-border bg-surface px-4 py-3 transition-colors hover:bg-surface-secondary/50">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-gradient-from to-brand-gradient-to text-xs font-semibold text-white">
            {authorShort.slice(0, 2).toUpperCase()}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {/* Author and sentiment */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 min-w-0">
              <span className="font-bold text-text-primary text-sm truncate">
                User {authorShort}
              </span>
              <div className="flex items-center gap-1.5 text-text-tertiary text-sm">
                <span>@{authorShort}</span>
                <span>·</span>
                <span>now</span>
              </div>
            </div>

            <div
              className={`flex-shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-full border ${ui.badgeClasses}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${ui.accentBgClass}`} />
              <span className="text-xs font-medium">{sentiment}</span>
            </div>
          </div>

          {/* Post text */}
          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-normal text-text-primary">
            {text}
          </p>

          {/* Sentiment pills - compact inline, sorted by highest percentage */}
          {sortedSentiments.length > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {sortedSentiments.map((s) => (
                <div
                  key={s.label}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${s.bg} border ${s.border}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  <span className={`text-xs font-medium ${s.text}`}>
                    {s.pct}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
