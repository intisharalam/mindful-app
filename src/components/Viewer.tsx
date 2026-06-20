"use client";

import { useEffect, useRef, useState } from "react";
import { ContentItem } from "@/lib/types";

const WAIT_SECONDS = 3;

function Ring({ progress, size = 20 }: { progress: number; size?: number }) {
  const r = size / 2 - 2;
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
        stroke="#E8C3AE"
        strokeWidth="2.5"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#B45309"
        strokeWidth="2.5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.1s linear" }}
      />
    </svg>
  );
}

export default function Viewer({
  item,
  onClose,
  onDeepComplete,
  onShortSkip,
}: {
  item: ContentItem;
  onClose: () => void;
  onDeepComplete: (secondsSpent: number) => void;
  onShortSkip: (secondsSpent: number) => void;
}) {
  const isDeep = item.type === "deep";
  const [remaining, setRemaining] = useState(WAIT_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const openedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    openedAtRef.current = Date.now();
  }, [item]);

  useEffect(() => {
    if (isDeep) return;
    setRemaining(WAIT_SECONDS);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 0.1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [item, isDeep]);

  const canSkip = isDeep || remaining <= 0;

  const elapsedSeconds = () => (Date.now() - openedAtRef.current) / 1000;

  const handlePrimaryAction = () => {
    if (isDeep) {
      onDeepComplete(elapsedSeconds());
    } else {
      onShortSkip(elapsedSeconds());
    }
    onClose();
  };

  const handleClose = () => {
    if (!isDeep) {
      onShortSkip(elapsedSeconds());
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl w-full max-w-[420px] p-7 relative border border-border-soft"
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-app-bg flex items-center justify-center hover:bg-border-soft"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="#0F0F0F"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div
          className={`h-[120px] rounded-xl mb-4 flex items-center justify-center text-4xl ${
            isDeep ? "bg-deep" : "bg-friction-bg"
          }`}
        >
          {item.emoji}
        </div>

        <h2 className="text-[18px] font-semibold leading-snug mb-1.5 text-ink">
          {item.title}
        </h2>
        <p className="text-[12px] text-ink-tertiary mb-3.5">
          {item.creator} · {item.duration}
        </p>
        <p className="text-[14px] leading-relaxed text-ink-secondary mb-5">
          {item.body}
        </p>

        <div className="flex items-center gap-2.5">
          {isDeep ? (
            <button
              onClick={handlePrimaryAction}
              className="text-[14px] font-medium rounded-full px-5 py-2.5 bg-deep text-white hover:opacity-90"
            >
              Mark as read · +1 streak
            </button>
          ) : (
            <>
              <button
                disabled={!canSkip}
                onClick={handlePrimaryAction}
                className={`text-[14px] font-medium rounded-full px-5 py-2.5 ${
                  canSkip
                    ? "bg-friction text-white hover:opacity-90"
                    : "bg-app-bg text-ink-tertiary cursor-not-allowed"
                }`}
              >
                {canSkip ? "Skip" : `Wait ${Math.ceil(remaining)}s`}
              </button>
              {!canSkip && <Ring progress={1 - remaining / WAIT_SECONDS} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
