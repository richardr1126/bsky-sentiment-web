"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { Activity, ChartBar, Cloud, Layers, X, Zap } from "lucide-react";
import * as React from "react";

/**
 * Header component: sleek top bar for the Bluesky sentiment analysis dashboard.
 * Displays brand, live status indicator, and architecture overview.
 */
export function Header() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-gradient-to-b from-surface to-surface-secondary/60 backdrop-blur supports-[backdrop-filter]:bg-surface/40">
      {/* Accent gradient bar */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-brand-primary/0 via-brand-primary/70 to-brand-primary/0" />
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div
            className="h-7 w-7 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-primary/60 shadow-md flex items-center justify-center"
            aria-hidden
          >
            <Activity className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-md font-semibold tracking-tight text-text-primary leading-none">
              Bluesky Sentiment
            </span>
            <span className="text-xs text-text-tertiary/70 leading-none mt-0.5">
              Real-time firehose analysis
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Overview Dialog Trigger */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="group inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-secondary/70 px-3 py-1.5 text-xs font-medium text-text-secondary shadow-sm transition hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60">
              <Layers
                className="h-3.5 w-3.5 opacity-80 group-hover:opacity-100"
                aria-hidden
              />
              <span>Architecture</span>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
                <Dialog.Popup className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-border/70 bg-surface shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-brand-primary/0 via-brand-primary/70 to-brand-primary/0" />
                  <div className="flex items-center justify-between border-b border-border/60 px-6 py-4 backdrop-blur-sm">
                    <div>
                      <Dialog.Title className="text-base font-semibold tracking-tight text-text-primary">
                        Architecture
                      </Dialog.Title>
                    </div>
                    <Dialog.Close className="rounded p-1 text-text-tertiary transition hover:bg-surface-secondary hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60">
                      <span className="sr-only">Close</span>
                      <X className="h-4 w-4" aria-hidden />
                    </Dialog.Close>
                  </div>
                  <div className="px-6 pb-6 pt-5 space-y-6">
                    <div className="rounded-lg border border-border/60 bg-surface-secondary/30 p-4">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        This dashboard visualizes sentiment analysis of posts
                        from the{" "}
                        <a
                          href="https://bsky.app"
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-primary hover:underline font-medium"
                        >
                          Bluesky
                        </a>{" "}
                        social network in real-time. Posts are analyzed using a
                        machine learning model to detect positive, negative, and
                        neutral emotions.
                      </p>
                    </div>

                    {/* Service Cards Grid */}
                    <div className="grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
                      <div className="group space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Cloud className="h-4 w-4 text-blue-400" />
                          </div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                            Bluesky Firehose
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-text-secondary">
                          <span className="font-medium">AT Protocol</span>{" "}
                          real-time data stream delivering all public posts,
                          likes, and social interactions from the Bluesky
                          network as they happen.
                        </p>
                      </div>
                      <div className="group space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                            <Zap className="h-4 w-4 text-brand-primary" />
                          </div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                            Ingest Service
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-text-secondary">
                          <span className="font-medium">Firehose Ingest</span>{" "}
                          filters and validates posts by language, length, and
                          content quality, then publishes clean data to NATS for
                          processing.
                        </p>
                      </div>
                      <div className="group space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Layers className="h-4 w-4 text-purple-400" />
                          </div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                            NATS JetStream
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-text-secondary">
                          <span className="font-medium">Dual Streams</span>{" "}
                          provide durable messaging: raw posts stream for
                          processing input, enriched posts stream with sentiment
                          for dashboard output.
                        </p>
                      </div>
                      <div className="group space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-sentiment-positive-accent/10 flex items-center justify-center">
                            <ChartBar className="h-4 w-4 text-sentiment-positive-accent" />
                          </div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                            Processor Service
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-text-secondary">
                          <span className="font-medium">Stream Processor</span>{" "}
                          consumes posts, runs{" "}
                          <a
                            href="https://huggingface.co/onnx-community/twitter-roberta-base-sentiment-ONNX"
                            target="_blank"
                            rel="noreferrer"
                            className="underline decoration-dotted underline-offset-2 hover:text-text-primary"
                          >
                            RoBERTa ONNX
                          </a>{" "}
                          AI inference for 3-class sentiment, and publishes
                          enriched results back to NATS.
                        </p>
                      </div>
                      <div className="group space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-brand-primary" />
                          </div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                            Dashboard UI
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-text-secondary">
                          <span className="font-medium">Next.js Frontend</span>{" "}
                          subscribes to enriched NATS stream via Server-Sent
                          Events, displaying real-time sentiment analysis with
                          filtering.
                        </p>
                      </div>
                      <div className="group space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-text-secondary/10 flex items-center justify-center">
                            <Cloud className="h-4 w-4 text-text-secondary" />
                          </div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                            Infrastructure
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-text-secondary">
                          <span className="font-medium">GKE + Helm</span>{" "}
                          orchestrates containerized microservices on Kubernetes
                          with automated deployments, health monitoring, and
                          horizontal scaling.
                        </p>
                      </div>
                    </div>

                    {/* Service Flow Diagram */}
                    <div className="rounded-lg border border-border/60 bg-gradient-to-br from-surface-secondary/40 to-surface-secondary/20 p-5">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-4">
                        Sentiment Analysis Pipeline
                      </h4>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        {/* Bluesky Firehose */}
                        <div className="flex flex-col items-center flex-1">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-2">
                            <Cloud className="h-5 w-5 text-blue-400" />
                          </div>
                          <span className="font-medium text-text-primary text-center text-[11px]">
                            Bluesky
                          </span>
                          <span className="text-text-tertiary text-[9px]">
                            Firehose
                          </span>
                        </div>

                        {/* Arrow */}
                        <div className="flex flex-col items-center px-1">
                          <svg
                            className="w-5 h-4 text-brand-primary/60"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            role="img"
                            aria-label="Arrow"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>

                        {/* Ingest Service */}
                        <div className="flex flex-col items-center flex-1">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-brand-primary/20 to-brand-primary/10 border border-brand-primary/30 flex items-center justify-center mb-2">
                            <Zap className="h-5 w-5 text-brand-primary" />
                          </div>
                          <span className="font-medium text-text-primary text-center text-[11px]">
                            Ingest
                          </span>
                          <span className="text-text-tertiary text-[9px]">
                            Filter
                          </span>
                        </div>

                        {/* Arrow */}
                        <div className="flex flex-col items-center px-1">
                          <svg
                            className="w-5 h-4 text-brand-primary/60"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            role="img"
                            aria-label="Arrow"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>

                        {/* NATS JetStream */}
                        <div className="flex flex-col items-center flex-1">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-2">
                            <Layers className="h-5 w-5 text-purple-400" />
                          </div>
                          <span className="font-medium text-text-primary text-center text-[11px]">
                            NATS
                          </span>
                          <span className="text-text-tertiary text-[9px]">
                            Raw posts
                          </span>
                        </div>

                        {/* Arrow */}
                        <div className="flex flex-col items-center px-1">
                          <svg
                            className="w-5 h-4 text-brand-primary/60"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            role="img"
                            aria-label="Arrow"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>

                        {/* Processor Service */}
                        <div className="flex flex-col items-center flex-1">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-sentiment-positive-accent/20 to-sentiment-positive-accent/10 border border-sentiment-positive-accent/30 flex items-center justify-center mb-2">
                            <ChartBar className="h-5 w-5 text-sentiment-positive-accent" />
                          </div>
                          <span className="font-medium text-text-primary text-center text-[11px]">
                            Processor
                          </span>
                          <span className="text-text-tertiary text-[9px]">
                            ONNX Model
                          </span>
                        </div>

                        {/* Arrow back to NATS */}
                        <div className="flex flex-col items-center px-1">
                          <svg
                            className="w-5 h-4 text-brand-primary/60"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            role="img"
                            aria-label="Arrow"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>

                        {/* NATS JetStream (Output) */}
                        <div className="flex flex-col items-center flex-1">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-2">
                            <Layers className="h-5 w-5 text-purple-400" />
                          </div>
                          <span className="font-medium text-text-primary text-center text-[11px]">
                            NATS
                          </span>
                          <span className="text-text-tertiary text-[9px]">
                            Posts w/ Sentiment
                          </span>
                        </div>

                        {/* Arrow */}
                        <div className="flex flex-col items-center px-1">
                          <svg
                            className="w-5 h-4 text-brand-primary/60"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            role="img"
                            aria-label="Arrow"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>

                        {/* Dashboard */}
                        <div className="flex flex-col items-center flex-1">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-brand-primary/20 to-brand-primary/10 border border-brand-primary/30 flex items-center justify-center mb-2">
                            <Activity className="h-5 w-5 text-brand-primary" />
                          </div>
                          <span className="font-medium text-text-primary text-center text-[11px]">
                            Dashboard
                          </span>
                          <span className="text-text-tertiary text-[9px]">
                            Real-time
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/30">
                        <p className="text-[11px] text-text-tertiary/80 text-center">
                          Powered by Kubernetes, Helm, and Google Cloud Platform
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Popup>
              </div>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
