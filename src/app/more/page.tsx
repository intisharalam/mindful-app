"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useAppSettings } from "@/context/AppSettingsContext";

const LINKS = [
  { href: "/analytics", label: "Analytics", icon: AnalyticsIcon, desc: "Streak, level, and time tracking" },
  { href: "/subscriptions", label: "Subscriptions", icon: SubsIcon, desc: "Creators you follow" },
  { href: "/settings", label: "Settings", icon: SettingsIcon, desc: "Categories, PIN, parent controls" },
];

export default function MorePage() {
  const { user, logout } = useAuth();
  const { mode } = useAppSettings();

  return (
    <div className="px-4 md:px-6 py-5 pb-20 md:pb-5 max-w-[480px]">
      <h1 className="text-[20px] font-semibold text-ink mb-1">More</h1>
      <p className="text-[13px] text-ink-secondary mb-6">
        Account, analytics, and everything else.
      </p>

      <div className="border border-border-soft rounded-xl p-4 mb-6 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-deep text-white flex items-center justify-center text-[15px] font-bold shrink-0">
          {user ? user.displayName.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="flex-1 min-w-0">
          {user ? (
            <>
              <p className="text-[14px] font-medium text-ink">{user.displayName}</p>
              <p className="text-[12px] text-ink-tertiary">{user.email}</p>
            </>
          ) : (
            <p className="text-[13px] text-ink-secondary">Not signed in</p>
          )}
          <p className="text-[11px] text-deep-text font-medium mt-0.5 uppercase tracking-wide">
            {mode} mode
          </p>
        </div>
      </div>

      {!user && (
        <div className="flex gap-2 mb-6">
          <Link
            href="/login"
            className="flex-1 text-center text-[13px] font-medium rounded-full py-2.5 border border-border text-ink hover:bg-app-bg"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="flex-1 text-center text-[13px] font-medium rounded-full py-2.5 bg-deep text-white hover:opacity-90"
          >
            Sign up
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-2.5 mb-6">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 border border-border-soft rounded-xl p-3.5 hover:border-border"
          >
            <link.icon />
            <div>
              <p className="text-[13px] font-medium text-ink">{link.label}</p>
              <p className="text-[11px] text-ink-tertiary">{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {user && (
        <button
          onClick={() => logout()}
          className="text-[13px] font-medium text-friction-text hover:underline"
        >
          Log out
        </button>
      )}
    </div>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path d="M4 19h16M7 19v-6M12 19V7M17 19v-9" stroke="#2E5339" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SubsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        d="M4 5h16M4 12h16M4 19h10"
        stroke="#2E5339"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <circle cx="12" cy="12" r="3" stroke="#2E5339" strokeWidth="2" />
      <path
        d="M19.4 13a7.97 7.97 0 0 0 0-2l2-1.5-2-3.4-2.3.9a8 8 0 0 0-1.7-1l-.3-2.4H9.9l-.3 2.4a8 8 0 0 0-1.7 1l-2.3-.9-2 3.4L5.6 11a7.97 7.97 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9a8 8 0 0 0 1.7 1l.3 2.4h4.2l.3-2.4a8 8 0 0 0 1.7-1l2.3.9 2-3.4-2-1.5Z"
        stroke="#2E5339"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
