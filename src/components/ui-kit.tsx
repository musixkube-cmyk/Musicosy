"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShell } from "../state/app-shell";
import {
  formatTime,
  type MediaObject,
  type HappeningItem,
  type ActivityItem,
  type SoundItem,
  type FollowerItem,
  CREATORS,
} from "../data/demo";

export function Icon({
  name,
  size = 20,
  filled = false,
  className = "",
}: {
  name: string;
  size?: number;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined leading-none ${className}`}
      style={{
        fontSize: `${size}px`,
        fontVariationSettings: filled ? "'FILL' 1" : undefined,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-surface-container-highest pb-4">
      <div>
        <p className="font-mono-data text-mono-data uppercase tracking-widest text-primary-container">
          {eyebrow}
        </p>
        <h1 className="mt-1.5 font-headline-md text-headline-md text-on-surface">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl font-body-sm text-body-sm text-on-surface-variant">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface">
        {title}
      </h2>
      {hint ? (
        <span className="font-mono-data text-mono-data text-on-surface-variant">{hint}</span>
      ) : null}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "ghost",
  icon,
}: {
  children?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline";
  icon?: string;
}) {
  const styles = {
    primary: "bg-primary-container text-on-primary-container hover:opacity-90",
    ghost: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
    outline:
      "border border-surface-container-highest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high",
  }[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 font-label-caps text-label-caps uppercase tracking-widest transition-all active:scale-95 ${styles}`}
    >
      {icon ? <Icon name={icon} size={18} /> : null}
      {children}
    </button>
  );
}

/** Object action cluster — local, never leaves the route. */
export function ObjectActions({ object }: { object: MediaObject }) {
  const { loved, saved, toggleLove, toggleSave, addToQueue, focusObject, openOverlay } = useShell();
  return (
    <div className="flex items-center gap-1 text-on-surface-variant">
      <button
        type="button"
        aria-label="Love"
        onClick={() => toggleLove(object)}
        className={`rounded-lg p-2 transition-colors hover:bg-surface-container-highest ${
          loved[object.objectId] ? "text-primary-container" : ""
        }`}
      >
        <Icon name="favorite" size={18} filled={!!loved[object.objectId]} />
      </button>
      <button
        type="button"
        aria-label="Note"
        onClick={() => focusObject(object, "notes")}
        className="rounded-lg p-2 transition-colors hover:bg-surface-container-highest"
      >
        <Icon name="chat_bubble" size={18} />
      </button>
      <button
        type="button"
        aria-label="Resing"
        onClick={() => openOverlay("resing")}
        className="rounded-lg p-2 transition-colors hover:bg-surface-container-highest"
      >
        <Icon name="cached" size={18} />
      </button>
      <button
        type="button"
        aria-label="Save"
        onClick={() => toggleSave(object)}
        className={`rounded-lg p-2 transition-colors hover:bg-surface-container-highest ${
          saved[object.objectId] ? "text-primary-container" : ""
        }`}
      >
        <Icon name="bookmark" size={18} filled={!!saved[object.objectId]} />
      </button>
      <button
        type="button"
        aria-label="Add to queue"
        onClick={() => addToQueue(object)}
        className="rounded-lg p-2 transition-colors hover:bg-surface-container-highest"
      >
        <Icon name="queue_music" size={18} />
      </button>
      <button
        type="button"
        aria-label="Share"
        onClick={() => openOverlay("share")}
        className="rounded-lg p-2 transition-colors hover:bg-surface-container-highest"
      >
        <Icon name="share" size={18} />
      </button>
    </div>
  );
}

