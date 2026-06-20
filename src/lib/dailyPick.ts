import { ContentItem } from "./types";

// Simple deterministic hash so the same day always picks the same item,
// without needing any stored state.
function seededIndex(seed: number, length: number): number {
  if (length === 0) return -1;
  return seed % length;
}

export function pickTodaysFocus(
  visibleContent: ContentItem[]
): ContentItem | undefined {
  const deepItems = visibleContent.filter((c) => c.type === "deep");
  if (deepItems.length === 0) return undefined;
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000
  );
  const index = seededIndex(dayOfYear, deepItems.length);
  return deepItems[index];
}

/**
 * Picks a small, evenly-spread set of items across categories, prioritizing
 * deep content, for a short "more to explore" row — deliberately not a
 * full directory of every category.
 */
export function pickFocusedRow(
  visibleContent: ContentItem[],
  excludeId: number | undefined,
  count: number
): ContentItem[] {
  const pool = visibleContent.filter((c) => c.id !== excludeId);

  const byCategory = new Map<string, ContentItem[]>();
  for (const item of pool) {
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }

  for (const list of byCategory.values()) {
    list.sort((a, b) => (a.type === "deep" ? -1 : 0) - (b.type === "deep" ? -1 : 0));
  }

  const categories = Array.from(byCategory.keys());
  const result: ContentItem[] = [];
  let round = 0;

  while (result.length < count && categories.length > 0) {
    let addedThisRound = false;
    for (const category of categories) {
      if (result.length >= count) break;
      const list = byCategory.get(category)!;
      if (round < list.length) {
        result.push(list[round]);
        addedThisRound = true;
      }
    }
    if (!addedThisRound) break;
    round += 1;
  }

  return result;
}
