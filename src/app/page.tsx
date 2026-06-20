"use client";

import { useState, useMemo } from "react";
import { CONTENT } from "@/lib/content";
import { ContentItem, Book } from "@/lib/types";
import VideoCard from "@/components/VideoCard";
import Viewer from "@/components/Viewer";
import InterruptModal from "@/components/InterruptModal";
import Toast from "@/components/Toast";
import TodaysFocus from "@/components/TodaysFocus";
import BookViewer from "@/components/BookViewer";
import { useEngagement } from "@/context/EngagementContext";
import { useAppSettings } from "@/context/AppSettingsContext";
import { filterContent } from "@/lib/filterContent";
import { pickTodaysFocus, pickFocusedRow } from "@/lib/dailyPick";
import { pickCuriosityQuestion, findQuestionForTags } from "@/lib/curiosity";

const ROW_SIZE = 6;

export default function HomePage() {
  const [activeItem, setActiveItem] = useState<ContentItem | null>(null);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [showInterrupt, setShowInterrupt] = useState(false);
  const {
    toast,
    registerDeepComplete,
    registerShortSkip,
    registerShortBlocked,
  } = useEngagement();
  const { mode, shortFormEnabled, categoryBudgets, kidAllowedMicroCategories } =
    useAppSettings();

  const filterCtx = {
    mode,
    shortFormEnabled,
    categoryBudgets,
    kidAllowedMicroCategories,
  };

  const visibleContent = filterContent(CONTENT, filterCtx);

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );

  const focusItem = useMemo(
    () => pickTodaysFocus(visibleContent),
    [visibleContent]
  );

  const question = useMemo(() => {
    const tagMatch = findQuestionForTags(focusItem?.tags);
    return tagMatch ?? pickCuriosityQuestion(dayOfYear);
  }, [focusItem, dayOfYear]);

  const focusedRow = useMemo(
    () => pickFocusedRow(visibleContent, focusItem?.id, ROW_SIZE),
    [visibleContent, focusItem]
  );

  const handleShortSkip = (secondsSpent: number) => {
    const result = registerShortSkip(secondsSpent);
    if (result === "interrupt") {
      registerShortBlocked();
      setShowInterrupt(true);
    }
  };

  const pickDeepFromInterrupt = () => {
    setShowInterrupt(false);
    const deepItem = visibleContent.find((c) => c.type === "deep");
    if (deepItem) setActiveItem(deepItem);
  };

  return (
    <div className="px-4 md:px-6 py-5 pb-20 md:pb-5 max-w-[880px]">
      {focusItem ? (
        <TodaysFocus
          item={focusItem}
          question={question}
          onOpen={setActiveItem}
        />
      ) : (
        <div className="border border-border-soft rounded-2xl p-6 mb-7 bg-app-bg">
          <p className="text-[13px] text-ink-tertiary">
            No content matches your current category settings. Ask a parent
            to enable more categories in Settings.
          </p>
        </div>
      )}

      {focusedRow.length > 0 && (
        <section>
          <h2 className="text-[12px] font-medium uppercase tracking-wide text-ink-tertiary mb-3">
            A few more worth your time
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {focusedRow.map((item) => (
              <VideoCard key={item.id} item={item} onOpen={setActiveItem} />
            ))}
          </div>
        </section>
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
