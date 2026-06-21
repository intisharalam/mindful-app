import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/requestAuth";
import { getUserSettings, saveUserSettings, UserSettings } from "@/lib/server/settings";
import { MACRO_CATEGORIES, CATEGORIES } from "@/lib/content";

function defaultBudgets() {
  return MACRO_CATEGORIES.map((macro) => ({
    macroCategory: macro,
    enabled: true,
    weeklyMinutesLimit: macro === "Entertainment" ? 180 : null,
  }));
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const settings = await getUserSettings(user.id, defaultBudgets(), CATEGORIES);
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: Partial<UserSettings> & { requestedMode?: "parent" | "kid"; pinAttempt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const current = await getUserSettings(user.id, defaultBudgets(), CATEGORIES);

  let mode = current.mode;
  if (body.requestedMode === "kid") {
    mode = "kid";
  } else if (body.requestedMode === "parent") {
    if (body.pinAttempt !== current.pin) {
      return NextResponse.json({ error: "Incorrect PIN" }, { status: 403 });
    }
    mode = "parent";
  }

  const next: UserSettings = {
    mode,
    pin: body.pin ?? current.pin,
    shortFormEnabled: body.shortFormEnabled ?? current.shortFormEnabled,
    categoryBudgets: body.categoryBudgets ?? current.categoryBudgets,
    kidAllowedMicroCategories:
      body.kidAllowedMicroCategories ?? current.kidAllowedMicroCategories,
  };

  await saveUserSettings(user.id, next);
  return NextResponse.json({ settings: next });
}
