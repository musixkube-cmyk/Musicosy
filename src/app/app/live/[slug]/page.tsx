"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { CREATORS, LIVE_NOW, NOTES } from "@/data/demo";
import { Icon, LiveRailCard, PageHeader, SectionHeader } from "@/components/ui-kit";
import { useShell } from "@/state/app-shell";

export default function LiveRoomPage() {
  const params = useParams<{ slug: string }>();
  const { playObject, focusObject } = useShell();
  const [draft, setDraft] = useState("");

  // Fallback to the first live stream keeps the route resilient.
  const object = LIVE_NOW.find((l) => l.slug === params.slug) ?? LIVE_NOW[0]!;
  const creator = CREATORS.find((c) => c.name === object.creator);
  const chat = NOTES;
  const participants = CREATORS.slice(0, 4);
  const related = LIVE_NOW.filter((l) => l.slug !== object.slug);

  const handleSend = () => {
    if (!draft.trim()) return;
    setDraft("");
    focusObject(object, "chat");
  };

  return (
    <div className="w-full">
      <PageHeader
        eyebrow={`Live stream · ${object.plays}`}
        title={object.title}
        description="Live now. Joining the room opens chat and participants in the context rail — playback continues across surfaces."
        actions={
          <button
            type="button"
            onClick={() => playObject(object, "chat")}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-container px-3 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-primary-container transition-all hover:opacity-90 active:scale-95"
          >
            <Icon name="login" size={18} />
            Join
          </button>
        }
      />

      {/* Hero with live artwork */}
      <section className="mb-7 overflow-hidden rounded-xl border border-surface-container-highest bg-surface-container-low">
        <div className="relative">
          <img
            src={object.artwork}
            alt={`${object.title} artwork`}
            className="h-64 w-full object-cover md:h-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-primary-container px-2 py-1 font-mono-data text-mono-data uppercase tracking-widest text-on-primary-container">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-on-primary-container" />
            Live
          </span>
          <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded bg-black/70 px-2 py-1 font-mono-data text-mono-data uppercase text-on-surface">
            <Icon name="visibility" size={14} />
            {object.plays}
          </span>
          <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-3 p-4 md:p-6">
            <div className="min-w-0 flex-1">
              <p className="font-mono-data text-mono-data uppercase tracking-widest text-primary-container">
                Live room
              </p>
              <h2 className="mt-1 font-headline-md text-headline-md text-on-surface">
                {object.title}
              </h2>
              {creator ? (
                <Link
                  href={`/app/creator/${creator.handle}`}
                  className="mt-1 inline-flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary-container"
                >
                  {object.creator}
                  <Icon name="arrow_forward" size={14} />
                </Link>
              ) : (
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  {object.creator}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => playObject(object, "chat")}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-container px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-primary-container transition-all hover:opacity-90 active:scale-95"
            >
              <Icon name="login" size={18} />
              Join
            </button>
          </div>
        </div>
      </section>

      {/* Stream info */}
      <section className="mb-7 grid gap-3 md:grid-cols-3">
        <InfoBlock
          label="Creator"
          value={object.creator}
          icon="person"
          href={creator ? `/creator/${creator.handle}` : undefined}
        />
        <InfoBlock label="Genre" value="Live session" icon="graphic_eq" />
        <InfoBlock label="Started" value="42m ago" icon="history" />
      </section>

      {/* Chat preview */}
      <section className="mb-7">
        <SectionHeader title="Chat" hint={`${object.notes} in chat`} />
        <div className="overflow-hidden rounded-xl border border-surface-container-highest bg-surface-container-low">
          <div className="max-h-96 overflow-y-auto">
            {chat.map((n, i) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 p-3 ${
                  i < chat.length - 1
                    ? "border-b border-surface-container-highest"
                    : ""
                }`}
              >
                <img
                  src={n.avatar}
                  alt=""
                  className="h-8 w-8 rounded-full border border-surface-container-highest object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-body-sm text-body-sm text-on-surface">{n.author}</p>
                    <span className="font-mono-data text-mono-data text-on-surface-variant">
                      at {n.at}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{n.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-surface-container-highest p-3">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Say something to the room…"
              className="flex-1 bg-transparent font-body-sm text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant"
            />
            <button
              type="button"
              onClick={handleSend}
              aria-label="Send"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-container text-on-primary-container transition-all hover:opacity-90 active:scale-95"
            >
              <Icon name="send" size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Participants */}
      <section className="mb-7">
        <SectionHeader title="In the room" hint={`${participants.length} you follow`} />
        <div className="overflow-hidden rounded-xl border border-surface-container-highest bg-surface-container-low">
          {participants.map((p, i) => (
            <Link
              key={p.handle}
              href={`/app/creator/${p.handle}`}
              className={`flex items-center gap-3 p-3 transition-colors hover:bg-surface-container ${
                i < participants.length - 1
                  ? "border-b border-surface-container-highest"
                  : ""
              }`}
            >
              <img
                src={p.avatar}
                alt=""
                className="h-9 w-9 rounded-full border border-surface-container-highest object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-body-sm text-body-sm text-on-surface">{p.name}</p>
                <p className="font-mono-data text-mono-data text-on-surface-variant">
                  @{p.handle}
                </p>
              </div>
              <span className="flex items-center gap-1.5 font-mono-data text-mono-data uppercase tracking-widest text-primary-container">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-container" />
                Watching
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Related live */}
      <section className="mb-8">
        <SectionHeader title="More live now" hint="Other rooms" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {related.map((l) => (
            <LiveRailCard key={l.objectId} object={l} />
          ))}
        </div>
      </section>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: string;
  icon: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-center gap-3 rounded-xl border border-surface-container-highest bg-surface-container-low p-4 transition-colors hover:bg-surface-container">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary-container">
        <Icon name={icon} size={20} />
      </span>
      <div className="min-w-0">
        <p className="font-mono-data text-mono-data uppercase tracking-widest text-on-surface-variant">
          {label}
        </p>
        <p className="truncate font-body-sm text-body-sm text-on-surface">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}
