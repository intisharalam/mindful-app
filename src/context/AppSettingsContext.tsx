"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import {
  AppMode,
  CategoryBudget,
  MacroCategory,
} from "@/lib/types";
import { CATEGORIES, MACRO_CATEGORIES } from "@/lib/content";
import { useAuth } from "@/context/AuthContext";

const DEFAULT_PIN = "1234";

function defaultBudgets(): CategoryBudget[] {
  return MACRO_CATEGORIES.map((macro) => ({
    macroCategory: macro,
    enabled: true,
    weeklyMinutesLimit: macro === "Entertainment" ? 180 : null,
  }));
}

interface AppSettingsState {
  mode: AppMode;
  pin: string;
  shortFormEnabled: boolean;
  categoryBudgets: CategoryBudget[];
  kidAllowedMicroCategories: string[];

  requestSwitchToParent: (enteredPin: string) => Promise<boolean>;
  switchToKid: () => void;
  setPin: (newPin: string) => void;
  setShortFormEnabled: (enabled: boolean) => void;
  toggleMacroCategory: (macro: MacroCategory) => void;
  setMacroBudget: (macro: MacroCategory, minutes: number | null) => void;
  setKidAllowedMicroCategories: (categories: string[]) => void;

  isMacroEnabled: (macro: MacroCategory) => boolean;
  isMicroVisible: (microCategory: string, macro: MacroCategory) => boolean;
}

const AppSettingsContext = createContext<AppSettingsState | null>(null);

interface RemoteSettings {
  mode: AppMode;
  pin: string;
  shortFormEnabled: boolean;
  categoryBudgets: CategoryBudget[];
  kidAllowedMicroCategories: string[];
}

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();

  const [mode, setMode] = useState<AppMode>("parent");
  const [pin, setPinState] = useState(DEFAULT_PIN);
  const [shortFormEnabled, setShortFormEnabledState] = useState(true);
  const [categoryBudgets, setCategoryBudgets] =
    useState<CategoryBudget[]>(defaultBudgets());
  const [kidAllowedMicroCategories, setKidAllowedMicroCategoriesState] =
    useState<string[]>(CATEGORIES);
  const hasLoadedRemote = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      hasLoadedRemote.current = false;
      return;
    }
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        const s: RemoteSettings | undefined = data.settings;
        if (s) {
          setMode(s.mode);
          setPinState(s.pin);
          setShortFormEnabledState(s.shortFormEnabled);
          setCategoryBudgets(
            s.categoryBudgets.length > 0 ? s.categoryBudgets : defaultBudgets()
          );
          setKidAllowedMicroCategoriesState(
            s.kidAllowedMicroCategories.length > 0
              ? s.kidAllowedMicroCategories
              : CATEGORIES
          );
        }
        hasLoadedRemote.current = true;
      })
      .catch(() => {
        hasLoadedRemote.current = true;
      });
  }, [user, authLoading]);

  const persist = (body: Record<string, unknown>) => {
    if (!user) return Promise.resolve<RemoteSettings | null>(null);
    return fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => (data.settings as RemoteSettings) ?? null)
      .catch(() => null);
  };

  const requestSwitchToParent = async (enteredPin: string): Promise<boolean> => {
    if (!user) {
      const ok = enteredPin === pin;
      if (ok) setMode("parent");
      return ok;
    }
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestedMode: "parent", pinAttempt: enteredPin }),
    });
    if (res.ok) {
      setMode("parent");
      return true;
    }
    return false;
  };

  const switchToKid = () => {
    setMode("kid");
    persist({ requestedMode: "kid" });
  };

  const setPin = (newPin: string) => {
    setPinState(newPin);
    persist({ pin: newPin });
  };

  const setShortFormEnabled = (enabled: boolean) => {
    setShortFormEnabledState(enabled);
    persist({ shortFormEnabled: enabled });
  };

  const toggleMacroCategory = (macro: MacroCategory) => {
    setCategoryBudgets((prev) => {
      const next = prev.map((b) =>
        b.macroCategory === macro ? { ...b, enabled: !b.enabled } : b
      );
      persist({ categoryBudgets: next });
      return next;
    });
  };

  const setMacroBudget = (macro: MacroCategory, minutes: number | null) => {
    setCategoryBudgets((prev) => {
      const next = prev.map((b) =>
        b.macroCategory === macro ? { ...b, weeklyMinutesLimit: minutes } : b
      );
      persist({ categoryBudgets: next });
      return next;
    });
  };

  const setKidAllowedMicroCategories = (categories: string[]) => {
    setKidAllowedMicroCategoriesState(categories);
    persist({ kidAllowedMicroCategories: categories });
  };

  const isMacroEnabled = (macro: MacroCategory) =>
    categoryBudgets.find((b) => b.macroCategory === macro)?.enabled ?? false;

  const isMicroVisible = (microCategory: string, macro: MacroCategory) => {
    if (!isMacroEnabled(macro)) return false;
    if (mode === "kid") {
      return kidAllowedMicroCategories.includes(microCategory);
    }
    return true;
  };

  return (
    <AppSettingsContext.Provider
      value={{
        mode,
        pin,
        shortFormEnabled,
        categoryBudgets,
        kidAllowedMicroCategories,
        requestSwitchToParent,
        switchToKid,
        setPin,
        setShortFormEnabled,
        toggleMacroCategory,
        setMacroBudget,
        setKidAllowedMicroCategories,
        isMacroEnabled,
        isMicroVisible,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }
  return ctx;
}
