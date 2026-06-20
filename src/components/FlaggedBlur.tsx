"use client";

export default function FlaggedBlur({
  size = "grid",
}: {
  size?: "grid" | "large";
}) {
  return (
    <div
      className={`relative rounded-xl flex flex-col items-center justify-center text-center bg-app-bg border border-border ${
        size === "grid" ? "h-[110px] mb-2 px-2" : "h-[140px] mb-4 px-4"
      }`}
    >
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          backdropFilter: "blur(8px)",
          background:
            "repeating-linear-gradient(45deg, var(--color-border) 0, var(--color-border) 2px, transparent 2px, transparent 10px)",
        }}
      />
      <svg
        width={size === "grid" ? 18 : 22}
        height={size === "grid" ? 18 : 22}
        viewBox="0 0 24 24"
        fill="none"
        className="relative z-10 mb-1.5"
      >
        <path
          d="M12 9v4M12 16.5h.01M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
          stroke="var(--color-ink-secondary)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="relative z-10 text-[11px] font-medium text-ink-secondary leading-snug">
        Removed by moderation
      </p>
    </div>
  );
}
