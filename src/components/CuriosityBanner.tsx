"use client";

import { useMemo } from "react";
import { pickCuriosityQuestion } from "@/lib/curiosity";
import { ContentItem, Book } from "@/lib/types";

export default function CuriosityBanner({
  visibleContent,
  visibleBooks,
  onOpenContent,
  onOpenBook,
}: {
  visibleContent: ContentItem[];
  visibleBooks: Book[];
  onOpenContent: (item: ContentItem) => void;
  onOpenBook: (book: Book) => void;
}) {
  const dayOfMonth = new Date().getDate();
  const question = useMemo(
    () => pickCuriosityQuestion(dayOfMonth),
    [dayOfMonth]
  );

  const matchedVideo = visibleContent.find(
    (item) => item.type === "deep" && item.tags?.includes(question.matchTag)
  );
  const matchedBook = !matchedVideo
    ? visibleBooks.find((book) => book.tags?.includes(question.matchTag))
    : undefined;

  const handleClick = () => {
    if (matchedVideo) onOpenContent(matchedVideo);
    else if (matchedBook) onOpenBook(matchedBook);
  };

  const hasMatch = Boolean(matchedVideo || matchedBook);

  return (
    <button
      onClick={hasMatch ? handleClick : undefined}
      className={`w-full text-left border border-border-soft rounded-xl p-5 mb-6 bg-app-bg ${
        hasMatch ? "hover:border-border cursor-pointer" : "cursor-default"
      }`}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-deep-text mb-2">
        Worth wondering about
      </p>
      <p className="text-[16px] font-medium text-ink leading-snug mb-2">
        {question.question}
      </p>
      {hasMatch ? (
        <p className="text-[12px] text-ink-tertiary">
          {matchedVideo
            ? `Watch: ${matchedVideo.title} →`
            : `Read: ${matchedBook?.title} →`}
        </p>
      ) : (
        <p className="text-[12px] text-ink-tertiary">
          Something to think about today.
        </p>
      )}
    </button>
  );
}
