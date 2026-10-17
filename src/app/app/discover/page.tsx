"use client";

import { CREATORS, EVENTS, LIVE_NOW, TRACKS } from "@/data/demo";
import { MediaCard, PageHeader, SectionHeader } from "@/components/ui-kit";
import { useShell } from "@/state/app-shell";
import { useState } from "react";

const MOODS = ["Late night", "Focus", "Euphoric", "Rooms", "Analog", "Choral", "Motion"];
const GENRES = ["Ambient", "Electronic", "Indie", "Downtempo", "Neo-classical", "Alt"];

export default function DiscoverSurface() {
  const { followed, toggleFollow, focusObject } = useShell();
  const [mood, setMood] = useState<string | null>(null);

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Exploration"
        title="Discover"
        description="Browse by media, people, events, genre, mood and trend without leaving your session."
      />

      <section className="mb-7">
        <SectionHeader title="Moods" hint={mood ? `Selected: ${mood}` : "Pick one to filter"} />
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(mood === m ? null : m)}
              className={`rounded-lg border px-3 py-2 font-mono-data text-mono-data uppercase transition-colors ${
                mood === m
                  ? "border-primary-container bg-primary-container text-on-primary-container"
                  : "border-surface-container-highest text-on-surface-variant hover:border-primary-container hover:text-primary-container"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-7">
        <SectionHeader title="Genres" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {GENRES.map((g) => (
            <div
              key={g}
              className="rounded-xl border border-surface-container-highest bg-surface-container-low p-4"
            >
              <p className="font-headline-sm text-headline-sm text-on-surface">{g}</p>
              <p className="mt-1 font-mono-data text-mono-data text-on-surface-variant">
                {12 + g.length * 7} new today
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-7">
        <SectionHeader title="Trending sounds" hint="Last 24h" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {TRACKS.map((t) => (
            <MediaCard key={t.objectId} object={t} />
          ))}
        </div>
      </section>

      <section className="mb-7">
        <SectionHeader title="Happening now" />
        <div className="grid gap-4 md:grid-cols-2">
          {LIVE_NOW.map((l) => (
            <button
              key={l.objectId}
              type="button"
              onClick={() => focusObject(l, "chat")}
              className="flex items-center gap-4 rounded-xl border border-surface-container-highest bg-surface-container-low p-3 text-left hover:bg-surface-container"
            >
              <img src={l.artwork} alt="" className="h-14 w-14 rounded object-cover" />
              <div>
                <p className="font-mono-data text-mono-data uppercase text-primary-container">
                  Live room
                </p>
                <p className="font-headline-sm text-headline-sm text-on-surface">{l.title}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-7">
        <SectionHeader title="Discover new creators" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {CREATORS.map((c) => (
            <div
              key={c.handle}
              className="flex flex-col items-center gap-2 rounded-xl border border-surface-container-highest bg-surface-container-low p-4 text-center"
            >
              <img src={c.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
              <p className="font-headline-sm text-headline-sm text-on-surface">{c.name}</p>
              <p className="font-mono-data text-mono-data text-on-surface-variant">
                {c.role} · {c.followers}
              </p>
              <button
                type="button"
                onClick={() => toggleFollow(c.handle)}
                className={`mt-1 rounded-lg border px-3 py-1 font-mono-data text-mono-data uppercase ${
                  followed[c.handle]
                    ? "border-primary-container text-primary-container"
                    : "border-surface-container-highest text-on-surface-variant"
                }`}
              >
                {followed[c.handle] ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Events near you" />
        <div className="grid gap-3 md:grid-cols-3">
          {EVENTS.map((e) => (
            <article
              key={e.objectId}
              className="overflow-hidden rounded-xl border border-surface-container-highest bg-surface-container-low"
            >
              <img src={e.artwork} alt="" className="h-32 w-full object-cover" />
              <div className="p-3">
                <p className="font-mono-data text-mono-data uppercase text-primary-container">
                  {e.date} · {e.city}
                </p>
                <p className="font-headline-sm text-headline-sm text-on-surface">{e.title}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
