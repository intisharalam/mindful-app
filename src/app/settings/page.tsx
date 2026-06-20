"use client";

import { useState } from "react";
import { useAppSettings } from "@/context/AppSettingsContext";
import { MICRO_CATEGORIES_BY_MACRO } from "@/lib/content";
import { MacroCategory } from "@/lib/types";
import ToggleSwitch from "@/components/ToggleSwitch";
import PinModal from "@/components/PinModal";

const BUDGET_PRESETS = [
  { label: "No limit", value: null },
  { label: "3 hrs/wk", value: 180 },
  { label: "1.5 hrs/wk", value: 90 },
  { label: "45 min/wk", value: 45 },
];

export default function SettingsPage() {
  const {
    mode,
    requestSwitchToParent,
    shortFormEnabled,
    setShortFormEnabled,
    categoryBudgets,
    toggleMacroCategory,
    setMacroBudget,
    kidAllowedMicroCategories,
    setKidAllowedMicroCategories,
  } = useAppSettings();

  const [showPin, setShowPin] = useState(false);

  const isParent = mode === "parent";

  const toggleMicro = (micro: string) => {
    if (kidAllowedMicroCategories.includes(micro)) {
      setKidAllowedMicroCategories(
        kidAllowedMicroCategories.filter((c) => c !== micro)
      );
    } else {
      setKidAllowedMicroCategories([...kidAllowedMicroCategories, micro]);
    }
  };

  return (
    <div className="px-4 md:px-6 py-5 pb-20 md:pb-5 max-w-[640px]">
      <h1 className="text-[20px] font-semibold text-ink mb-1">Settings</h1>
      <p className="text-[13px] text-ink-secondary mb-6">
        {isParent
          ? "You're in parent mode. Changes here apply to kid mode immediately."
          : "You're in kid mode. These are the limits your parent has set — ask them to change anything here."}
      </p>

      {!isParent && (
        <div className="mb-6 border border-border-soft rounded-xl p-4 bg-app-bg">
          <p className="text-[13px] text-ink-secondary mb-3">
            Want to change a setting? A parent needs to enter the PIN.
          </p>
          <button
            onClick={() => setShowPin(true)}
            className="text-[13px] font-medium rounded-full px-4 py-2 bg-deep text-white hover:opacity-90"
          >
            Switch to parent mode
          </button>
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-[14px] font-medium text-ink mb-3">
          Short-form content
        </h2>
        <div className="flex items-center justify-between border border-border-soft rounded-xl p-4">
          <div>
            <p className="text-[13px] font-medium text-ink">
              Show short-form videos
            </p>
            <p className="text-[12px] text-ink-tertiary mt-0.5">
              Turn off to remove all quick clips and only show deep content.
            </p>
          </div>
          <ToggleSwitch
            checked={shortFormEnabled}
            onChange={() => isParent && setShortFormEnabled(!shortFormEnabled)}
            disabled={!isParent}
            label="Show short-form videos"
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-[14px] font-medium text-ink mb-3">
          Macro categories
        </h2>
        <p className="text-[12px] text-ink-tertiary mb-3">
          Turning a category off hides it everywhere, for everyone. Weekly
          limits only apply in kid mode.
        </p>
        <div className="flex flex-col gap-3">
          {categoryBudgets.map((budget) => (
            <div
              key={budget.macroCategory}
              className="border border-border-soft rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-medium text-ink">
                  {budget.macroCategory}
                </p>
                <ToggleSwitch
                  checked={budget.enabled}
                  onChange={() =>
                    isParent && toggleMacroCategory(budget.macroCategory)
                  }
                  disabled={!isParent}
                  label={`Enable ${budget.macroCategory}`}
                />
              </div>
              {budget.enabled && (
                <div className="flex flex-wrap gap-2">
                  {BUDGET_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      disabled={!isParent}
                      onClick={() =>
                        setMacroBudget(budget.macroCategory, preset.value)
                      }
                      className={`text-[12px] font-medium rounded-full px-3 py-1.5 border ${
                        budget.weeklyMinutesLimit === preset.value
                          ? "bg-deep-bg border-deep-text/30 text-deep-text"
                          : "border-border text-ink-secondary"
                      } ${!isParent ? "opacity-50 cursor-not-allowed" : "hover:bg-app-bg"}`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-[14px] font-medium text-ink mb-3">
          Kid&apos;s micro categories
        </h2>
        <p className="text-[12px] text-ink-tertiary mb-3">
          Within enabled macro categories, choose which specific topics show
          up in kid mode.
        </p>
        <div className="flex flex-col gap-4">
          {(Object.keys(MICRO_CATEGORIES_BY_MACRO) as MacroCategory[]).map(
            (macro) => {
              const budget = categoryBudgets.find(
                (b) => b.macroCategory === macro
              );
              return (
                <div key={macro}>
                  <p className="text-[12px] font-medium text-ink-tertiary uppercase tracking-wide mb-2">
                    {macro}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {MICRO_CATEGORIES_BY_MACRO[macro].map((micro) => {
                      const checked = kidAllowedMicroCategories.includes(micro);
                      const macroDisabled = !budget?.enabled;
                      return (
                        <button
                          key={micro}
                          disabled={!isParent || macroDisabled}
                          onClick={() => toggleMicro(micro)}
                          className={`text-[12px] font-medium rounded-full px-3 py-1.5 border ${
                            checked
                              ? "bg-deep-bg border-deep-text/30 text-deep-text"
                              : "border-border text-ink-secondary"
                          } ${
                            !isParent || macroDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-app-bg"
                          }`}
                        >
                          {micro}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-[14px] font-medium text-ink mb-3">
          Content moderation
        </h2>
        <div className="border border-border-soft rounded-xl p-4">
          <p className="text-[13px] text-ink-secondary leading-relaxed">
            Flagged content is automatically hidden in kid mode and
            permanently blurred in parent mode — it can never be unblurred,
            even by a parent. This demo uses a small set of manually tagged
            items to show how the system behaves.
          </p>
        </div>
      </section>

      {showPin && (
        <PinModal
          onSuccess={async (pin) => {
            const ok = await requestSwitchToParent(pin);
            if (ok) setShowPin(false);
            return ok;
          }}
          onCancel={() => setShowPin(false)}
        />
      )}
    </div>
  );
}
