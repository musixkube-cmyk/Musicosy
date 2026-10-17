"use client";

import Link from "next/link";
import {
  CREATORS,
  DISCOVER_CREATORS,
  EPISODES,
  EVENTS,
  HAPPENING_NOW,
  LIVE_NOW,
  MUSIC_TODAY,
  NEW_FOLLOWERS,
  PLAYLISTS,
  POSTS,
  RECENT_ACTIVITY,
  SAVED_CONTENT,
  SOUNDS,
  TRACKS,
  TRENDING_SOUNDS,
  TRENDING_VIDEOS,
  VIDEOS,
  formatTime,
} from "@/data/demo";
import {
  Icon,
  PageHeader,
  SectionHeader,
  TileLink,
  Rail,
  RailCard,
  VideoRailCard,
  CreatorRailCard,
  LiveRailCard,
  EventRailCard,
  SoundRailCard,
  PlaylistRailCard,
  HappeningRailCard,
  FollowerRailCard,
  ActivityRailCard,
  ContinueCard,
} from "@/components/ui-kit";
import { useShell } from "@/state/app-shell";

export default function HomeSurface() {
  const { active, position, followed, toggleFollow, focusObject, playObject } = useShell();

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="IS-001 · Home integrated surface"
        title="Home"
        description="Everything continues where you left it. Moving between surfaces never stops your session."
      />

      {/* ─── FEED / NEW FOLLOWERS ─────────────────────────────────── */}
      <Rail title="New followers" hint="Last 24h" href="/app/notifications">
        {NEW_FOLLOWERS.map((f) => (
          <FollowerRailCard key={f.id} follower={f} />
        ))}
      </Rail>

      {/* ─── CONTINUE & QUICK ACCESS ──────────────────────────────── */}
      <section className="mb-8">
        <SectionHeader title="Continue" hint="Resume is durable" />
        <div className="grid gap-3 md:grid-cols-2">
          {active ? (
            <ContinueCard object={active} progress={(position / active.duration) * 100} label="Continue listening" />
          ) : (
            <button
              type="button"
              onClick={() => playObject(TRACKS[0]!)}
              className="flex items-center gap-4 rounded-xl border border-surface-container-highest bg-surface-container-low p-3 text-left transition-colors hover:bg-surface-container"
            >
              <div className="grid h-16 w-16 place-items-center rounded bg-surface-container-high">
                <Icon name="play_arrow" size={26} filled className="text-primary-container" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono-data text-mono-data uppercase text-primary-container">
                  Start listening
                </p>
                <p className="truncate font-headline-sm text-headline-sm text-on-surface">
                  Pick up where you left off
                </p>
                <p className="mt-1 font-mono-data text-mono-data text-on-surface-variant">
                  Press play on anything — your queue starts here
                </p>
              </div>
            </button>
          )}
          <ContinueCard object={EPISODES[0]!} progress={38} label="Continue watching" />
        </div>
      </section>

      {/* ─── CONTENT DISCOVERY RAILS ──────────────────────────────── */}

      <Rail title="New releases in your genres" hint="Updated 4m ago" href="/app/discover">
        {TRACKS.slice(0, 6).map((t) => (
          <RailCard key={t.objectId} object={t} />
        ))}
      </Rail>

      <Rail title="Live now" hint="Join without losing your queue" href="/app/live">
        {LIVE_NOW.map((l) => (
          <LiveRailCard key={l.objectId} object={l} />
        ))}
      </Rail>

      <Rail title="Music released today" hint="Fresh drops" href="/app/discover">
        {MUSIC_TODAY.map((t) => (
          <RailCard key={t.objectId} object={t} />
        ))}
      </Rail>

      <Rail title="Trending sounds" hint="Spiking now" href="/app/search">
        {TRENDING_SOUNDS.map((t) => (
          <RailCard key={t.objectId} object={t} />
        ))}
      </Rail>

      <Rail title="Trending video" hint="Most-watched 24h" href="/app/scroll">
        {TRENDING_VIDEOS.map((v) => (
          <VideoRailCard key={v.objectId} object={v} />
        ))}
      </Rail>

      <Rail title="Discover new creators" hint="Rising in your genres" href="/app/search">
        {DISCOVER_CREATORS.map((c) => (
          <CreatorRailCard key={c.handle} creator={c} />
        ))}
      </Rail>

      <Rail title="Happening now" hint="Live feed of your world" href="/app/scroll">
        {HAPPENING_NOW.map((h) => (
          <HappeningRailCard key={h.objectId} item={h} />
        ))}
      </Rail>

      <Rail title="Nearby musical events" hint="Within 50 miles" href="/app/discover">
        {EVENTS.map((e) => (
          <EventRailCard key={e.objectId} event={e} />
        ))}
      </Rail>

      {/* ─── PERSONAL COLLECTIONS ──────────────────────────────────── */}

      <Rail title="My playlists" hint="Personal context" href="/app/listen">
        {PLAYLISTS.map((p) => (
          <PlaylistRailCard key={p.objectId} playlist={p} />
        ))}
      </Rail>

      <section className="mb-8">
        <SectionHeader title="Recent activity" hint="Your world" href="/app/notifications" />
        <div className="flex flex-col gap-2">
          {RECENT_ACTIVITY.slice(0, 4).map((a) => (
            <ActivityRailCard key={a.id} item={a} />
          ))}
        </div>
      </section>

      {/* ─── SOCIAL & SUGGESTIONS ──────────────────────────────────── */}

      <Rail title="Saved content" hint="Quick resume" href="/app/listen">
        {SAVED_CONTENT.map((o) => (
          <RailCard key={o.objectId} object={o} />
        ))}
      </Rail>

      <Rail title="Suggested creators" hint="Based on your follows" href="/app/search">
        {CREATORS.map((c) => (
          <CreatorRailCard key={c.handle} creator={c} />
        ))}
      </Rail>

      {/* ─── ACTIONS HUB ──────────────────────────────────────────── */}
      <section className="mb-8">
        <SectionHeader title="Actions hub" hint="Create center" />
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
          <TileLink to="/app/create" icon="post_add" label="Create a post" hint="Draft-first composer" />
          <TileLink to="/app/create" icon="upload" label="Upload a song" hint="Transcode + rights check" />
          <TileLink to="/app/create" icon="mic" label="Start a recording" hint="Session capture" />
          <TileLink to="/app/listen" icon="playlist_add" label="Make a playlist" hint="Collections" />
          <TileLink to="/app/live" icon="sensors" label="Go live" hint="Broadcast health" />
          <TileLink to="/app/create" icon="folder_open" label="Open a project" hint="Workspace context" />
          <TileLink
            to="/app/create"
            icon="group_add"
            label="Invite a collaborator"
            hint="Roles + access"
          />
          <button
            type="button"
            onClick={() => focusObject(TRACKS[3]!, "activity")}
            className="flex flex-col gap-2 rounded-xl border border-surface-container-highest bg-surface-container-low p-4 text-left transition-colors hover:bg-surface-container"
          >
            <Icon name="history" size={22} className="text-primary-container" />
            <span className="font-headline-sm text-headline-sm text-on-surface">
              Recent activity
            </span>
            <span className="font-mono-data text-mono-data text-on-surface-variant">
              Opens the context rail
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
