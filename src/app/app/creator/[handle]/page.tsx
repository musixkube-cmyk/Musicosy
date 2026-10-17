"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  CREATORS,
  PLAYLISTS,
  POSTS,
  RECENT_ACTIVITY,
  TRACKS,
  findCreator,
} from "@/data/demo";
import {
  CreatorRailCard,
  Icon,
  MediaCard,
  PageHeader,
  PlaylistRailCard,
  SectionHeader,
} from "@/components/ui-kit";
import { useShell } from "@/state/app-shell";

const TABS = ["Releases", "Posts", "Collections", "Activity"] as const;
type Tab = (typeof TABS)[number];

const ACTIVITY_ICONS: Record<string, string> = {
  love: "favorite",
  note: "chat_bubble",
  resing: "cached",
  save: "bookmark",
  follow: "person_add",
  release: "new_releases",
  queue: "queue_music",
};

export default function CreatorPage() {
  const params = useParams<{ handle: string }>();
  const { followed, toggleFollow } = useShell();
  const [tab, setTab] = useState<Tab>("Releases");

  // Fallback to first creator if the handle doesn't match — keeps the route
  // resilient instead of throwing on a stale link.
  const creator = findCreator(params.handle) ?? CREATORS[0]!;

  const releases = TRACKS.filter((t) => t.creator === creator.name);
  const posts = POSTS.filter((p) => p.handle === creator.handle);
  const collections = PLAYLISTS.slice(0, 4);
  const activity = RECENT_ACTIVITY.slice(0, 4);
  const similar = CREATORS.filter((c) => c.handle !== creator.handle).slice(0, 6);

  const isFollowing = followed[creator.handle];

  const bio = creator.role.toLowerCase().includes("producer")
    ? "Producer and sound designer working in long-form sessions, ambient textures and the occasional remix."
    : creator.role.toLowerCase().includes("dj")
      ? "DJ and selector. Long blends, deep cuts, and the occasional four-to-the-floor."
      : creator.role.toLowerCase().includes("band")
        ? "A band. Multi-instrumentalist, layered vocals, room-first recordings."
        : creator.role.toLowerCase().includes("composer")
          ? "Composer for picture and stage. Modular synths, tape, and orchestral hybrids."
          : "Songwriter and recording artist. Words first, arrangements second.";

  const stats: { label: string; value: string }[] = [
    { label: "Followers", value: creator.followers },
    { label: "Tracks", value: String(releases.length || TRACKS.length) },
    { label: "Events", value: "3" },
    { label: "Notes", value: "1.4k" },
  ];

  return (
    <div className="w-full">
      <PageHeader
        eyebrow={`@${creator.handle} · ${creator.role}`}
        title={creator.name}
        description="A creator profile. Releases, posts, collections and public activity in one surface — follow to bring their drops into your feed."
      />

      {/* Profile header */}
      <section className="mb-7 flex flex-col gap-6 rounded-xl border border-surface-container-highest bg-surface-container-low p-4 md:flex-row md:items-center md:p-6">
        <img
          src={creator.avatar}
          alt={`${creator.name} avatar`}
          className="h-24 w-24 rounded-full border border-surface-container-highest object-cover md:h-28 md:w-28"
        />
        <div className="min-w-0 flex-1">
          <p className="font-mono-data text-mono-data uppercase tracking-widest text-primary-container">
            @{creator.handle}
          </p>
          <h2 className="mt-1 font-headline-md text-headline-md text-on-surface">
            {creator.name}
          </h2>
          <p className="font-mono-data text-mono-data text-on-surface-variant">
            {creator.role}
          </p>
          <p className="mt-3 max-w-2xl font-body-sm text-body-sm text-on-surface-variant">
            {bio}
          </p>
          {/* Stats row */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono-data text-mono-data text-on-surface-variant">
            {stats.map((s) => (
              <span key={s.label}>
                <span className="text-on-surface">{s.value}</span>{" "}
                <span className="uppercase">{s.label}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <button
            type="button"
            onClick={() => toggleFollow(creator.handle)}
            aria-pressed={isFollowing}
            className={`rounded-lg px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest transition-all active:scale-95 ${
              isFollowing
                ? "border border-primary-container text-primary-container"
                : "bg-primary-container text-on-primary-container hover:opacity-90"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
          <Link
            href="/app/messages"
            className="rounded-lg border border-surface-container-highest px-4 py-2 text-center font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Message
          </Link>
        </div>
      </section>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`rounded-lg border px-3 py-2 font-mono-data text-mono-data uppercase transition-colors ${
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
        <section className="mb-8">
          <SectionHeader
            title="Releases"
            hint={`${releases.length} track${releases.length === 1 ? "" : "s"}`}
          />
          {releases.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {releases.map((t) => (
                <MediaCard key={t.objectId} object={t} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-surface-container-highest bg-surface-container-low p-6 text-center">
              <Icon name="album" size={28} className="text-on-surface-variant" />
              <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
                {creator.name} hasn&apos;t published any tracks yet.
              </p>
            </div>
          )}
        </section>
      )}

      {tab === "Posts" && (
        <section className="mb-8">
          <SectionHeader title="Posts" hint={`${posts.length} post${posts.length === 1 ? "" : "s"}`} />
          {posts.length > 0 ? (
            <div className="flex flex-col gap-3">
              {posts.map((p) => (
                <article
                  key={p.objectId}
                  className="rounded-xl border border-surface-container-highest bg-surface-container-low p-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.avatar}
                      alt=""
                      className="h-8 w-8 rounded-full border border-surface-container-highest object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-body-sm text-body-sm text-on-surface">{p.author}</p>
                      <p className="font-mono-data text-mono-data text-on-surface-variant">
                        @{p.handle} · {p.ago} ago
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 font-body-lg text-body-lg text-on-surface">{p.body}</p>
                  <div className="mt-3 flex items-center gap-4 text-on-surface-variant">
                    <span className="flex items-center gap-1 font-mono-data text-mono-data">
                      <Icon name="favorite" size={16} />
                      {p.loves}
                    </span>
                    <span className="flex items-center gap-1 font-mono-data text-mono-data">
                      <Icon name="chat_bubble" size={16} />
                      {p.notes}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-surface-container-highest bg-surface-container-low p-6 text-center">
              <Icon name="post_add" size={28} className="text-on-surface-variant" />
              <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
                {creator.name} hasn&apos;t posted anything yet.
              </p>
            </div>
          )}
        </section>
      )}

      {tab === "Collections" && (
        <section className="mb-8">
          <SectionHeader
            title="Collections"
            hint={`${collections.length} playlists`}
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {collections.map((p) => (
              <PlaylistRailCard key={p.objectId} playlist={p} />
            ))}
          </div>
        </section>
      )}

      {tab === "Activity" && (
        <section className="mb-8">
          <SectionHeader title="Activity" hint="Last 7 days" />
          <ul className="flex flex-col gap-3">
            {activity.map((a) => (
              <li key={a.id}>
                <Link
                  href={a.href}
                  className="flex items-center gap-3 rounded-lg border border-surface-container-highest bg-surface-container-low p-3 transition-colors hover:bg-surface-container"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
                    <Icon
                      name={ACTIVITY_ICONS[a.kind] ?? "circle"}
                      size={18}
                      className="text-primary-container"
                      filled={a.kind === "love"}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-body-sm text-body-sm text-on-surface">
                      {a.text}
                      {a.target ? (
                        <span className="text-primary-container"> {a.target}</span>
                      ) : null}
                    </p>
                    <p className="font-mono-data text-mono-data text-on-surface-variant">
                      {a.ago}
                    </p>
                  </div>
                  <Icon
                    name="arrow_forward"
                    size={16}
                    className="text-on-surface-variant"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Similar creators */}
      <section className="mb-8">
        <SectionHeader title="Similar creators" hint="You might also follow" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {similar.map((c) => (
            <CreatorRailCard key={c.handle} creator={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
