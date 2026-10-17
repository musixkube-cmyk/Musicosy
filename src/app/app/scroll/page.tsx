"use client";

import { POSTS } from "@/data/demo";
import { Icon, ObjectActions, PageHeader } from "@/components/ui-kit";
import { useShell } from "@/state/app-shell";
import { useState } from "react";

const FILTERS = ["Following", "Trending", "Nearby", "Sounds"];

export default function ScrollSurface() {
  const { focusObject, playObject, addToQueue } = useShell();
  const [filter, setFilter] = useState("Following");

  return (
    <div className="mx-auto w-full max-w-[860px]">
      <PageHeader
        eyebrow="Short-form · social"
        title="Scroll"
        description="Previews are not the player session. Promote an item explicitly to take over playback."
      />

      <div className="mb-6 flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-lg border px-3 py-2 font-mono-data text-mono-data uppercase ${
              filter === f
                ? "border-primary-container text-primary-container"
                : "border-surface-container-highest text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {POSTS.map((p) => (
          <article
            key={p.objectId}
            className="overflow-hidden rounded-xl border border-surface-container-highest bg-surface-container-low"
          >
            <div className="flex items-center gap-3 p-4">
              <img src={p.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-body-sm text-body-sm text-on-surface">{p.author}</p>
                <p className="font-mono-data text-mono-data text-on-surface-variant">
                  @{p.handle} · {p.ago}
                </p>
              </div>
              <button
                type="button"
                aria-label="Post options"
                onClick={() => focusObject(p.media, "details")}
                className="rounded p-2 text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="more_horiz" size={18} />
              </button>
            </div>
            <p className="px-4 pb-4 font-body-lg text-body-lg text-on-surface">{p.body}</p>
            <div className="relative">
              <img src={p.media.artwork} alt="" className="aspect-[4/3] w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent p-4">
                <button
                  type="button"
                  onClick={() => playObject(p.media, p.media.live ? "chat" : "notes")}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container active:scale-90"
                  aria-label={`Play ${p.media.title}`}
                >
                  <Icon name="play_arrow" size={24} filled />
                </button>
                <div className="min-w-0">
                  <p className="truncate font-headline-sm text-headline-sm text-on-surface">
                    {p.media.title}
                  </p>
                  <p className="font-mono-data text-mono-data text-on-surface-variant">
                    {p.media.live ? "LIVE now" : "Preview · 30s"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addToQueue(p.media)}
                  className="ml-auto rounded-lg border border-surface-container-highest px-2 py-1 font-mono-data text-mono-data uppercase text-on-surface"
                >
                  Add to queue
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3">
              <ObjectActions object={p.media} />
              <p className="font-mono-data text-mono-data text-on-surface-variant">
                {p.loves} loves · {p.notes} notes
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
