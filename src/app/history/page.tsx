"use client";

import { useEffect, useState } from "react";
import { CONTENT } from "@/lib/content";
import { BOOKS } from "@/lib/books";
import { ContentItem, Book } from "@/lib/types";
import VideoCard from "@/components/VideoCard";
import BookCard from "@/components/BookCard";
import Viewer from "@/components/Viewer";
import BookViewer from "@/components/BookViewer";
import InterruptModal from "@/components/InterruptModal";
import Toast from "@/components/Toast";
import { useEngagement } from "@/context/EngagementContext";

interface HistoryEntry {
  contentType: "video" | "book";
  contentId: number;
  viewedAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[] | null>(null);
  const [activeItem, setActiveItem] = useState<ContentItem | null>(null);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [showInterrupt, setShowInterrupt] = useState(false);
  const {
    toast,
    registerDeepComplete,
    registerShortSkip,
    registerShortBlocked,
  } = useEngagement();

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => setHistory(data.history ?? []))
      .catch(() => setHistory([]));
  }, []);

  const handleShortSkip = (secondsSpent: number) => {
    const result = registerShortSkip(secondsSpent);
    if (result === "interrupt") {
      registerShortBlocked();
      setShowInterrupt(true);
    }
  };

  const pickDeepFromInterrupt = () => {
    setShowInterrupt(false);
    const deepItem = CONTENT.find((c) => c.type === "deep");
    if (deepItem) setActiveItem(deepItem);
  };

  const resolvedEntries = (history ?? [])
    .map((entry) => {
      if (entry.contentType === "video") {
        const item = CONTENT.find((c) => c.id === entry.contentId);
        return item ? { entry, item, kind: "video" as const } : null;
      }
      const book = BOOKS.find((b) => b.id === entry.contentId);
      return book ? { entry, book, kind: "book" as const } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <div className="px-4 md:px-6 py-5 pb-20 md:pb-5">
      <h1 className="text-[20px] font-semibold text-ink mb-1">History</h1>
      <p className="text-[13px] text-ink-secondary mb-6">
        Your 3 most recently viewed items.
      </p>

      {history === null && (
        <p className="text-[13px] text-ink-tertiary">Loading…</p>
      )}

      {history !== null && resolvedEntries.length === 0 && (
        <p className="text-[13px] text-ink-tertiary">
          Nothing here yet — open a video or book and it&apos;ll show up.
        </p>
      )}

      {resolvedEntries.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-[600px]">
          {resolvedEntries.map(({ entry, ...rest }) =>
            rest.kind === "video" ? (
              <VideoCard
                key={`video-${entry.contentId}`}
                item={rest.item}
                onOpen={setActiveItem}
              />
            ) : (
              <BookCard
                key={`book-${entry.contentId}`}
                book={rest.book}
                onOpen={setActiveBook}
              />
            )
          )}
        </div>
      )}

      {activeItem && (
        <Viewer
          item={activeItem}
          onClose={() => setActiveItem(null)}
          onDeepComplete={registerDeepComplete}
          onShortSkip={handleShortSkip}
        />
      )}

      {activeBook && (
        <BookViewer
          book={activeBook}
          onClose={() => setActiveBook(null)}
          onStartReading={registerDeepComplete}
        />
      )}

      {showInterrupt && (
        <InterruptModal
          onPickDeep={pickDeepFromInterrupt}
          onDismiss={() => setShowInterrupt(false)}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}
