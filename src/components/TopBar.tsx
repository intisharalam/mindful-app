"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useAuth } from "@/context/AuthContext";
import PinModal from "@/components/PinModal";

export default function TopBar() {
  const { mode, switchToKid, requestSwitchToParent } = useAppSettings();
  const { user } = useAuth();
  const [showPin, setShowPin] = useState(false);

  const handleModeClick = () => {
    if (mode === "parent") {
      switchToKid();
    } else {
      setShowPin(true);
    }
  };

  return (
    <header className="flex items-center gap-4 px-4 md:px-6 h-14 border-b border-border-soft bg-surface sticky top-0 z-30">
      <div className="flex items-center gap-1.5 text-[18px] font-bold text-ink">
        Mindful
        <span className="text-deep">.</span>
      </div>

      <div className="flex-1 max-w-[420px] mx-auto hidden sm:flex items-center border border-border rounded-full px-4 py-1.5">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          className="mr-3 shrink-0"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
            stroke="#909090"
            strokeWidth="2"
          />
          <path
            d="M21 21l-4.3-4.3"
            stroke="#909090"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-[13px] text-ink-tertiary">Search</span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={handleModeClick}
          className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${
            mode === "kid"
              ? "bg-deep-bg text-deep-text border border-deep-text/20"
              : "border border-border text-ink-secondary hover:bg-app-bg"
          }`}
          title={mode === "kid" ? "Switch back to parent mode" : "Switch to kid mode"}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="9" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 9V6a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
          </svg>
          {mode === "kid" ? "Kid mode" : "Parent mode"}
        </button>

        <Link
          href="/more"
          className="w-7 h-7 rounded-full bg-deep text-white flex items-center justify-center text-[12px] font-bold"
          title={user ? user.displayName : "Account"}
        >
          {user ? user.displayName.charAt(0).toUpperCase() : "?"}
        </Link>
      </div>

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
    </header>
  );
}
