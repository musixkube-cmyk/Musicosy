"use client";

import Link from "next/link";
import { useShell } from "../../state/app-shell";
import { Icon, humanType } from "../ui-kit";
import { ALL_OBJECTS, CREATORS } from "../../data/demo";

export function SearchPalette() {
  const { searchOpen, setSearchOpen, playObject, focusObject } = useShell();
  if (!searchOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 pt-24"
      onClick={() => setSearchOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-surface-container-highest bg-surface-container-low"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-surface-container-highest px-4 py-3">
          <Icon name="search" size={18} className="text-on-surface-variant" />
          <input
            autoFocus
            placeholder="Search members, music, episodes, live, events…"
            className="flex-1 bg-transparent font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none"
          />
          <Link
            href="/app/search"
            onClick={() => setSearchOpen(false)}
            className="font-mono-data text-mono-data uppercase text-primary-container"
          >
            Full search
          </Link>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {ALL_OBJECTS.slice(0, 5).map((o) => (
            <div
              key={o.objectId}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-container"
            >
              <img src={o.artwork} alt="" className="h-9 w-9 rounded object-cover" />
              <button
                type="button"
                onClick={() => {
                  focusObject(o, "details");
                  setSearchOpen(false);
                }}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate font-body-sm text-body-sm text-on-surface">{o.title}</p>
                <p className="truncate font-mono-data text-mono-data uppercase text-on-surface-variant">
                  {humanType(o.objectType)} · {o.creator}
                </p>
              </button>
              <button
                type="button"
                aria-label={`Play ${o.title}`}
                onClick={() => {
                  playObject(o);
                  setSearchOpen(false);
                }}
                className="rounded p-1 text-on-surface-variant hover:text-primary-container"
              >
                <Icon name="play_arrow" size={18} filled />
              </button>
            </div>
          ))}
          {CREATORS.slice(0, 2).map((c) => (
            <Link
              key={c.handle}
              href="/app/profile"
              onClick={() => setSearchOpen(false)}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-container"
            >
              <img src={c.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
              <div>
                <p className="font-body-sm text-body-sm text-on-surface">{c.name}</p>
                <p className="font-mono-data text-mono-data uppercase text-on-surface-variant">
                  Member · {c.followers} followers
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const OVERLAY_COPY: Record<string, { title: string; body: string; confirm: string }> = {
  resing: {
    title: "Resing this object",
    body: "Your Resing attributes the original object and keeps the active session playing.",
    confirm: "Open composer",
  },
  share: {
    title: "Share",
    body: "Copy a link to share. Only safe state is included — never private queue or panel details.",
    confirm: "Copy link",
  },
  device: {
    title: "Playback device",
    body: "This browser · Desk monitors · Living room speaker",
    confirm: "Use this browser",
  },
  collection: {
    title: "Save to collection",
    body: "Night Driving · Monochrome Focus · Field Recordings",
    confirm: "Save",
  },
  golive: {
    title: "Go live",
    body: "Start a broadcast from your workspace. Chat, participants and requests open in the context rail.",
    confirm: "Start broadcast",
  },
};

export function OverlayHost() {
  const { overlay, closeOverlay } = useShell();
  if (!overlay) return null;
  const copy = OVERLAY_COPY[overlay] ?? {
    title: overlay,
    body: "Contained task.",
    confirm: "Confirm",
  };
  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 p-4 md:items-center"
      onClick={closeOverlay}
    >
      <div
        className="w-full max-w-md rounded-xl border border-surface-container-highest bg-surface-container-low p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-headline-md text-headline-md text-on-surface">{copy.title}</h2>
        <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">{copy.body}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeOverlay}
            className="rounded-lg border border-surface-container-highest px-3 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={closeOverlay}
            className="rounded-lg bg-primary-container px-3 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-primary-container active:scale-95"
          >
            {copy.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
