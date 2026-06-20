"use client";

import { useState } from "react";
import { BOOKS } from "@/lib/books";
import { MACRO_CATEGORIES } from "@/lib/content";
import { Book, MacroCategory } from "@/lib/types";
import BookCard from "@/components/BookCard";
import BookViewer from "@/components/BookViewer";
import Toast from "@/components/Toast";
import { useEngagement } from "@/context/EngagementContext";
import { useAppSettings } from "@/context/AppSettingsContext";
import { filterBooks } from "@/lib/filterContent";

export default function LibraryPage() {
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const { toast, registerDeepComplete } = useEngagement();
  const {
    mode,
    shortFormEnabled,
    categoryBudgets,
    kidAllowedMicroCategories,
    isMacroEnabled,
  } = useAppSettings();

  const availableMacros = MACRO_CATEGORIES.filter((m) => isMacroEnabled(m));
  const [activeMacro, setActiveMacro] = useState<MacroCategory | "all">("all");

  const visibleBooks = filterBooks(BOOKS, {
    mode,
    shortFormEnabled,
    categoryBudgets,
    kidAllowedMicroCategories,
  });

  const scopedBooks =
    activeMacro === "all"
      ? visibleBooks
      : visibleBooks.filter((b) => b.macroCategory === activeMacro);

  const trending = scopedBooks.filter((b) => b.trending);
  const more = scopedBooks.filter((b) => !b.trending);

  return (
    <div className="px-4 md:px-6 py-5 pb-20 md:pb-5">
      <h1 className="text-[20px] font-semibold text-ink mb-1">Library</h1>
      <p className="text-[13px] text-ink-secondary mb-5">
        Free books, picked to promote reading. Starting one builds your
        streak just like a deep video does.
      </p>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveMacro("all")}
          className={`shrink-0 text-[13px] font-medium rounded-full px-4 py-1.5 border ${
            activeMacro === "all"
              ? "bg-ink text-white border-ink"
              : "border-border text-ink-secondary hover:bg-app-bg"
          }`}
        >
          All
        </button>
        {availableMacros.map((macro) => (
          <button
            key={macro}
            onClick={() => setActiveMacro(macro)}
            className={`shrink-0 text-[13px] font-medium rounded-full px-4 py-1.5 border ${
              activeMacro === macro
                ? "bg-ink text-white border-ink"
                : "border-border text-ink-secondary hover:bg-app-bg"
            }`}
          >
            {macro}
          </button>
        ))}
      </div>

      {trending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[12px] font-medium uppercase tracking-wide text-ink-tertiary mb-3 pb-2 border-b border-border-soft">
            Trending now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {trending.map((book) => (
              <BookCard key={book.id} book={book} onOpen={setActiveBook} />
            ))}
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[12px] font-medium uppercase tracking-wide text-ink-tertiary mb-3 pb-2 border-b border-border-soft">
            More to read
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {more.map((book) => (
              <BookCard key={book.id} book={book} onOpen={setActiveBook} />
            ))}
          </div>
        </section>
      )}

      {scopedBooks.length === 0 && (
        <p className="text-[13px] text-ink-tertiary">
          No books match your current category settings. Ask a parent to
          enable more categories in Settings.
        </p>
      )}

      {activeBook && (
        <BookViewer
          book={activeBook}
          onClose={() => setActiveBook(null)}
          onStartReading={registerDeepComplete}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}
