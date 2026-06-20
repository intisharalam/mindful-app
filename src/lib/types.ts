export type ContentType = "deep" | "short";

export type MacroCategory =
  | "Educational"
  | "Entertainment"
  | "Wellbeing"
  | "Arts & Culture";

export interface ContentItem {
  id: number;
  type: ContentType;
  macroCategory: MacroCategory;
  category: string;
  title: string;
  creator: string;
  duration: string;
  emoji: string;
  body: string;
  flagged?: boolean;
  tags?: string[];
}

export interface Book {
  id: number;
  macroCategory: MacroCategory;
  category: string;
  title: string;
  author: string;
  coverEmoji: string;
  trending: boolean;
  blurb: string;
  pages: number;
  flagged?: boolean;
  tags?: string[];
}

export type AppMode = "parent" | "kid";

export interface CategoryBudget {
  macroCategory: MacroCategory;
  enabled: boolean;
  weeklyMinutesLimit: number | null;
}

export interface AppSettings {
  pin: string;
  shortFormEnabled: boolean;
  categoryBudgets: CategoryBudget[];
  kidAllowedMicroCategories: string[];
}
