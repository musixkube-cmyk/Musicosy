"use client";

import { CONVERSATIONS } from "@/data/demo";
import { Icon, PageHeader } from "@/components/ui-kit";
import { useState } from "react";

export default function MessagesSurface() {
  const [selected, setSelected] = useState(CONVERSATIONS[0]!.id);
  const active = CONVERSATIONS.find((c) => c.id === selected) ?? CONVERSATIONS[0]!;
  const [draft, setDraft] = useState("");
  const [thread, setThread] = useState<{ from: "me" | "them"; body: string; ago: string }[]>([
    { from: "them", body: "Sent the stems — check the 2:14 mark.", ago: "3m" },
    { from: "me", body: "Got it. Listening now.", ago: "2m" },
  ]);

  const send = () => {
    if (!draft.trim()) return;
    setThread((t) => [...t, { from: "me", body: draft.trim(), ago: "now" }]);
    setDraft("");
  };

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Direct conversations and shared objects that play inline in the persistent player."
      />

      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        {/* Conversation list */}
        <aside className="rounded-xl border border-surface-container-highest bg-surface-container-low">
          {CONVERSATIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c.id)}
              className={`flex w-full items-center gap-3 border-b border-surface-container-highest p-3 text-left transition-colors last:border-0 ${
                selected === c.id ? "bg-surface-container" : "hover:bg-surface-container"
              }`}
            >
              <img
                src={c.avatar}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-body-sm text-body-sm text-on-surface">{c.name}</p>
                <p className="truncate font-mono-data text-mono-data text-on-surface-variant">
                  {c.last}
                </p>
              </div>
              {c.unread > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-container px-1 font-mono-data text-[9px] font-bold text-on-primary-container">
                  {c.unread}
                </span>
              ) : null}
            </button>
          ))}
        </aside>

        {/* Thread */}
        <section className="flex min-h-[60vh] flex-col rounded-xl border border-surface-container-highest bg-surface-container-low">
          <header className="flex items-center gap-3 border-b border-surface-container-highest p-4">
            <img
              src={active.avatar}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-headline-sm text-headline-sm text-on-surface">
                {active.name}
              </p>
              <p className="font-mono-data text-mono-data text-on-surface-variant">
                Active · {active.ago} ago
              </p>
            </div>
            <button
              type="button"
              aria-label="Call"
              className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
            >
              <Icon name="call" size={18} />
            </button>
            <button
              type="button"
              aria-label="More"
              className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
            >
              <Icon name="more_vert" size={18} />
            </button>
          </header>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {thread.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-xl px-3 py-2 font-body-sm text-body-sm ${
                    m.from === "me"
                      ? "bg-primary-container text-on-primary-container"
                      : "bg-surface-container text-on-surface"
                  }`}
                >
                  <p>{m.body}</p>
                  <p
                    className={`mt-1 font-mono-data text-mono-data ${
                      m.from === "me" ? "text-on-primary-container/70" : "text-on-surface-variant"
                    }`}
                  >
                    {m.ago}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form
            className="flex items-center gap-2 border-t border-surface-container-highest p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <button
              type="button"
              aria-label="Attach"
              className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
            >
              <Icon name="attach_file" size={18} />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message…"
              className="flex-1 bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send"
              className="rounded-lg bg-primary-container p-2 text-on-primary-container active:scale-95"
            >
              <Icon name="send" size={18} filled />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
