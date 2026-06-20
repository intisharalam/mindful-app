"use client";

import { ContentItem } from "@/lib/types";
import FlaggedBlur from "@/components/FlaggedBlur";

function Ring({ progress, size = 12 }: { progress: number; size?: number }) {
  const r = size / 2 - 1.5;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(-90deg)" }}
      className="shrink-0"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeDasharray={circ}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

export default function VideoCard({
  item,
  onOpen,
}: {
  item: ContentItem;
  onOpen: (item: ContentItem) => void;
}) {
  const isDeep = item.type === "deep";

  if (item.flagged) {
    return (
      <div className="text-left">
        <FlaggedBlur size="grid" />
        <p className="text-[13px] font-medium text-ink-tertiary leading-snug line-clamp-2 mb-1">
          Content unavailable
        </p>
        <p className="text-[12px] text-ink-tertiary opacity-70">
          Flagged by moderation
        </p>
      </div>
    );
  }

  return (
    <button onClick={() => onOpen(item)} className="text-left group">
      <div
        className={`relative flex items-center justify-center mb-2 ${
          isDeep
            ? "h-[110px] rounded-xl bg-deep text-3xl"
            : "h-[78px] rounded-lg bg-friction-bg border border-dashed border-friction/40 text-2xl mx-2"
        }`}
      >
        <span className={isDeep ? "" : "opacity-80"}>{item.emoji}</span>
        <span
          className={`absolute bottom-1.5 right-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded ${
            isDeep
              ? "bg-black/70 text-white"
              : "bg-black/55 text-white flex items-center gap-1"
          }`}
        >
          {!isDeep && <Ring progress={0} size={9} />}
          {item.duration}
        </span>
      </div>
      <p
        className={`leading-snug line-clamp-2 mb-1 group-hover:text-deep ${
          isDeep
            ? "text-[13px] font-medium text-ink"
            : "text-[12px] font-normal text-ink-secondary mx-2"
        }`}
      >
        {item.title}
      </p>
      <p className={`text-[12px] text-ink-tertiary ${isDeep ? "" : "mx-2"}`}>
        {item.creator}
      </p>
    </button>
  );
}
