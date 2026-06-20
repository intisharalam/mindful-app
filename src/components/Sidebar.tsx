"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/videos", label: "Videos", icon: VideosIcon },
  { href: "/subscriptions", label: "Subscriptions", icon: SubsIcon },
];

const secondaryItems = [
  { href: "/library", label: "Library", icon: LibraryIcon, badge: "new" },
  { href: "/games", label: "Games", icon: GamesIcon, badge: "new" },
];

const settingsItem = { href: "/settings", label: "Settings", icon: SettingsIcon };
const analyticsItem = { href: "/analytics", label: "Analytics", icon: AnalyticsIcon };

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[170px] shrink-0 border-r border-border-soft py-3 hidden md:flex md:flex-col md:justify-between">
      <nav>
        {navItems.map((item) => (
          <NavRow
            key={item.href}
            href={item.href}
            label={item.label}
            Icon={item.icon}
            active={pathname === item.href}
          />
        ))}

        <div className="h-px bg-border-soft my-2.5 mx-4" />

        {secondaryItems.map((item) => (
          <NavRow
            key={item.href}
            href={item.href}
            label={item.label}
            Icon={item.icon}
            active={pathname === item.href}
            badge={item.badge}
          />
        ))}
      </nav>

      <nav>
        <div className="h-px bg-border-soft my-2.5 mx-4" />
        <NavRow
          href={analyticsItem.href}
          label={analyticsItem.label}
          Icon={analyticsItem.icon}
          active={pathname === analyticsItem.href}
        />
        <NavRow
          href={settingsItem.href}
          label={settingsItem.label}
          Icon={settingsItem.icon}
          active={pathname === settingsItem.href}
        />
      </nav>
    </aside>
  );
}

function NavRow({
  href,
  label,
  Icon,
  active,
  badge,
}: {
  href: string;
  label: string;
  Icon: (props: { active: boolean }) => React.JSX.Element;
  active: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3.5 px-5 py-2.5 mb-0.5 text-[13px] ${
        active
          ? "bg-app-bg rounded-r-full font-medium text-ink"
          : "text-ink hover:bg-app-bg rounded-r-full"
      }`}
    >
      <Icon active={active} />
      <span>{label}</span>
      {badge && (
        <span className="ml-auto text-[9px] font-medium bg-deep-bg text-deep-text px-1.5 py-0.5 rounded">
          {badge}
        </span>
      )}
    </Link>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 11l9-8 9 8M5 10v10h14V10"
        stroke={active ? "#0F0F0F" : "#606060"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VideosIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="14" height="14" rx="2" stroke={active ? "#0F0F0F" : "#606060"} strokeWidth="2" />
      <path d="M17 9l4-2v10l-4-2" stroke={active ? "#0F0F0F" : "#606060"} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function SubsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 5h16M4 12h16M4 19h10"
        stroke={active ? "#0F0F0F" : "#606060"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LibraryIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"
        stroke={active ? "#2E5339" : "#606060"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GamesIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="20" height="11" rx="5" stroke={active ? "#2E5339" : "#606060"} strokeWidth="2" />
      <circle cx="8" cy="12.5" r="1.4" fill={active ? "#2E5339" : "#606060"} />
      <circle cx="16" cy="12.5" r="1.4" fill={active ? "#2E5339" : "#606060"} />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={active ? "#0F0F0F" : "#606060"} strokeWidth="2" />
      <path
        d="M19.4 13a7.97 7.97 0 0 0 0-2l2-1.5-2-3.4-2.3.9a8 8 0 0 0-1.7-1l-.3-2.4H9.9l-.3 2.4a8 8 0 0 0-1.7 1l-2.3-.9-2 3.4L5.6 11a7.97 7.97 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9a8 8 0 0 0 1.7 1l.3 2.4h4.2l.3-2.4a8 8 0 0 0 1.7-1l2.3.9 2-3.4-2-1.5Z"
        stroke={active ? "#0F0F0F" : "#606060"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnalyticsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 19h16M7 19v-6M12 19V7M17 19v-9"
        stroke={active ? "#2E5339" : "#606060"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
