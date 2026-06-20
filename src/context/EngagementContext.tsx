"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";

interface EngagementState {
  streak: number;
  level: number;
  xp: number;
  xpPerLevel: number;
  toast: string | null;
  deepSeconds: number;
  shortSeconds: number;
  shortsBlocked: number;
  registerDeepComplete: (secondsSpent: number) => void;
  registerShortSkip: (secondsSpent: number) => "ok" | "interrupt";
  registerShortBlocked: () => void;
}

const EngagementContext = createContext<EngagementState | null>(null);

const XP_PER_LEVEL = 100;

interface RemoteStats {
  streak: number;
  level: number;
  xp: number;
  shortSkipsInRow: number;
  deepSeconds: number;
  shortSeconds: number;
  shortsBlocked: number;
}

export function EngagementProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();

  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [shortSkipsInRow, setShortSkipsInRow] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [deepSeconds, setDeepSeconds] = useState(0);
  const [shortSeconds, setShortSeconds] = useState(0);
  const [shortsBlocked, setShortsBlocked] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoadedRemote = useRef(false);

  // Load persisted stats once we know whether someone is logged in.
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      hasLoadedRemote.current = false;
      return;
    }
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        const s: RemoteStats | undefined = data.stats;
        if (s) {
          setStreak(s.streak);
          setLevel(s.level);
          setXp(s.xp);
          setShortSkipsInRow(s.shortSkipsInRow);
          setDeepSeconds(s.deepSeconds);
          setShortSeconds(s.shortSeconds);
          setShortsBlocked(s.shortsBlocked);
        }
        hasLoadedRemote.current = true;
      })
      .catch(() => {
        hasLoadedRemote.current = true;
      });
  }, [user, authLoading]);

  const persist = (next: Partial<RemoteStats>) => {
    if (!user) return;
    fetch("/api/stats", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    }).catch(() => {
      // Best-effort sync; local state remains the source of truth for this session either way.
    });
  };

  const fireToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const registerDeepComplete = (secondsSpent: number) => {
    const addedSeconds = Math.max(0, secondsSpent);
    const nextDeepSeconds = deepSeconds + addedSeconds;
    const nextStreak = streak + 1;
    let nextXp = xp + 35;
    let nextLevel = level;

    setDeepSeconds(nextDeepSeconds);
    setStreak(nextStreak);
    setShortSkipsInRow(0);

    if (nextXp >= XP_PER_LEVEL) {
      nextXp -= XP_PER_LEVEL;
      nextLevel = level + 1;
      setLevel(nextLevel);
      fireToast(`Level up — you're now level ${nextLevel}`);
    } else {
      fireToast("Streak +1 — that one counted");
    }
    setXp(nextXp);

    persist({
      deepSeconds: nextDeepSeconds,
      streak: nextStreak,
      shortSkipsInRow: 0,
      xp: nextXp,
      level: nextLevel,
    });
  };

  const registerShortSkip = (secondsSpent: number): "ok" | "interrupt" => {
    const addedSeconds = Math.max(0, secondsSpent);
    const nextShortSeconds = shortSeconds + addedSeconds;
    const nextSkipsInRow = shortSkipsInRow + 1;
    const interrupting = nextSkipsInRow >= 3;

    setShortSeconds(nextShortSeconds);
    setStreak(0);
    setShortSkipsInRow(interrupting ? 0 : nextSkipsInRow);

    persist({
      shortSeconds: nextShortSeconds,
      streak: 0,
      shortSkipsInRow: interrupting ? 0 : nextSkipsInRow,
    });

    return interrupting ? "interrupt" : "ok";
  };

  const registerShortBlocked = () => {
    const next = shortsBlocked + 1;
    setShortsBlocked(next);
    persist({ shortsBlocked: next });
  };

  return (
    <EngagementContext.Provider
      value={{
        streak,
        level,
        xp,
        xpPerLevel: XP_PER_LEVEL,
        toast,
        deepSeconds,
        shortSeconds,
        shortsBlocked,
        registerDeepComplete,
        registerShortSkip,
        registerShortBlocked,
      }}
    >
      {children}
    </EngagementContext.Provider>
  );
}

export function useEngagement() {
  const ctx = useContext(EngagementContext);
  if (!ctx) {
    throw new Error("useEngagement must be used within EngagementProvider");
  }
  return ctx;
}
