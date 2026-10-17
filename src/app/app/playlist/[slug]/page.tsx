"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { PLAYLISTS, TRACKS, findPlaylist, formatTime } from "@/data/demo";
import {
  Icon,
  PageHeader,
  PlaylistRailCard,
  RowItem,
  SectionHeader,
} from "@/components/ui-kit";
import { useShell } from "@/state/app-shell";

export default function PlaylistPage() {
  const params = useParams<{ slug: string }>();
  const { playObject, focusObject, addToQueue, active, isPlaying } = useShell();
  const [savedLocal, setSavedLocal] = useState(false);

  // Fallback to the first playlist keeps the route resilient to stale links.
  const playlist = findPlaylist(params.slug) ?? PLAYLISTS[0]!;
  const tracks = TRACKS;
  const related = PLAYLISTS.filter((p) => p.slug !== playlist.slug);

  const handlePlayAll = () => {
    const first = tracks[0];
    if (first) playObject(first);
  };
  const handleShuffle = () => {
    const random = tracks[Math.floor(Math.random() * tracks.length)];
    if (random) playObject(random);
  };
  const handleAddAllToQueue = () => {
    tracks.forEach((t) => addToQueue(t));
    const first = tracks[0];
    if (first) focusObject(first, "queue");
  };

  const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0);

  return (
    <div className="w-full">
      <PageHeader
        eyebrow={`Playlist · ${tracks.length} items · ${formatTime(totalDuration)}`}
        title={playlist.title}
        description="A curated set. Play all to start the session; the rest of the list sits in your queue. Shuffle for a new order."
      />

      <section className="mb-7 grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="flex flex-col gap-3">
          <img
            src={playlist.artwork}
            alt={`${playlist.title} artwork`}
            className="aspect-square w-full rounded-xl border border-surface-container-highest object-cover"
          />
          <button
            type="button"
            onClick={handlePlayAll}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary-container px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-primary-container transition-all hover:opacity-90 active:scale-95"
          >
            <Icon name="play_arrow" size={18} filled />
            Play all
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleShuffle}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-surface-container-highest px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant transition-colors hover:text-on-surface"
            >
              <Icon name="shuffle" size={18} />
              Shuffle
            </button>
            <button
              type="button"
              onClick={() => setSavedLocal((s) => !s)}
              aria-pressed={savedLocal}
              aria-label="Save playlist"
              className={`rounded-lg border px-3 py-2 transition-colors ${
                savedLocal
                  ? "border-primary-container text-primary-container"
                  : "border-surface-container-highest text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Icon name="bookmark" size={18} filled={savedLocal} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-container-highest bg-surface-container-low p-4">
            <p className="font-mono-data text-mono-data uppercase tracking-widest text-primary-container">
              {playlist.count} items · curated
            </p>
            <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
              Built for late sessions and long drives. Tap any row to play it next; queue stays
              intact when you move between surfaces.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAddAllToQueue}
                className="rounded-lg border border-surface-container-highest px-3 py-1.5 font-mono-data text-mono-data uppercase text-on-surface-variant transition-colors hover:text-on-surface"
              >
                Add all to queue
              </button>
              <button
                type="button"
                onClick={() => tracks[0] && focusObject(tracks[0], "queue")}
                className="rounded-lg border border-surface-container-highest px-3 py-1.5 font-mono-data text-mono-data uppercase text-on-surface-variant transition-colors hover:text-on-surface"
              >
                Open queue
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatBlock label="Items" value={String(tracks.length)} icon="list" />
            <StatBlock label="Duration" value={formatTime(totalDuration)} icon="schedule" />
            <StatBlock
              label="Status"
              value={isPlaying && active && tracks.some((t) => t.objectId === active.objectId) ? "Playing" : "Idle"}
              icon={isPlaying && active && tracks.some((t) => t.objectId === active.objectId) ? "graphic_eq" : "pause_circle"}
            />
          </div>
        </div>
      </section>

      <section className="mb-8">
        <SectionHeader title="Tracks" hint={`${tracks.length} items`} />
        <div className="overflow-hidden rounded-xl border border-surface-container-highest bg-surface-container-low">
          {tracks.map((t, i) => (
            <RowItem key={t.objectId} object={t} index={i} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionHeader title="Related playlists" hint="More like this" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
          {related.map((p) => (
            <PlaylistRailCard key={p.objectId} playlist={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatBlock({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-surface-container-highest bg-surface-container-low p-3">
      <span className="flex items-center gap-2 font-mono-data text-mono-data uppercase text-on-surface-variant">
        <Icon name={icon} size={16} className="text-primary-container" />
        {label}
      </span>
      <span className="font-headline-sm text-headline-sm text-on-surface">{value}</span>
    </div>
  );
}