export function MediaCard({ object }: { object: MediaObject }) {
  const { playObject, focusObject, active, isPlaying } = useShell();
  const isActive = active?.objectId === object.objectId;
  return (
    <article className="group flex flex-col gap-3 rounded-xl border border-surface-container-highest bg-surface-container-low p-3 transition-colors hover:bg-surface-container">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <img
          src={object.artwork}
          alt={`${object.title} by ${object.creator}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => playObject(object, object.live ? "chat" : "notes")}
          aria-label={`Play ${object.title}`}
          className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container opacity-0 shadow-[0_0_15px_rgba(255,87,34,0.35)] transition-all group-hover:opacity-100 active:scale-90"
        >
          <Icon name={isActive && isPlaying ? "pause" : "play_arrow"} size={24} filled />
        </button>
        {object.live ? (
          <span className="absolute left-2 top-2 rounded bg-primary-container px-2 py-1 font-mono-data text-mono-data uppercase text-on-primary-container">
            Live
          </span>
        ) : null}
      </div>
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => focusObject(object, "details")}
          className="min-w-0 text-left"
        >
          <h3 className="truncate font-headline-sm text-headline-sm text-on-surface">
            {object.title}
          </h3>
          <p className="truncate font-mono-data text-mono-data text-on-surface-variant">
            {object.creator}
          </p>
        </button>
        <span className="shrink-0 font-mono-data text-mono-data text-on-surface-variant">
          {object.live ? "LIVE" : formatTime(object.duration)}
        </span>
      </div>
      <ObjectActions object={object} />
    </article>
  );
}

export function RowItem({ object, index }: { object: MediaObject; index: number }) {
  const { playObject, active } = useShell();
  const isActive = active?.objectId === object.objectId;
  return (
    <div
      className={`flex items-center gap-4 border-b border-surface-container-highest px-3 py-3 transition-colors hover:bg-surface-container ${
        isActive ? "bg-surface-container" : ""
      }`}
    >
      <span className="w-6 font-mono-data text-mono-data text-on-surface-variant">
        {String(index + 1).padStart(2, "0")}
      </span>
      <button type="button" onClick={() => playObject(object)} aria-label={`Play ${object.title}`}>
        <img
          src={object.artwork}
          alt=""
          loading="lazy"
          className="h-10 w-10 rounded border border-surface-container-highest object-cover"
        />
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={`truncate font-body-sm text-body-sm ${
            isActive ? "text-primary-container" : "text-on-surface"
          }`}
        >
          {object.title}
        </p>
        <p className="truncate font-mono-data text-mono-data text-on-surface-variant">
          {object.creator}
        </p>
      </div>
      <span className="hidden font-mono-data text-mono-data text-on-surface-variant md:block">
        {object.genre ?? humanType(object.objectType)}
      </span>
      <ObjectActions object={object} />
    </div>
  );
}

export function TileLink({
  to,
  icon,
  label,
  hint,
}: {
  to: string;
  icon: string;
  label: string;
  hint: string;
}) {
  return (
    <Link
      href={to}
      className="flex flex-col gap-2 rounded-xl border border-surface-container-highest bg-surface-container-low p-4 transition-colors hover:bg-surface-container"
    >
      <Icon name={icon} size={22} className="text-primary-container" />
      <span className="font-headline-sm text-headline-sm text-on-surface">{label}</span>
      <span className="font-mono-data text-mono-data text-on-surface-variant">{hint}</span>
    </Link>
  );
}

/** Active-link helper for the top rail. */
export function useIsActive(href: string, exact = false) {
  const pathname = usePathname();
  if (exact || href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/* ============================================================
   RAILS — horizontal scroll rows (mobile-first 9:16 pattern).
   On mobile these scroll horizontally with snap; on desktop
   they become grids. Each rail card is a portable component
   that links to its canonical destination.
   ============================================================ */

export function Rail({
  title,
  hint,
  href,
  children,
}: {
  title: string;
  hint?: string;
  href?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-8">
      <SectionHeader title={title} hint={hint} />
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 md:grid md:grid-cols-3 md:overflow-visible xl:grid-cols-4 xl:gap-4">
        {children}
      </div>
      {href ? (
        <Link
          href={href}
          className="mt-2 inline-flex items-center gap-1 font-mono-data text-mono-data uppercase text-primary-container hover:opacity-80"
        >
          See all <Icon name="arrow_forward" size={14} />
        </Link>
      ) : null}
    </section>
  );
}

/** Square media rail card — track / episode / release */
export function RailCard({ object }: { object: MediaObject }) {
  const { playObject, focusObject, active, isPlaying } = useShell();
  const isActive = active?.objectId === object.objectId;
  return (
    <Link
      href={`/app/music/${object.slug}`}
      className="group flex w-[140px] shrink-0 flex-col gap-2 md:w-auto"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl border border-surface-container-highest">
        <img
          src={object.artwork}
          alt={`${object.title} by ${object.creator}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            playObject(object, object.live ? "chat" : "notes");
          }}
          aria-label={`Play ${object.title}`}
          className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-on-primary-container opacity-0 shadow-[0_0_15px_rgba(255,87,34,0.35)] transition-all group-hover:opacity-100 active:scale-90"
        >
          <Icon name={isActive && isPlaying ? "pause" : "play_arrow"} size={20} filled />
        </button>
        {object.live ? (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-primary-container px-2 py-0.5 font-mono-data text-[9px] uppercase text-on-primary-container">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-on-primary-container" />
            Live
          </span>
        ) : null}
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          focusObject(object, "details");
        }}
        className="min-w-0 text-left"
      >
        <p className="truncate font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container">
          {object.title}
        </p>
        <p className="truncate font-mono-data text-mono-data text-on-surface-variant">
          {object.creator}
        </p>
      </button>
    </Link>
  );
}

