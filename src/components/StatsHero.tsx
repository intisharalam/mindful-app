"use client";

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  if (minutes === 0) return `${seconds}s`;
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return remMinutes > 0 ? `${hours}h ${remMinutes}m` : `${hours}h`;
}

export default function StatsHero({
  deepSeconds,
  shortSeconds,
  streak,
  level,
  shortsBlocked,
}: {
  deepSeconds: number;
  shortSeconds: number;
  streak: number;
  level: number;
  shortsBlocked: number;
}) {
  const totalSeconds = deepSeconds + shortSeconds;
  const deepRatio = totalSeconds > 0 ? Math.round((deepSeconds / totalSeconds) * 100) : null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-3 mb-6">
      <div className="bg-deep-bg rounded-xl p-5 border border-border-soft col-span-2 md:col-span-1">
        <p className="text-[12px] font-medium text-deep-text mb-1.5">
          Time this session
        </p>
        {totalSeconds === 0 ? (
          <p className="text-[15px] font-medium text-deep-text">
            Open something to start tracking
          </p>
        ) : (
          <>
            <p className="text-[22px] font-semibold text-deep-text mb-1">
              {formatDuration(deepSeconds)} deep
            </p>
            <p className="text-[12px] text-ink-secondary">
              vs {formatDuration(shortSeconds)} short-form
              {deepRatio !== null && (
                <> — {deepRatio}% of your time went to depth</>
              )}
            </p>
          </>
        )}
      </div>

      <StatTile label="streak" value={`${streak}`} accent />
      <StatTile label="level" value={`${level}`} />
      <StatTile label="shorts blocked" value={`${shortsBlocked}`} />
    </div>
  );
}

function StatTile({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-app-bg rounded-xl p-4 text-center border border-border-soft">
      <p className="text-[12px] text-ink-tertiary mb-1.5">{label}</p>
      <p
        className={`text-[22px] font-semibold ${
          accent ? "text-friction-text" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
