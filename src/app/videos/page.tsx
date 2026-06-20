"use client";

import { useState } from "react";
import { CONTENT, MACRO_CATEGORIES, MICRO_CATEGORIES_BY_MACRO } from "@/lib/content";
import { ContentItem, MacroCategory } from "@/lib/types";
import VideoCard from "@/components/VideoCard";
import Viewer from "@/components/Viewer";
import InterruptModal from "@/components/InterruptModal";
import Toast from "@/components/Toast";
import { useEngagement } from "@/context/EngagementContext";
import { useAppSettings } from "@/context/AppSettingsContext";
import { filterContent } from "@/lib/filterContent";

export default function VideosPage() {
  const [activeItem, setActiveItem] = useState<ContentItem | null>(null);
  const [showInterrupt, setShowInterrupt] = useState(false);
  const { toast, registerDeepComplete, registerShortSkip, registerShortBlocked } =
    useEngagement();
  const {
    mode,
    shortFormEnabled,
    categoryBudgets,
    kidAllowedMicroCategories,
    isMacroEnabled,
  } = useAppSettings();

  const availableMacros = MACRO_CATEGORIES.filter((m) => isMacroEnabled(m));
  const [activeMacro, setActiveMacro] = useState<MacroCategory | "all">("all");

  const visibleContent = filterContent(CONTENT, {
    mode,
    shortFormEnabled,
    categoryBudgets,
    kidAllowedMicroCategories,
  });

  const scopedContent =
    activeMacro === "all"
      ? visibleContent
      : visibleContent.filter((c) => c.macroCategory === activeMacro);

  const microCategoriesToShow =
    activeMacro === "all"
      ? Array.from(new Set(availableMacros.flatMap((m) => MICRO_CATEGORIES_BY_MACRO[m])))
      : MICRO_CATEGORIES_BY_MACRO[activeMacro];

  const handleShortSkip = (secondsSpent: number) => {
    const result = registerShortSkip(secondsSpent);
    if (result === "interrupt") {
      registerShortBlocked();
      setShowInterrupt(true);
    }
  };

  const pickDeepFromInterrupt = () => {
    setShowInterrupt(false);
    const deepItem = scopedContent.find((c) => c.type === "deep");
    if (deepItem) setActiveItem(deepItem);
  };

  return (
    <div className="px-4 md:px-6 py-5 pb-20 md:pb-5">
      <h1 className="text-[20px] font-semibold text-ink mb-1">Videos</h1>
      <p className="text-[13px] text-ink-secondary mb-5">
        Browse by focus area instead of one mixed feed.
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

      {microCategoriesToShow.map((category) => {
        const items = scopedContent.filter((c) => c.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category} className="mb-8">
            <h2 className="text-[12px] font-medium uppercase tracking-wide text-ink-tertiary mb-3 pb-2 border-b border-border-soft">
              {category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item) => (
                <VideoCard key={item.id} item={item} onOpen={setActiveItem} />
              ))}
            </div>
          </section>
        );
      })}

      {scopedContent.length === 0 && (
        <p className="text-[13px] text-ink-tertiary">
          No videos here yet — try a different category, or ask a parent to
          enable more in Settings.
        </p>
      )}

      {activeItem && (
        <Viewer
          item={activeItem}
          onClose={() => setActiveItem(null)}
          onDeepComplete={registerDeepComplete}
          onShortSkip={handleShortSkip}
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