/** Landscape video rail card — 16:9 */
export function VideoRailCard({ object }: { object: MediaObject }) {
  const { playObject, focusObject, active, isPlaying } = useShell();
  const isActive = active?.objectId === object.objectId;
  return (
    <Link
      href={`/app/music/${object.slug}`}
      className="group flex w-[220px] shrink-0 flex-col gap-2 md:w-auto"
    >
      <div className="relative aspect-video overflow-hidden rounded-xl border border-surface-container-highest">
        <img
          src={object.landscape ?? object.artwork}
          alt={`${object.title} by ${object.creator}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            playObject(object, "notes");
          }}
          aria-label={`Play ${object.title}`}
          className="absolute inset-0 grid place-items-center"
        >
          <span
            className={`grid h-11 w-11 place-items-center rounded-full bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(255,87,34,0.4)] transition-all active:scale-90 ${
              isActive && isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <Icon name={isActive && isPlaying ? "pause" : "play_arrow"} size={24} filled />
          </span>
        </button>
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 font-mono-data text-[10px] text-on-surface">
          {formatTime(object.duration)}
        </span>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          focusObject(object, "details");
        }}
        className="min-w-0 text-left"
      >
        <p className="truncate font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container">
          {object.title}
        </p>
        <p className="truncate font-mono-data text-mono-data text-on-surface-variant">
          {object.creator} · {object.plays}
        </p>
      </button>
    </Link>
  );
}

/** Creator rail card — circular avatar + follow */
export function CreatorRailCard({
  creator,
}: {
  creator: (typeof CREATORS)[number];
}) {
  const { followed, toggleFollow } = useShell();
  const isFollowing = followed[creator.handle];
  return (
    <Link
      href={`/app/creator/${creator.handle}`}
      className="group flex w-[140px] shrink-0 flex-col items-center gap-2 rounded-xl border border-surface-container-highest bg-surface-container-low p-3 text-center transition-colors hover:bg-surface-container md:w-auto"
    >
      <img
        src={creator.avatar}
        alt={creator.name}
        loading="lazy"
        className="h-16 w-16 rounded-full border border-surface-container-highest object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="min-w-0">
        <p className="truncate font-headline-sm text-headline-sm text-on-surface">
          {creator.name}
        </p>
        <p className="truncate font-mono-data text-mono-data text-on-surface-variant">
          {creator.role} · {creator.followers}
        </p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFollow(creator.handle);
        }}
        className={`rounded-lg border px-3 py-1 font-mono-data text-[10px] uppercase transition-colors ${
          isFollowing
            ? "border-primary-container text-primary-container"
            : "border-surface-container-highest text-on-surface-variant hover:text-on-surface"
        }`}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </Link>
  );
}

