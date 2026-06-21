"use client";

import { useEffect, useRef } from "react";
import { Book } from "@/lib/types";
import { logHistoryView } from "@/lib/logHistory";
import AddToPlaylistMenu from "@/components/AddToPlaylistMenu";

export default function BookViewer({
  book,
  onClose,
  onStartReading,
}: {
  book: Book;
  onClose: () => void;
  onStartReading: (secondsSpent: number) => void;
}) {
  const openedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    openedAtRef.current = Date.now();
    logHistoryView("book", book.id);
  }, [book]);

  const handleStart = () => {
    const elapsed = (Date.now() - openedAtRef.current) / 1000;
    onStartReading(elapsed);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl w-full max-w-[420px] p-7 relative border border-border-soft"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-app-bg flex items-center justify-center hover:bg-border-soft"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="#0F0F0F"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="h-[140px] rounded-xl mb-4 flex items-center justify-center text-5xl bg-deep-bg">
          {book.coverEmoji}
        </div>

        <h2 className="text-[18px] font-semibold leading-snug mb-1.5 text-ink">
          {book.title}
        </h2>
        <p className="text-[12px] text-ink-tertiary mb-3.5">
          {book.author} · {book.pages} pages
        </p>
        <p className="text-[14px] leading-relaxed text-ink-secondary mb-5">
          {book.blurb}
        </p>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleStart}
            className="text-[14px] font-medium rounded-full px-5 py-2.5 bg-deep text-white hover:opacity-90"
          >
            Start reading · +1 streak
          </button>
          <AddToPlaylistMenu contentType="book" contentId={book.id} />
        </div>
      </div>
    </div>
  );
}
