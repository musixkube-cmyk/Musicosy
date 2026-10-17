"use client";

import { Icon, PageHeader, SectionHeader } from "@/components/ui-kit";
import { useShell } from "@/state/app-shell";
import { useState } from "react";

const TEMPLATES = [
  { id: "post", icon: "post_add", label: "Post", hint: "Draft-first composer" },
  { id: "track", icon: "upload", label: "Upload a song", hint: "Transcode + rights check" },
  { id: "record", icon: "mic", label: "Start a recording", hint: "Session capture" },
  { id: "playlist", icon: "playlist_add", label: "Make a playlist", hint: "Collections" },
  { id: "live", icon: "sensors", label: "Go live", hint: "Broadcast health" },
  { id: "project", icon: "folder_open", label: "Open a project", hint: "Workspace context" },
];

const RECENT_PROJECTS = [
  { id: "pr1", title: "Silent Stage — final mix", updated: "2h ago", members: 3 },
  { id: "pr2", title: "Resings 2026 collection", updated: "1d ago", members: 5 },
  { id: "pr3", title: "Late Desk Session — live archive", updated: "3d ago", members: 2 },
];

export default function CreateSurface() {
  const { openOverlay, playObject, addToQueue } = useShell();
  const [template, setTemplate] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [published, setPublished] = useState(false);

  const publish = () => {
    if (!title.trim()) return;
    setPublished(true);
    setTimeout(() => setPublished(false), 2400);
    setTitle("");
    setBody("");
    setTemplate(null);
  };

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Creation"
        title="Create"
        description="Upload, record, compose and schedule releases without losing your session."
      />

      <section className="mb-7">
        <SectionHeader title="Pick a starting point" hint="Templates" />
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.id)}
              className={`flex flex-col gap-2 rounded-xl border p-4 text-left transition-colors ${
                template === t.id
                  ? "border-primary-container bg-surface-container"
                  : "border-surface-container-highest bg-surface-container-low hover:bg-surface-container"
              }`}
            >
              <Icon name={t.icon} size={22} className="text-primary-container" />
              <span className="font-headline-sm text-headline-sm text-on-surface">{t.label}</span>
              <span className="font-mono-data text-mono-data text-on-surface-variant">
                {t.hint}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <section>
          <SectionHeader
            title={template ? `Compose — ${template}` : "Compose"}
            hint={template ? "Draft saved automatically" : "Pick a template above"}
          />

          {template ? (
            <div className="flex flex-col gap-3 rounded-xl border border-surface-container-highest bg-surface-container-low p-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title…"
                className="w-full bg-transparent font-headline-md text-headline-md text-on-surface placeholder:text-on-surface-variant focus:outline-none"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                placeholder={
                  template === "post"
                    ? "What's on your mind?"
                    : template === "track"
                      ? "Describe the upload — BPM, key, instrumentation…"
                      : template === "record"
                        ? "Describe the session you're about to capture…"
                        : template === "playlist"
                          ? "What's this collection for?"
                          : template === "live"
                            ? "What's the live room about?"
                            : "Project brief…"
                }
                className="w-full resize-none rounded-lg border border-surface-container-highest bg-surface-container p-3 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary-container focus:outline-none"
              />
              {template === "track" && (
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-surface-container-highest p-4 text-on-surface-variant hover:border-primary-container hover:text-primary-container">
                  <Icon name="upload" size={24} />
                  <span className="font-body-sm text-body-sm">
                    Drop an audio file or click to browse · WAV, FLAC, MP3 up to 200MB
                  </span>
                  <input type="file" className="hidden" accept="audio/*" />
                </label>
              )}
              <div className="flex items-center justify-between">
                <p className="font-mono-data text-mono-data text-on-surface-variant">
                  {published ? "Published ✓" : "Draft auto-saved"}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTemplate(null)}
                    className="rounded-lg border border-surface-container-highest px-3 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={publish}
                    disabled={!title.trim()}
                    className="rounded-lg bg-primary-container px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-primary-container active:scale-95 disabled:opacity-40"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-surface-container-highest bg-surface-container-low p-8 text-center">
              <Icon
                name="add_circle"
                size={32}
                className="mx-auto mb-2 text-on-surface-variant"
              />
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Select a template above to start composing. The active player session continues
                uninterrupted while you create.
              </p>
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-6">
          <section>
            <SectionHeader title="Recent projects" />
            <div className="flex flex-col gap-2">
              {RECENT_PROJECTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="rounded-xl border border-surface-container-highest bg-surface-container-low p-3 text-left transition-colors hover:bg-surface-container"
                >
                  <p className="truncate font-body-sm text-body-sm text-on-surface">{p.title}</p>
                  <p className="font-mono-data text-mono-data text-on-surface-variant">
                    {p.updated} · {p.members} members
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Quick actions" />
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => openOverlay("collection")}
                className="flex items-center gap-3 rounded-xl border border-surface-container-highest bg-surface-container-low p-3 text-left hover:bg-surface-container"
              >
                <Icon name="bookmark" size={20} className="text-primary-container" />
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface">Save to collection</p>
                  <p className="font-mono-data text-mono-data text-on-surface-variant">
                    Night Driving · Monochrome
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => openOverlay("share")}
                className="flex items-center gap-3 rounded-xl border border-surface-container-highest bg-surface-container-low p-3 text-left hover:bg-surface-container"
              >
                <Icon name="share" size={20} className="text-primary-container" />
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface">Share with collaborator</p>
                  <p className="font-mono-data text-mono-data text-on-surface-variant">
                    Link, DM or embed
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => openOverlay("golive")}
                className="flex items-center gap-3 rounded-xl border border-surface-container-highest bg-surface-container-low p-3 text-left hover:bg-surface-container"
              >
                <Icon name="sensors" size={20} className="text-primary-container" />
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface">Start a live session</p>
                  <p className="font-mono-data text-mono-data text-on-surface-variant">
                    Broadcast from this project
                  </p>
                </div>
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
