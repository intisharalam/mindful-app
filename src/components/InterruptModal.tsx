"use client";

export default function InterruptModal({
  onPickDeep,
  onDismiss,
}: {
  onPickDeep: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-surface rounded-2xl max-w-[360px] p-7 text-center border-2 border-friction">
        <div className="text-[26px] mb-3">⏸️</div>
        <h2 className="text-[17px] font-semibold leading-snug mb-2.5 text-ink">
          You&apos;ve skipped 3 quick posts in a row
        </h2>
        <p className="text-[13px] text-ink-secondary leading-relaxed mb-5">
          Want to see something worth your time instead? Skipping shallow
          content fast resets your streak — deep content always builds it
          back up.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onPickDeep}
            className="bg-deep text-white text-[14px] font-medium rounded-full py-2.5 hover:opacity-90"
          >
            Show me something deeper
          </button>
          <button
            onClick={onDismiss}
            className="text-ink-tertiary text-[13px] py-1.5 hover:text-ink-secondary"
          >
            Keep scrolling anyway
          </button>
        </div>
      </div>
    </div>
  );
}
