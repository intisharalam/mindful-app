"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/videos", label: "Videos", icon: VideosIcon },
  { href: "/library", label: "Library", icon: LibraryIcon },
  { href: "/games", label: "Games", icon: GamesIcon },
  { href: "/more", label: "More", icon: MoreIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border-soft flex items-stretch z-40 pb-[env(safe-area-inset-bottom)]">
      {TABS.map((tab) => {
        const active =
          tab.href === "/more"
            ? ["/settings", "/analytics", "/subscriptions", "/more"].includes(pathname)
            : pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2"
          >
            <tab.icon active={active} />
            <span
              className={`text-[10px] ${
                active ? "text-ink font-medium" : "text-ink-tertiary"
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 11l9-8 9 8M5 10v10h14V10"
        stroke={active ? "#0F0F0F" : "#909090"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VideosIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="14" height="14" rx="2" stroke={active ? "#0F0F0F" : "#909090"} strokeWidth="2" />
      <path d="M17 9l4-2v10l-4-2" stroke={active ? "#0F0F0F" : "#909090"} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function LibraryIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"
        stroke={active ? "#0F0F0F" : "#909090"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GamesIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="20" height="11" rx="5" stroke={active ? "#0F0F0F" : "#909090"} strokeWidth="2" />
      <circle cx="8" cy="12.5" r="1.4" fill={active ? "#0F0F0F" : "#909090"} />
      <circle cx="16" cy="12.5" r="1.4" fill={active ? "#0F0F0F" : "#909090"} />
    </svg>
  );
}

function MoreIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="12" r="1.6" fill={active ? "#0F0F0F" : "#909090"} />
      <circle cx="12" cy="12" r="1.6" fill={active ? "#0F0F0F" : "#909090"} />
      <circle cx="19" cy="12" r="1.6" fill={active ? "#0F0F0F" : "#909090"} />
    </svg>
  );
}
