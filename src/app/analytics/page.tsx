"use client";

import StatsHero from "@/components/StatsHero";
import { useEngagement } from "@/context/EngagementContext";

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  if (minutes === 0) return `${seconds}s`;
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return remMinutes > 0 ? `${hours}h ${remMinutes}m` : `${hours}h`;
}

export default function AnalyticsPage() {
  const {
    deepSeconds,
    shortSeconds,
    streak,
    level,
    xp,
    xpPerLevel,
    shortsBlocked,
  } = useEngagement();

  const totalSeconds = deepSeconds + shortSeconds;

  return (
    <div className="px-4 md:px-6 py-5 pb-20 md:pb-5 max-w-[720px]">
      <h1 className="text-[20px] font-semibold text-ink mb-1">Analytics</h1>
      <p className="text-[13px] text-ink-secondary mb-6">
        Your streak, level, and time breakdown — tracked across deep and
        short-form content.
      </p>

      <StatsHero
        deepSeconds={deepSeconds}
        shortSeconds={shortSeconds}
        streak={streak}
        level={level}
        shortsBlocked={shortsBlocked}
      />

      <section className="mb-8">
        <h2 className="text-[14px] font-medium text-ink mb-3">
          Level progress
        </h2>
        <div className="border border-border-soft rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] text-ink-secondary">Level {level}</p>
            <p className="text-[12px] text-ink-tertiary">
              {xp} / {xpPerLevel} xp to next level
            </p>
          </div>
          <div className="h-2 rounded-full bg-app-bg overflow-hidden">
            <div
              className="h-full bg-deep rounded-full transition-all"
              style={{ width: `${Math.min(100, (xp / xpPerLevel) * 100)}%` }}
            />
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-[14px] font-medium text-ink mb-3">
          Time breakdown
        </h2>
        <div className="border border-border-soft rounded-xl p-4">
          {totalSeconds === 0 ? (
            <p className="text-[13px] text-ink-tertiary">
              No sessions tracked yet. Open a video, book, or game to start
              building your stats.
            </p>
          ) : (
            <>
              <div className="flex h-3 rounded-full overflow-hidden mb-3 bg-app-bg">
                <div
                  className="bg-deep"
                  style={{ width: `${(deepSeconds / totalSeconds) * 100}%` }}
                />
                <div
                  className="bg-friction"
                  style={{ width: `${(shortSeconds / totalSeconds) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-deep-text font-medium">
                  Deep — {formatDuration(deepSeconds)}
                </span>
                <span className="text-friction-text font-medium">
                  Short-form — {formatDuration(shortSeconds)}
                </span>
              </div>
            </>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-[14px] font-medium text-ink mb-3">
          Friction in action
        </h2>
        <div className="border border-border-soft rounded-xl p-4">
          <p className="text-[13px] text-ink-secondary leading-relaxed">
            {shortsBlocked === 0
              ? "Skip 3 short-form items in a row to trigger the focus interrupt — it hasn't fired yet this session."
              : `The focus interrupt has stepped in ${shortsBlocked} time${
                  shortsBlocked === 1 ? "" : "s"
                } this session, nudging you toward deeper content after a short-form streak.`}
          </p>
        </div>
      </section>
    </div>
  );
}
