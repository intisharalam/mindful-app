import { getDb } from "./db";
import { AppMode, CategoryBudget } from "@/lib/types";

export interface UserSettings {
  mode: AppMode;
  pin: string;
  shortFormEnabled: boolean;
  categoryBudgets: CategoryBudget[];
  kidAllowedMicroCategories: string[];
}

interface SettingsRow {
  mode: string;
  pin: string;
  short_form_enabled: number;
  category_budgets: string;
  kid_allowed_micro_categories: string;
}

export function getUserSettings(
  userId: number,
  defaultBudgets: CategoryBudget[],
  defaultMicroCategories: string[]
): UserSettings {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT mode, pin, short_form_enabled, category_budgets, kid_allowed_micro_categories
       FROM user_settings WHERE user_id = ?`
    )
    .get(userId) as SettingsRow | undefined;

  if (!row) {
    db.prepare(
      `INSERT INTO user_settings (user_id, category_budgets, kid_allowed_micro_categories)
       VALUES (?, ?, ?)`
    ).run(userId, JSON.stringify(defaultBudgets), JSON.stringify(defaultMicroCategories));
    return {
      mode: "parent",
      pin: "1234",
      shortFormEnabled: true,
      categoryBudgets: defaultBudgets,
      kidAllowedMicroCategories: defaultMicroCategories,
    };
  }

  let categoryBudgets: CategoryBudget[];
  let kidAllowedMicroCategories: string[];
  try {
    categoryBudgets = JSON.parse(row.category_budgets);
    if (!Array.isArray(categoryBudgets) || categoryBudgets.length === 0) {
      categoryBudgets = defaultBudgets;
    }
  } catch {
    categoryBudgets = defaultBudgets;
  }
  try {
    kidAllowedMicroCategories = JSON.parse(row.kid_allowed_micro_categories);
    if (!Array.isArray(kidAllowedMicroCategories) || kidAllowedMicroCategories.length === 0) {
      kidAllowedMicroCategories = defaultMicroCategories;
    }
  } catch {
    kidAllowedMicroCategories = defaultMicroCategories;
  }

  return {
    mode: row.mode === "kid" ? "kid" : "parent",
    pin: row.pin,
    shortFormEnabled: Boolean(row.short_form_enabled),
    categoryBudgets,
    kidAllowedMicroCategories,
  };
}

export function saveUserSettings(userId: number, settings: UserSettings): void {
  const db = getDb();
  db.prepare(
    `UPDATE user_settings SET
       mode = ?, pin = ?, short_form_enabled = ?,
       category_budgets = ?, kid_allowed_micro_categories = ?,
       updated_at = datetime('now')
     WHERE user_id = ?`
  ).run(
    settings.mode,
    settings.pin,
    settings.shortFormEnabled ? 1 : 0,
    JSON.stringify(settings.categoryBudgets),
    JSON.stringify(settings.kidAllowedMicroCategories),
    userId
  );
}
