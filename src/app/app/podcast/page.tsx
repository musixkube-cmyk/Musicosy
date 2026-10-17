"use client";

import Link from "next/link";
import { useState } from "react";
import { EPISODES, CREATORS, TRACKS } from "@/data/demo";
import {
  Icon,
  PageHeader,
  SectionHeader,
  Rail,
  RailCard,
  CreatorRailCard,
} from "@/components/ui-kit";
import { useShell } from "@/state/app-shell";

const CATEGORIES = [
  { id: "music", label: "Music", icon: "music_note" },
  { id: "music-industry", label: "Music industry", icon: "business_center" },
  { id: "artist-interviews", label: "Artist interviews", icon: "mic" },
  { id: "songwriter", label: "Songwriter conversations", icon: "edit_note" },
  { id: "producer", label: "Producer conversations", icon: "tune" },
  { id: "dj-radio", label: "DJ and radio shows", icon: "radio" },
  { id: "live-performance", label: "Live performance", icon: "sensors" },
  { id: "culture", label: "Culture", icon: "public" },
  { id: "news", label: "News and commentary", icon: "newspaper" },
  { id: "comedy", label: "Comedy", icon: "sentiment_very_satisfied" },
  { id: "education", label: "Education", icon: "school" },
  { id: "business", label: "Business", icon: "trending_up" },
];

export default function PodcastSurface() {
  const { playObject, focusObject } = useShell();
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const featured = EPISODES[0]!;

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Audio shows · long-form"
        title="Podcast"
        description="Discovery, shows, episodes, live podcasts and collections — all in one audio surface."
      />

      {/* Hero featured podcast */}
      <section className="mb-8">
        <div className="overflow-hidden rounded-xl border border-surface-container-highest bg-surface-container-low">
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
            <img
              src={featured.artwork}
              alt={featured.title}
              className="h-32 w-32 shrink-0 rounded-xl border border-surface-container-highest object-cover md:h-40 md:w-40"
            />
            <div className="min-w-0 flex-1">
              <p className="font-mono-data text-mono-data uppercase text-primary-container">
                Featured podcast
              </p>
              <h2 className="mt-1 font-headline-md text-headline-md text-on-surface">
                {featured.title}
              </h2>
              <p className="mt-1 font-mono-data text-mono-data text-on-surface-variant">
                {featured.creator} · {featured.plays} plays
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => playObject(featured, "transcript")}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-container px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-primary-container active:scale-95"
                >
                  <Icon name="play_arrow" size={18} filled />
                  Play
                </button>
                <button
                  type="button"
                  onClick={() => focusObject(featured, "details")}
                  className="inline-flex items-center gap-2 rounded-lg border border-surface-container-highest px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-on-surface"
                >
                  <Icon name="info" size={18} />
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories grid */}
      <section className="mb-8">
        <SectionHeader title="Categories" hint="Browse by topic" />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}
              className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                activeCat === c.id
                  ? "border-primary-container bg-surface-container"
                  : "border-surface-container-highest bg-surface-container-low hover:bg-surface-container"
              }`}
            >
              <Icon name={c.icon} size={20} className="text-primary-container" />
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface">
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured episodes rail */}
      <Rail title="Featured episodes" hint="Hand-picked" href="/app/podcast">
        {EPISODES.map((e) => (
          <RailCard key={e.objectId} object={e} />
        ))}
      </Rail>

      {/* Trending episodes */}
      <Rail title="Trending episodes" hint="Most-played 24h" href="/app/podcast">
        {TRACKS.slice(1, 5).map((t) => (
          <RailCard key={t.objectId} object={t} />
        ))}
      </Rail>

      {/* Podcast hosts */}
      <Rail title="Podcast hosts" hint="Creators with shows" href="/app/search">
        {CREATORS.slice(0, 4).map((c) => (
          <CreatorRailCard key={c.handle} creator={c} />
        ))}
      </Rail>

      {/* New episodes */}
      <Rail title="New episodes" hint="Fresh drops" href="/app/podcast">
        {EPISODES.concat(TRACKS.slice(0, 2)).map((e) => (
          <RailCard key={e.objectId + e.slug} object={e} />
        ))}
      </Rail>

      {/* Live podcasts — empty state */}
      <section className="mb-8">
        <SectionHeader title="Live podcasts" hint="On air now" />
        <div className="flex items-center gap-4 rounded-xl border border-dashed border-surface-container-highest bg-surface-container-low p-6">
          <Icon name="sensors" size={28} className="text-on-surface-variant" />
          <div className="min-w-0 flex-1">
            <p className="font-headline-sm text-headline-sm text-on-surface">
              No live podcasts right now
            </p>
            <p className="font-mono-data text-mono-data text-on-surface-variant">
              Podcasts from creators you follow will appear here when they go live.
            </p>
          </div>
          <Link
            href="/app/live"
            className="rounded-lg border border-surface-container-highest px-3 py-2 font-mono-data text-mono-data uppercase text-on-surface-variant hover:text-on-surface"
          >
            See all live
          </Link>
        </div>
      </section>

      {/* Footer note */}
      <section className="mb-8">
        <div className="rounded-xl border border-surface-container-highest bg-surface-container-low p-4">
          <p className="font-mono-data text-mono-data uppercase text-primary-container">
            Podcast surface
          </p>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            Discovery, categories, browse by genre/mood/topic/language, show pages,
            episodes, video podcasts, live podcasts, replays, collections, editorial
            curation. Coming next: full show pages with episode lists, subscribe,
            download, and RSS distribution.
          </p>
        </div>
      </section>
    </div>
  );
}
