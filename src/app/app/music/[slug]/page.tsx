"use client";

import { useParams } from "next/navigation";
import { ALL_OBJECTS, TRACKS } from "@/data/demo";
import { Icon, ObjectActions, PageHeader, SectionHeader, MediaCard, humanType } from "@/components/ui-kit";
import { useShell } from "@/state/app-shell";

export default function ObjectPage() {
  const params = useParams<{ slug: string }>();
  const { playObject, focusObject, loved, toggleLove, saved, toggleSave } = useShell();
  const object =
    ALL_OBJECTS.find((o) => o.objectId === params.slug) ??
    ALL_OBJECTS.find((o) => o.slug === params.slug) ??
    ALL_OBJECTS[0]!;

  const related = TRACKS.filter(
    (t) => t.objectId !== object.objectId && (t.genre === object.genre || true),
  ).slice(0, 4);

  return (
    <div className="w-full">
      <PageHeader
        eyebrow={humanType(object.objectType)}
        title={object.title}
        description={object.creator}
      />

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="flex flex-col gap-3">
          <img
            src={object.artwork}
            alt=""
            className="aspect-square w-full rounded-xl border border-surface-container-highest object-cover"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => playObject(object)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-container px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-primary-container active:scale-95"
            >
              <Icon name="play_arrow" size={18} filled />
              Play
            </button>
            <button
              type="button"
              onClick={() => toggleLove(object)}
              aria-label="Love"
              className={`rounded-lg border px-3 py-2 ${
                loved[object.objectId]
                  ? "border-primary-container text-primary-container"
                  : "border-surface-container-highest text-on-surface-variant"
              }`}
            >
              <Icon name="favorite" size={18} filled={!!loved[object.objectId]} />
            </button>
            <button
              type="button"
              onClick={() => toggleSave(object)}
              aria-label="Save"
              className={`rounded-lg border px-3 py-2 ${
                saved[object.objectId]
                  ? "border-primary-container text-primary-container"
                  : "border-surface-container-highest text-on-surface-variant"
              }`}
            >
              <Icon name="bookmark" size={18} filled={!!saved[object.objectId]} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-on-surface">Details</h2>
              <button
                type="button"
                onClick={() => focusObject(object, "details")}
                className="font-mono-data text-mono-data uppercase text-primary-container"
              >
                Open in rail
              </button>
            </div>
            <dl className="grid grid-cols-2 gap-3 font-mono-data text-mono-data">
              <Detail k="Type" v={humanType(object.objectType)} />
              <Detail k="Genre" v={object.genre ?? "—"} />
              <Detail k="By" v={object.creator} />
              <Detail k="Loves" v={object.loves.toLocaleString()} />
              <Detail k="Notes" v={object.notes.toLocaleString()} />
              {object.released ? <Detail k="Released" v={object.released} /> : null}
            </dl>
          </div>

          <div>
            <h2 className="mb-3 font-headline-md text-headline-md text-on-surface">Actions</h2>
            <div className="rounded-xl border border-surface-container-highest bg-surface-container-low p-3">
              <ObjectActions object={object} />
            </div>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Playback started here continues across every surface until you replace it.
          </p>
        </div>
      </div>

      <section className="mt-12">
        <SectionHeader title="Related" hint="From the same genre" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((t) => (
            <MediaCard key={t.objectId} object={t} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-surface-container-highest pb-2">
      <dt className="uppercase text-on-surface-variant">{k}</dt>
      <dd className="truncate text-on-surface">{v}</dd>
    </div>
  );
}