/** Live rail card — square with LIVE badge + viewer count */
export function LiveRailCard({ object }: { object: MediaObject }) {
  const { playObject } = useShell();
  return (
    <Link
      href={`/app/live/${object.slug}`}
      className="group flex w-[200px] shrink-0 flex-col gap-2 md:w-auto"
    >
      <div className="relative aspect-video overflow-hidden rounded-xl border border-surface-container-highest">
        <img
          src={object.artwork}
          alt={`${object.title} by ${object.creator}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-primary-container px-2 py-0.5 font-mono-data text-[9px] uppercase text-on-primary-container">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-on-primary-container" />
          Live
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            playObject(object, "chat");
          }}
          aria-label={`Join ${object.title}`}
          className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(255,87,34,0.35)] active:scale-90"
        >
          <Icon name="play_arrow" size={20} filled />
        </button>
      </div>
      <p className="truncate font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container">
        {object.title}
      </p>
      <p className="truncate font-mono-data text-mono-data text-on-surface-variant">
        {object.creator} · {object.plays}
      </p>
    </Link>
  );
}

/** Event rail card — landscape image + date/city */
export function EventRailCard({
  event,
}: {
  event: { slug: string; title: string; city: string; date: string; artwork: string };
}) {
  return (
    <Link
      href={`/app/event/${event.slug}`}
      className="group flex w-[240px] shrink-0 flex-col gap-2 overflow-hidden rounded-xl border border-surface-container-highest bg-surface-container-low md:w-auto"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={event.artwork}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 font-mono-data text-[10px] uppercase text-on-surface">
          {event.date}
        </div>
      </div>
      <div className="p-2">
        <p className="truncate font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container">
          {event.title}
        </p>
        <p className="truncate font-mono-data text-mono-data text-on-surface-variant">
          {event.city}
        </p>
      </div>
    </Link>
  );
}

/** Sound rail card — square + use count */
export function SoundRailCard({ sound }: { sound: SoundItem }) {
  return (
    <Link
      href={`/app/music/${sound.slug}`}
      className="group flex w-[120px] shrink-0 flex-col gap-2 md:w-auto"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl border border-surface-container-highest">
        <img
          src={sound.artwork}
          alt={sound.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 font-mono-data text-[9px] text-on-surface">
          <Icon name="graphic_eq" size={12} />
          {sound.uses}
        </span>
      </div>
      <p className="truncate font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container">
        {sound.title}
      </p>
      <p className="truncate font-mono-data text-mono-data text-on-surface-variant">
        {sound.creator}
      </p>
    </Link>
  );
}

/** Playlist rail card — square + item count */
export function PlaylistRailCard({
  playlist,
}: {
  playlist: { slug: string; title: string; count: number; artwork: string };
}) {
  return (
    <Link
      href={`/app/playlist/${playlist.slug}`}
      className="group flex w-[140px] shrink-0 flex-col gap-2 md:w-auto"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl border border-surface-container-highest">
        <img
          src={playlist.artwork}
          alt={playlist.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <p className="truncate font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container">
        {playlist.title}
      </p>
      <p className="font-mono-data text-mono-data text-on-surface-variant">
        {playlist.count} items
      </p>
    </Link>
  );
}

/** Happening-now rail card — mixed kinds */
export function HappeningRailCard({ item }: { item: HappeningItem }) {
  const kindIcon: Record<HappeningItem["kind"], string> = {
    live: "sensors",
    drop: "new_releases",
    post: "post_add",
    event: "event",
  };
  const kindLabel: Record<HappeningItem["kind"], string> = {
    live: "Live",
    drop: "Drop",
    post: "Post",
    event: "Event",
  };
  return (
    <Link
      href={item.href}
      className="group flex w-[220px] shrink-0 items-center gap-3 rounded-xl border border-surface-container-highest bg-surface-container-low p-3 transition-colors hover:bg-surface-container md:w-auto"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
        <img src={item.artwork} alt="" className="h-full w-full object-cover" />
        <span className="absolute left-1 top-1 rounded bg-black/70 px-1 py-0.5">
          <Icon name={kindIcon[item.kind]} size={12} className="text-primary-container" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono-data text-[10px] uppercase text-primary-container">
          {kindLabel[item.kind]} · {item.ago}
        </p>
        <p className="truncate font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container">
          {item.title}
        </p>
        <p className="truncate font-mono-data text-mono-data text-on-surface-variant">
          {item.meta}
        </p>
      </div>
    </Link>
  );
}

/** New follower rail card — avatar + mutual count */
export function FollowerRailCard({ follower }: { follower: FollowerItem }) {
  return (
    <Link
      href={`/app/creator/${follower.handle}`}
      className="group flex w-[200px] shrink-0 items-center gap-3 rounded-xl border border-surface-container-highest bg-surface-container-low p-3 transition-colors hover:bg-surface-container md:w-auto"
    >
      <img
        src={follower.avatar}
        alt={follower.name}
        loading="lazy"
        className="h-12 w-12 rounded-full border border-surface-container-highest object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container">
          {follower.name}
        </p>
        <p className="truncate font-mono-data text-mono-data text-on-surface-variant">
          @{follower.handle} · {follower.ago}
        </p>
        {follower.mutual ? (
          <p className="truncate font-mono-data text-[10px] text-primary-container">
            {follower.mutual} mutual
          </p>
        ) : null}
      </div>
    </Link>
  );
}

/** Recent activity rail card */
export function ActivityRailCard({ item }: { item: ActivityItem }) {
  const kindIcon: Record<ActivityItem["kind"], string> = {
    love: "favorite",
    note: "chat_bubble",
    resing: "cached",
    save: "bookmark",
    follow: "person_add",
    release: "new_releases",
    queue: "queue_music",
  };
  return (
    <Link
      href={item.href}
      className="group flex items-center gap-3 rounded-xl border border-surface-container-highest bg-surface-container-low p-3 transition-colors hover:bg-surface-container"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
        <Icon name={kindIcon[item.kind]} size={18} className="text-primary-container" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-body-sm text-body-sm text-on-surface">
          {item.text}
          {item.target ? (
            <span className="text-primary-container"> {item.target}</span>
          ) : null}
        </p>
        <p className="font-mono-data text-mono-data text-on-surface-variant">{item.ago}</p>
      </div>
      <Icon
        name="arrow_forward"
        size={16}
        className="text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100"
      />
    </Link>
  );
}

/** Continue card — resume listening/watching with progress bar */
export function ContinueCard({
  object,
  progress,
  label,
}: {
  object: MediaObject;
  progress: number;
  label: string;
}) {
  const { playObject } = useShell();
  return (
    <button
      type="button"
      onClick={() => playObject(object)}
      className="flex w-full items-center gap-4 rounded-xl border border-surface-container-highest bg-surface-container-low p-3 text-left transition-colors hover:bg-surface-container"
    >
      <img src={object.artwork} alt="" className="h-16 w-16 rounded object-cover" />
      <div className="min-w-0 flex-1">
        <p className="font-mono-data text-mono-data uppercase text-primary-container">{label}</p>
        <p className="truncate font-headline-sm text-headline-sm text-on-surface">
          {object.title}
        </p>
        <div className="mt-2 h-[2px] w-full bg-surface-container-highest">
          <div className="h-full bg-primary-container" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-1 font-mono-data text-mono-data text-on-surface-variant">
          {formatTime((progress / 100) * object.duration)} / {formatTime(object.duration)}
        </p>
      </div>
      <Icon name="play_arrow" size={26} filled className="text-primary-container" />
    </button>
  );
}

/** Convert internal object types to human labels a user would recognize. */
export function humanType(t: string): string {
  const map: Record<string, string> = {
    track: "Song",
    podcast_episode: "Podcast episode",
    video: "Video",
    live_stream: "Live stream",
    playlist: "Playlist",
    release: "Release",
    event: "Event",
    post: "Post",
    member_profile: "Profile",
    sound: "Sound",
  };
  return map[t] ?? t.replace("_", " ");
}
