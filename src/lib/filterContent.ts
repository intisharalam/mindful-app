import { ContentItem, Book, AppMode, CategoryBudget } from "./types";

interface FilterContext {
  mode: AppMode;
  shortFormEnabled: boolean;
  categoryBudgets: CategoryBudget[];
  kidAllowedMicroCategories: string[];
}

function isMacroEnabled(
  macro: ContentItem["macroCategory"],
  budgets: CategoryBudget[]
) {
  return budgets.find((b) => b.macroCategory === macro)?.enabled ?? false;
}

export function filterContent(
  items: ContentItem[],
  ctx: FilterContext
): ContentItem[] {
  return items.filter((item) => {
    if (item.flagged && ctx.mode === "kid") return false;
    if (!isMacroEnabled(item.macroCategory, ctx.categoryBudgets)) return false;
    if (ctx.mode === "kid" && !ctx.kidAllowedMicroCategories.includes(item.category)) {
      return false;
    }
    if (!ctx.shortFormEnabled && item.type === "short") return false;
    return true;
  });
}

export function filterBooks(items: Book[], ctx: FilterContext): Book[] {
  return items.filter((item) => {
    if (item.flagged && ctx.mode === "kid") return false;
    if (!isMacroEnabled(item.macroCategory, ctx.categoryBudgets)) return false;
    if (ctx.mode === "kid" && !ctx.kidAllowedMicroCategories.includes(item.category)) {
      return false;
    }
    return true;
  });
}

export function isFlaggedAndVisible(
  flagged: boolean | undefined,
  mode: AppMode
): boolean {
  return Boolean(flagged) && mode === "parent";
}
