"use client";

import { Book } from "@/lib/types";
import FlaggedBlur from "@/components/FlaggedBlur";

export default function BookCard({
  book,
  onOpen,
}: {
  book: Book;
  onOpen: (book: Book) => void;
}) {
  if (book.flagged) {
    return (
      <div className="text-left">
        <FlaggedBlur size="grid" />
        <p className="text-[13px] font-medium text-ink-tertiary leading-snug line-clamp-2 mb-1">
          Content unavailable
        </p>
        <p className="text-[12px] text-ink-tertiary opacity-70">
          Flagged by moderation
        </p>
      </div>
    );
  }

  return (
    <button onClick={() => onOpen(book)} className="text-left group">
      <div className="relative h-[150px] rounded-xl bg-deep-bg flex items-center justify-center text-4xl mb-2">
        {book.coverEmoji}
        {book.trending && (
          <span className="absolute top-2 left-2 text-[10px] font-medium bg-friction text-white px-1.5 py-0.5 rounded">
            trending
          </span>
        )}
      </div>
      <p className="text-[13px] font-medium text-ink leading-snug line-clamp-2 mb-1 group-hover:text-deep">
        {book.title}
      </p>
      <p className="text-[12px] text-ink-tertiary">{book.author}</p>
    </button>
  );
}
