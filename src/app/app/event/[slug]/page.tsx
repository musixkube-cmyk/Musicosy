"use client";

import { useParams } from "next/navigation";
import { CREATORS, EVENTS, findEvent } from "@/data/demo";
import {
  CreatorRailCard,
  EventRailCard,
  Icon,
  PageHeader,
  SectionHeader,
} from "@/components/ui-kit";
import { useShell } from "@/state/app-shell";

export default function EventPage() {
  const params = useParams<{ slug: string }>();
  const { openOverlay } = useShell();

  // Fallback to first event keeps the route resilient.
  const event = findEvent(params.slug) ?? EVENTS[0]!;
  const lineup = CREATORS.slice(0, 3);
  const related = EVENTS.filter((e) => e.slug !== event.slug);

  const info = [
    { label: "Venue", value: "Warehouse Nine · Main floor", icon: "location_on" },
    { label: "Doors", value: "8:00 PM", icon: "meeting_room" },
    { label: "Showtime", value: "9:30 PM", icon: "schedule" },
    { label: "Age", value: "21+", icon: "badge" },
    { label: "Capacity", value: "450", icon: "group" },
    { label: "Tickets", value: "$28 advance / $35 door", icon: "confirmation_number" },
  ];

  return (
    <div className="w-full">
      <PageHeader
        eyebrow={`${event.date} · ${event.city}`}
        title={event.title}
        description="A live in-person event. Get tickets to add it to your calendar — lineup, venue info and related shows below."
        actions={
          <button
            type="button"
            onClick={() => openOverlay("share")}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-container px-3 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-primary-container transition-all hover:opacity-90 active:scale-95"
          >
            <Icon name="confirmation_number" size={18} filled />
            Get tickets
          </button>
        }
      />

      {/* Hero */}
      <section className="mb-7 overflow-hidden rounded-xl border border-surface-container-highest bg-surface-container-low">
        <div className="relative">
          <img
            src={event.artwork}
            alt={`${event.title} artwork`}
            className="h-72 w-full object-cover md:h-96"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <span className="absolute left-3 top-3 rounded bg-primary-container px-2 py-1 font-mono-data text-mono-data uppercase tracking-widest text-on-primary-container">
            <span className="mr-1">Live · in person</span>
          </span>
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <p className="font-mono-data text-mono-data uppercase tracking-widest text-primary-container">
              {event.date} · {event.city}
            </p>
            <h2 className="mt-1 font-headline-md text-headline-md text-on-surface">
              {event.title}
            </h2>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
              Doors 8:00 PM · Showtime 9:30 PM · 21+
            </p>
          </div>
        </div>
      </section>

      {/* Info grid */}
      <section className="mb-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3" id="tickets">
        {info.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-3 rounded-xl border border-surface-container-highest bg-surface-container-low p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary-container">
              <Icon name={row.icon} size={20} filled />
            </span>
            <div className="min-w-0">
              <p className="font-mono-data text-mono-data uppercase tracking-widest text-on-surface-variant">
                {row.label}
              </p>
              <p className="truncate font-body-sm text-body-sm text-on-surface">
                {row.value}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Tickets CTA */}
      <section className="mb-7 flex flex-col gap-3 rounded-xl border border-surface-container-highest bg-surface-container-low p-6 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="font-headline-sm text-headline-sm text-on-surface">Tickets</p>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            Advance pricing closes 48h before doors. Refunds available up to 7 days before the show.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openOverlay("share")}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary-container px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-primary-container transition-all hover:opacity-90 active:scale-95"
        >
          <Icon name="confirmation_number" size={18} filled />
          Get tickets
        </button>
      </section>

      {/* Lineup */}
      <section className="mb-7">
        <SectionHeader title="Lineup" hint="Performing tonight" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {lineup.map((c) => (
            <CreatorRailCard key={c.handle} creator={c} />
          ))}
        </div>
      </section>

      {/* Map placeholder */}
      <section className="mb-7">
        <SectionHeader title="Location" hint={event.city} />
        <div className="relative flex h-64 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-surface-container-highest bg-surface-container-low text-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,87,34,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,34,0.6) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
            aria-hidden="true"
          />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
            <Icon name="location_on" size={26} filled />
          </span>
          <p className="relative font-headline-sm text-headline-sm text-on-surface">Map view</p>
          <p className="relative font-mono-data text-mono-data uppercase tracking-widest text-on-surface-variant">
            {event.city}
          </p>
          <button
            type="button"
            className="relative mt-1 inline-flex items-center gap-2 rounded-lg border border-surface-container-highest px-3 py-1.5 font-mono-data text-mono-data uppercase text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <Icon name="directions" size={16} />
            Directions
          </button>
        </div>
      </section>

      {/* Related events */}
      <section className="mb-8">
        <SectionHeader title="Related events" hint="More near you" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {related.map((e) => (
            <EventRailCard key={e.objectId} event={e} />
          ))}
        </div>
      </section>
    </div>
  );
}
