"use client";

import { useShell } from "@/state/app-shell";
import { ALL_OBJECTS, CREATORS, PLAYLISTS, TRACKS, formatTime } from "@/data/demo";
import { Icon, PageHeader, SectionHeader, RowItem } from "@/components/ui-kit";
import { useState } from "react";
import Link from "next/link";

const TABS = ["Playlists", "Saved", "Following", "History", "Downloads"];

export default function LibrarySurface() {
  const { saved, loved, followed } = useShell();
  const [tab, setTab] = useState("Playlists");

  const savedObjects = ALL_OBJECTS.filter((o) => saved[o.objectId]);
  const lovedObjects = ALL_OBJECTS.filter((o) => loved[o.objectId]);
  const followedCreators = CREATORS.filter((c) => followed[c.handle]);
  const recentlyPlayed = TRACKS.slice(0, 4);

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Collections"
        title="Library"
        description="Saved music, playlists, follows and downloads in one collection surface."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg border px-3 py-2 font-mono-data text-mono-data uppercase ${
              tab === t
                ? "border-primary-container text-primary-container"
                : "border-surface-container-highest text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Playlists" && (
        <section className="mb-7">
          <SectionHeader title="Your playlists" hint={`${PLAYLISTS.length} collections`} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {PLAYLISTS.map((p) => (
              <Link
                key={p.objectId}
                href="/library"
                className="group flex flex-col gap-2 rounded-xl border border-surface-container-highest bg-surface-container-low p-3"
              >
                <img
                  src={p.artwork}
                  alt=""
                  className="aspect-square w-full rounded object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <p className="truncate font-headline-sm text-headline-sm text-on-surface">
                  {p.title}
                </p>
                <p className="font-mono-data text-mono-data text-on-surface-variant">
                  {p.count} items
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {tab === "Saved" && (
        <section className="mb-7">
          <SectionHeader
            title="Saved objects"
            hint={`${savedObjects.length} saved · ${lovedObjects.length} loved`}
          />
          {savedObjects.length === 0 && lovedObjects.length === 0 ? (
            <div className="rounded-xl border border-surface-container-highest bg-surface-container-low p-8 text-center">
              <Icon
                name="bookmark"
                size={32}
                className="mx-auto mb-2 text-on-surface-variant"
              />
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Nothing saved yet. Tap the bookmark icon on any track to save it here.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-surface-container-highest bg-surface-container-low">
              {[...savedObjects, ...lovedObjects].map((o, i) => (
                <RowItem key={o.objectId + i} object={o} index={i} />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "Following" && (
        <section className="mb-7">
          <SectionHeader
            title="Followed creators"
            hint={`${followedCreators.length} followed`}
          />
          {followedCreators.length === 0 ? (
            <div className="rounded-xl border border-surface-container-highest bg-surface-container-low p-8 text-center">
              <Icon
                name="group"
                size={32}
                className="mx-auto mb-2 text-on-surface-variant"
              />
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                You aren't following anyone yet. Discover creators from the Discover surface.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {followedCreators.map((c) => (
                <div
                  key={c.handle}
                  className="flex flex-col items-center gap-2 rounded-xl border border-surface-container-highest bg-surface-container-low p-4 text-center"
                >
                  <img
                    src={c.avatar}
                    alt=""
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <p className="font-headline-sm text-headline-sm text-on-surface">{c.name}</p>
                  <p className="font-mono-data text-mono-data text-on-surface-variant">
                    {c.role} · {c.followers}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "History" && (
        <section className="mb-7">
          <SectionHeader title="Recently played" hint="Last 24h" />
          <div className="rounded-xl border border-surface-container-highest bg-surface-container-low">
            {recentlyPlayed.map((o, i) => (
              <RowItem key={o.objectId} object={o} index={i} />
            ))}
          </div>
        </section>
      )}

      {tab === "Downloads" && (
        <section className="mb-7">
          <SectionHeader title="Downloaded for offline" hint="2 items" />
          <div className="rounded-xl border border-surface-container-highest bg-surface-container-low">
            {TRACKS.slice(0, 2).map((o, i) => (
              <div
                key={o.objectId}
                className="flex items-center gap-4 border-b border-surface-container-highest px-3 py-3 last:border-0"
              >
                <span className="w-6 font-mono-data text-mono-data text-on-surface-variant">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <img
                  src={o.artwork}
                  alt=""
                  className="h-10 w-10 rounded border border-surface-container-highest object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-body-sm text-body-sm text-on-surface">{o.title}</p>
                  <p className="truncate font-mono-data text-mono-data text-on-surface-variant">
                    {o.creator}
                  </p>
                </div>
                <span className="font-mono-data text-mono-data text-on-surface-variant">
                  {formatTime(o.duration)} · 4.2 MB
                </span>
                <Icon name="check_circle" size={18} className="text-primary-container" filled />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
