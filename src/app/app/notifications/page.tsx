"use client";

import { NOTIFICATIONS } from "@/data/demo";
import { Icon, PageHeader, SectionHeader } from "@/components/ui-kit";
import { useState } from "react";

const KIND_META: Record<
  string,
  { icon: string; label: string }
> = {
  love: { icon: "favorite", label: "Loves" },
  follow: { icon: "person_add", label: "Follows" },
  resing: { icon: "cached", label: "Resings" },
  live: { icon: "sensors", label: "Live" },
};

const FILTERS = ["All", "Unread", "Loves", "Follows", "Live"];

export default function NotificationsSurface() {
  const [filter, setFilter] = useState("All");
  const [read, setRead] = useState<Record<string, boolean>>({});

  const visible = NOTIFICATIONS.filter((n) => {
    if (filter === "Unread") return n.unread && !read[n.id];
    if (filter === "Loves") return n.kind === "love";
    if (filter === "Follows") return n.kind === "follow";
    if (filter === "Live") return n.kind === "live";
    return true;
  });

  const markRead = (id: string) => setRead((r) => ({ ...r, [id]: true }));

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread && !read[n.id]).length;

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Alerts"
        title="Notifications"
        description="Follows, mentions, releases and live starts grouped by relationship."
        actions={
          <button
            type="button"
            onClick={() => setRead(Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, true])))}
            className="rounded-lg border border-surface-container-highest px-3 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-on-surface"
          >
            Mark all read
          </button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg border px-3 py-2 font-mono-data text-mono-data uppercase ${
              filter === f
                ? "border-primary-container text-primary-container"
                : "border-surface-container-highest text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {f}
            {f === "Unread" && unreadCount > 0 ? ` · ${unreadCount}` : ""}
          </button>
        ))}
      </div>

      <SectionHeader title="Today" hint={`${visible.length} items`} />

      <div className="flex flex-col gap-2">
        {visible.length === 0 ? (
          <div className="rounded-xl border border-surface-container-highest bg-surface-container-low p-8 text-center">
            <Icon
              name="notifications_off"
              size={32}
              className="mx-auto mb-2 text-on-surface-variant"
            />
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Nothing here. You're all caught up.
            </p>
          </div>
        ) : (
          visible.map((n) => {
            const meta = KIND_META[n.kind] ?? { icon: "info", label: "Other" };
            const isUnread = n.unread && !read[n.id];
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => markRead(n.id)}
                className={`flex items-center gap-3 rounded-xl border bg-surface-container-low p-3 text-left transition-colors hover:bg-surface-container ${
                  isUnread
                    ? "border-primary-container/40"
                    : "border-surface-container-highest"
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary-container">
                  <Icon name={meta.icon} size={20} filled={n.kind === "love"} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-body-sm text-body-sm text-on-surface">{n.text}</p>
                  <p className="font-mono-data text-mono-data uppercase text-on-surface-variant">
                    {meta.label} · {n.ago} ago
                  </p>
                </div>
                {isUnread ? (
                  <span className="h-2 w-2 rounded-full bg-primary-container" />
                ) : null}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
