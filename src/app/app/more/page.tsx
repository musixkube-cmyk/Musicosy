"use client";

import { Icon, PageHeader, SectionHeader } from "@/components/ui-kit";
import { useShell } from "@/state/app-shell";
import { useState } from "react";

const SECTIONS: {
  title: string;
  items: { icon: string; label: string; hint: string; toggle?: boolean }[];
}[] = [
  {
    title: "Account",
    items: [
      { icon: "person", label: "Identity", hint: "Name, handle, avatar" },
      { icon: "mail", label: "Email", hint: "studio@musicosy.app" },
      { icon: "lock", label: "Password", hint: "Last changed 4m ago" },
      { icon: "verified_user", label: "Two-factor", hint: "Enabled · Authenticator", toggle: true },
    ],
  },
  {
    title: "Playback",
    items: [
      { icon: "graphic_eq", label: "Audio quality", hint: "Lossless · FLAC" },
      { icon: "volume_up", label: "Crossfade", hint: "Off", toggle: true },
      { icon: "sensors", label: "Gapless playback", hint: "On", toggle: true },
      { icon: "devices", label: "Connected devices", hint: "3 active" },
    ],
  },
  {
    title: "Privacy",
    items: [
      { icon: "visibility", label: "Public profile", hint: "Visible to members", toggle: true },
      { icon: "listeners", label: "Show listening activity", hint: "Friends only", toggle: true },
      { icon: "block", label: "Blocked members", hint: "0 blocked" },
      { icon: "download", label: "Allow downloads", hint: "Off", toggle: false },
    ],
  },
  {
    title: "Notifications",
    items: [
      { icon: "favorite", label: "Loves and resings", hint: "Push + email", toggle: true },
      { icon: "person_add", label: "New followers", hint: "Push only", toggle: true },
      { icon: "sensors", label: "Live starts", hint: "Push only", toggle: true },
      { icon: "campaign", label: "Marketing", hint: "Off", toggle: false },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: "help", label: "Help center", hint: "Docs, FAQ, status" },
      { icon: "feedback", label: "Send feedback", hint: "Open a ticket" },
      { icon: "info", label: "About MusicOSY", hint: "v2.4 · build 9120" },
    ],
  },
];

export default function MoreSurface() {
  const { memberContext, setMemberContext } = useShell();
  const [toggles, setToggles] = useState<Record<string, boolean>>({});

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Settings"
        title="More"
        description="Account, playback, privacy, notifications and support settings."
      />

      <section className="mb-8">
        <SectionHeader title="Workspace context" hint="Switch session scope" />
        <div className="grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => setMemberContext("personal")}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
              memberContext === "personal"
                ? "border-primary-container bg-surface-container"
                : "border-surface-container-highest bg-surface-container-low hover:bg-surface-container"
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary-container">
              <Icon name="person" size={20} />
            </span>
            <div>
              <p className="font-headline-sm text-headline-sm text-on-surface">Personal</p>
              <p className="font-mono-data text-mono-data text-on-surface-variant">
                Your own listening and posts
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMemberContext("workspace")}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
              memberContext === "workspace"
                ? "border-primary-container bg-surface-container"
                : "border-surface-container-highest bg-surface-container-low hover:bg-surface-container"
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary-container">
              <Icon name="apartment" size={20} />
            </span>
            <div>
              <p className="font-headline-sm text-headline-sm text-on-surface">Studio Nine</p>
              <p className="font-mono-data text-mono-data text-on-surface-variant">
                Label workspace · 8 members
              </p>
            </div>
          </button>
        </div>
      </section>

      {SECTIONS.map((section) => (
        <section key={section.title} className="mb-8">
          <SectionHeader title={section.title} />
          <div className="overflow-hidden rounded-xl border border-surface-container-highest bg-surface-container-low">
            {section.items.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 p-4 ${
                  i < section.items.length - 1
                    ? "border-b border-surface-container-highest"
                    : ""
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-primary-container">
                  <Icon name={item.icon} size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-body-sm text-body-sm text-on-surface">{item.label}</p>
                  <p className="font-mono-data text-mono-data text-on-surface-variant">
                    {item.hint}
                  </p>
                </div>
                {item.toggle !== undefined ? (
                  <button
                    type="button"
                    aria-label={`Toggle ${item.label}`}
                    onClick={() =>
                      setToggles((t) => ({
                        ...t,
                        [item.label]: !(t[item.label] ?? item.toggle),
                      }))
                    }
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      (toggles[item.label] ?? item.toggle)
                        ? "bg-primary-container"
                        : "bg-surface-container-highest"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-on-primary-container transition-all ${
                        (toggles[item.label] ?? item.toggle) ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                ) : (
                  <Icon name="chevron_right" size={18} className="text-on-surface-variant" />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="mb-8">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-error-container/50 bg-error-container/10 px-4 py-3 font-label-caps text-label-caps uppercase tracking-widest text-error transition-colors hover:bg-error-container/20"
        >
          <Icon name="logout" size={18} />
          Sign out
        </button>
      </section>
    </div>
  );
}
