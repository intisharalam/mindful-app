"use client";

import { ContentItem } from "@/lib/types";
import { CuriosityQuestion } from "@/lib/curiosity";

export default function TodaysFocus({
  item,
  question,
  onOpen,
}: {
  item: ContentItem;
  question: CuriosityQuestion | undefined;
  onOpen: (item: ContentItem) => void;
}) {
  return (
    <button
      onClick={() => onOpen(item)}
      className="w-full text-left border border-border rounded-2xl p-6 mb-7 bg-deep-bg hover:border-deep-text/40 transition-colors"
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-deep-text mb-3">
        Today&apos;s focus
      </p>
      {question && (
        <p className="text-[15px] text-ink-secondary mb-3 leading-snug">
          {question.question}
        </p>
      )}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-deep flex items-center justify-center text-3xl shrink-0">
          {item.emoji}
        </div>
        <div className="min-w-0">
          <p className="text-[16px] font-semibold text-ink leading-snug mb-1">
            {item.title}
          </p>
          <p className="text-[12px] text-ink-tertiary">
            {item.creator} · {item.duration}
          </p>
        </div>
      </div>
    </button>
  );
}
