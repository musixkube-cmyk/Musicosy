"use client";

import Link from "next/link";
import { useShell } from "../../state/app-shell";
import { Icon, useIsActive } from "../ui-kit";
import { CONVERSATIONS, NOTIFICATIONS } from "../../data/demo";
import { useCanvasToggle } from "@/app/app/layout";

const PRIMARY: { to: string; label: string; icon: string }[] = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/app/create", label: "Create", icon: "add_circle" },
  { to: "/app/scroll", label: "Scroll", icon: "swipe_vertical" },
  { to: "/app/discover", label: "Discover", icon: "explore" },
  { to: "/app/listen", label: "Listen", icon: "graphic_eq" },
  { to: "/app/podcast", label: "Podcast", icon: "podcasts" },
  { to: "/app/live", label: "Live", icon: "sensors" },
];

export function TopRail() {
  const { searchOpen, setSearchOpen, memberContext, setMemberContext } = useShell();
  const { light, toggle } = useCanvasToggle();
  const unreadInbox = CONVERSATIONS.reduce((n, c) => n + c.unread, 0);
  const unreadAlerts = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-rail-top-height items-center gap-4 border-b border-surface-container-highest bg-surface-container px-gutter">
      <Link href="/app/home" className="flex shrink-0 items-center gap-2" aria-label="MusicOSY home">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-primary-container font-mono-data text-mono-data font-bold text-on-primary-container">
          M
        </span>
        <span className="hidden font-headline-md text-headline-md tracking-tighter text-on-surface lg:block">
          MusicOSY
        </span>
      </Link>

      <button
        type="button"
        onClick={() => setSearchOpen(!searchOpen)}
        className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-surface-container-highest bg-surface-container-low px-3 text-on-surface-variant transition-colors hover:border-primary-container md:max-w-64"
      >
        <Icon name="search" size={16} />
        <span className="truncate font-label-caps text-label-caps uppercase tracking-widest">
          Search
        </span>
        <span className="ml-auto hidden font-mono-data text-mono-data md:block">/</span>
      </button>

      <nav className="hidden items-center gap-1 xl:flex">
        {PRIMARY.map((d) => (
          <TopNavLink key={d.label} {...d} />
        ))}
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        {/* Canvas toggle — switches between black and white canvas */}
        <button
          type="button"
          onClick={toggle}
          aria-label={light ? "Switch to dark canvas" : "Switch to light canvas"}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-container-highest text-on-surface-variant transition-colors hover:border-primary-container hover:text-primary-container"
        >
          <Icon name={light ? "dark_mode" : "light_mode"} size={18} filled />
        </button>

        <button
          type="button"
          onClick={() =>
            setMemberContext(memberContext === "personal" ? "workspace" : "personal")
          }
          className="hidden items-center gap-2 rounded-lg border border-surface-container-highest px-3 py-1.5 font-mono-data text-mono-data uppercase text-on-surface-variant transition-colors hover:text-on-surface md:flex"
        >
          <Icon name="swap_horiz" size={16} />
          {memberContext === "personal" ? "Personal" : "Studio Nine"}
        </button>

        <RailLink
          href="/app/messages"
          label="Messages"
          icon="forum"
          badge={unreadInbox > 0 ? unreadInbox : undefined}
        />
        <RailLink
          href="/app/notifications"
          label="Notifications"
          icon="notifications"
          badge={unreadAlerts > 0 ? unreadAlerts : undefined}
        />
        <Link href="/app/profile" aria-label="My profile" className="ml-1">
          <img
            src="https://picsum.photos/seed/member/80/80"
            alt="Your profile"
            className="h-8 w-8 rounded-full border border-surface-container-highest object-cover"
          />
        </Link>
        <RailLink href="/app/more" label="More" icon="more_horiz" />
      </div>
    </header>
  );
}

function TopNavLink({ to, label, icon }: { to: string; label: string; icon: string }) {
  const active = useIsActive(to, to === "/");
  return (
    <Link
      href={to}
      className={`flex h-rail-top-height items-center gap-2 border-b-2 px-3 font-label-caps text-label-caps uppercase tracking-widest transition-colors hover:bg-surface-bright hover:text-on-surface ${
        active
          ? "border-primary-container bg-surface-container-low font-bold text-primary-container"
          : "border-transparent text-on-surface-variant"
      }`}
    >
      <Icon name={icon} size={18} />
      {label}
    </Link>
  );
}

function RailLink({
  href,
  label,
  icon,
  badge,
}: {
  href: string;
  label: string;
  icon: string;
  badge?: number;
}) {
  const active = useIsActive(href, href === "/");
  return (
    <Link
      href={href}
      aria-label={label}
      className={`relative rounded-lg p-2 transition-colors hover:bg-surface-container-high hover:text-on-surface ${
        active ? "text-primary-container" : "text-on-surface-variant"
      }`}
    >
      <Icon name={icon} />
      {badge ? <Badge count={badge} /> : null}
    </Link>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-container px-1 font-mono-data text-[9px] font-bold text-on-primary-container">
      {count}
    </span>
  );
}

/** Reduced-width movement: Search, Home, Create, playback, Inbox and Profile stay reachable.
 *  When no track is active, the rail pins to the very bottom (bottom-0).
 *  When a track is playing, it lifts above the player bar (bottom-rail-bottom-height). */
export function MobileRail() {
  const { active } = useShell();
  const hasPlayer = Boolean(active);
  return (
    <nav
      className={`fixed inset-x-0 z-40 flex items-center justify-around border-t border-surface-container-highest bg-surface-container-low py-2 xl:hidden ${
        hasPlayer ? "bottom-rail-bottom-height" : "bottom-0"
      }`}
    >
      {PRIMARY.map((d) => (
        <MobileRailLink key={d.label} {...d} />
      ))}
    </nav>
  );
}

function MobileRailLink({ to, label, icon }: { to: string; label: string; icon: string }) {
  const active = useIsActive(to, to === "/");
  return (
    <Link
      href={to}
      aria-label={label}
      className={`flex flex-col items-center gap-0.5 px-2 ${
        active ? "text-primary-container" : "text-on-surface-variant"
      }`}
    >
      <Icon name={icon} size={20} />
      <span className="font-mono-data text-[9px] uppercase">{label}</span>
    </Link>
  );
}
