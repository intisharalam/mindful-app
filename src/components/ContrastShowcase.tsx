"use client";

import { ContentItem } from "@/lib/types";

export default function ContrastShowcase({
  deepExample,
  shortExample,
  onOpen,
}: {
  deepExample: ContentItem | undefined;
  shortExample: ContentItem | undefined;
  onOpen: (item: ContentItem) => void;
}) {
  if (!deepExample && !shortExample) return null;

  return (
    <div className="mb-8">
      <p className="text-[12px] font-medium uppercase tracking-wide text-ink-tertiary mb-3">
        Why this feed feels different
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {deepExample && (
          <button
            onClick={() => onOpen(deepExample)}
            className="text-left bg-deep-bg rounded-xl p-5 border border-border-soft hover:border-border"
          >
            <p className="text-[11px] font-medium text-deep-text mb-3 tracking-wide">
              DEEP CONTENT — FLOWS FREELY
            </p>
            <div className="h-[64px] rounded-lg bg-deep mb-3 flex items-center justify-center text-2xl">
              {deepExample.emoji}
            </div>
            <p className="text-[14px] font-medium text-ink mb-1">
              {deepExample.title}
            </p>
            <p className="text-[12px] text-ink-tertiary">
              {deepExample.duration} · tap to read, no friction
            </p>
          </button>
        )}

        {shortExample && (
          <button
            onClick={() => onOpen(shortExample)}
            className="text-left bg-friction-bg rounded-xl p-5 border border-border-soft hover:border-border"
          >
            <p className="text-[11px] font-medium text-friction-text mb-3 tracking-wide">
              SHORT-FORM — MAKES YOU WAIT
            </p>
            <div className="h-[64px] rounded-lg bg-surface border-2 border-dashed border-friction mb-3 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#B45309" strokeWidth="2" />
                <path d="M12 7v5l3 3" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[14px] font-medium text-ink mb-1">
              {shortExample.title}
            </p>
            <p className="text-[12px] text-ink-tertiary">
              {shortExample.duration} · 3 second pause before skip
            </p>
          </button>
        )}
      </div>
    </div>
  );
}
