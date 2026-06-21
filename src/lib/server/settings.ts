import { sql, ensureSchema } from "./db";
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
  short_form_enabled: boolean;
  category_budgets: string;
  kid_allowed_micro_categories: string;
}

export async function getUserSettings(
  userId: number,
  defaultBudgets: CategoryBudget[],
  defaultMicroCategories: string[]
): Promise<UserSettings> {
  await ensureSchema();

  const rows = await sql`
    SELECT mode, pin, short_form_enabled, category_budgets, kid_allowed_micro_categories
    FROM user_settings WHERE user_id = ${userId}
  `;
  const row = rows[0] as SettingsRow | undefined;

  if (!row) {
    await sql`
      INSERT INTO user_settings (user_id, category_budgets, kid_allowed_micro_categories)
      VALUES (
        ${userId},
        ${JSON.stringify(defaultBudgets)},
        ${JSON.stringify(defaultMicroCategories)}
      )
    `;
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

export async function saveUserSettings(
  userId: number,
  settings: UserSettings
): Promise<void> {
  await ensureSchema();

  await sql`
    UPDATE user_settings SET
      mode = ${settings.mode},
      pin = ${settings.pin},
      short_form_enabled = ${settings.shortFormEnabled},
      category_budgets = ${JSON.stringify(settings.categoryBudgets)},
      kid_allowed_micro_categories = ${JSON.stringify(settings.kidAllowedMicroCategories)},
      updated_at = now()
    WHERE user_id = ${userId}
  `;
}
