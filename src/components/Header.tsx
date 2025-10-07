import { Activity } from "lucide-react";
import { ArchitectureModal } from "@/components/ArchitectureModal";

/**
 * Header component: sleek top bar for the Bluesky sentiment analysis dashboard.
 * Displays brand, live status indicator, and architecture overview.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-gradient-to-b from-surface to-surface-secondary/60 backdrop-blur supports-[backdrop-filter]:bg-surface/40">
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
          <ArchitectureModal />
        </div>
      </div>
      {/* Accent gradient bar */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-brand-primary/0 via-brand-primary/70 to-brand-primary/0" />
    </header>
  );
}
