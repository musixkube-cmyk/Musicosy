"use client";

import { TRACKS, CREATORS, PLAYLISTS } from "@/data/demo";
import { Icon, MediaCard, PageHeader, SectionHeader } from "@/components/ui-kit";
import { useShell } from "@/state/app-shell";
import { useState } from "react";

const TABS = ["Releases", "Posts", "Collections", "Activity"];

export default function ProfileSurface() {
  const { loved, saved, followed, toggleFollow } = useShell();
  const [tab, setTab] = useState("Releases");
  const me = CREATORS[0]!;

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Identity"
        title="Profile"
        description="Your member profile: releases, posts, collections and public activity."
      />

      {/* Profile header */}
      <section className="mb-7 flex flex-col gap-6 rounded-xl border border-surface-container-highest bg-surface-container-low p-6 md:flex-row md:items-center">
        <img
          src={me.avatar}
          alt={me.name}
          className="h-24 w-24 rounded-full border border-surface-container-highest object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="font-mono-data text-mono-data uppercase text-primary-container">
            @{me.handle} · {me.role}
          </p>
          <h2 className="mt-1 font-headline-md text-headline-md text-on-surface">{me.name}</h2>
          <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
            Producer and sound designer based in Chicago. Working on ambient textures,
            long-form sessions and the occasional remix.
          </p>
          <div className="mt-3 flex gap-4 font-mono-data text-mono-data text-on-surface-variant">
            <span>
              <span className="text-on-surface">{me.followers}</span> followers
            </span>
            <span>
              <span className="text-on-surface">812</span> following
            </span>
            <span>
              <span className="text-on-surface">{TRACKS.length}</span> releases
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="rounded-lg bg-primary-container px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-primary-container active:scale-95"
          >
            Edit profile
          </button>
          <button
            type="button"
            className="rounded-lg border border-surface-container-highest px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-on-surface"
          >
            Share profile
          </button>
        </div>
      </section>

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

      {tab === "Releases" && (
        <section className="mb-7">
          <SectionHeader title="Your releases" hint={`${TRACKS.length} tracks`} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {TRACKS.map((t) => (
              <MediaCard key={t.objectId} object={t} />
            ))}
          </div>
        </section>
      )}

      {tab === "Posts" && (
        <section className="mb-7">
          <SectionHeader title="Your posts" hint="3 posts" />
          <div className="flex flex-col gap-3">
            {TRACKS.slice(0, 3).map((t, i) => (
              <article
                key={t.objectId}
                className="rounded-xl border border-surface-container-highest bg-surface-container-low p-4"
              >
                <p className="font-mono-data text-mono-data text-on-surface-variant">
                  {i === 0 ? "12m ago" : i === 1 ? "1h ago" : "4h ago"}
                </p>
                <p className="mt-1 font-body-lg text-body-lg text-on-surface">
                  New release — {t.title}. {t.genre} · recorded in one pass.
                </p>
                <div className="mt-3 flex items-center gap-2 text-on-surface-variant">
                  <Icon name="favorite" size={16} />
                  <span className="font-mono-data text-mono-data">
                    {Math.floor(t.loves / 10)}
                  </span>
                  <Icon name="chat_bubble" size={16} />
                  <span className="font-mono-data text-mono-data">
                    {Math.floor(t.notes / 5)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "Collections" && (
        <section className="mb-7">
          <SectionHeader title="Public collections" hint={`${PLAYLISTS.length} playlists`} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {PLAYLISTS.map((p) => (
              <div
                key={p.objectId}
                className="rounded-xl border border-surface-container-highest bg-surface-container-low p-3"
              >
                <img
                  src={p.artwork}
                  alt=""
                  className="aspect-square w-full rounded object-cover"
                />
                <p className="mt-2 font-headline-sm text-headline-sm text-on-surface">
                  {p.title}
                </p>
                <p className="font-mono-data text-mono-data text-on-surface-variant">
                  {p.count} items
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "Activity" && (
        <section className="mb-7">
          <SectionHeader title="Recent activity" hint="Last 7 days" />
          <ul className="flex flex-col gap-3 font-body-sm text-body-sm text-on-surface-variant">
            <li className="flex items-center gap-3 rounded-lg border border-surface-container-highest bg-surface-container-low p-3">
              <Icon name="favorite" size={18} className="text-primary-container" filled />
              You loved <span className="text-on-surface">Midnight Transit</span> · 2h ago
            </li>
            <li className="flex items-center gap-3 rounded-lg border border-surface-container-highest bg-surface-container-low p-3">
              <Icon name="bookmark" size={18} className="text-primary-container" filled />
              You saved <span className="text-on-surface">Silent Stage</span> · 6h ago
            </li>
            <li className="flex items-center gap-3 rounded-lg border border-surface-container-highest bg-surface-container-low p-3">
              <Icon name="queue_music" size={18} className="text-primary-container" />
              Added 3 tracks to <span className="text-on-surface">Night Driving</span> · 1d ago
            </li>
            <li className="flex items-center gap-3 rounded-lg border border-surface-container-highest bg-surface-container-low p-3">
              <Icon name="cached" size={18} className="text-primary-container" />
              You resang <span className="text-on-surface">North Signal</span> · 3d ago
            </li>
          </ul>
        </section>
      )}
    </div>
  );
}
