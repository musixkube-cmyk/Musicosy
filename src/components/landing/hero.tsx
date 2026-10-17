import { EmailSignup } from "./email-signup";

const partners = [
  "Spotify",
  "Apple Music",
  "Amazon Music",
  "YouTube Music",
  "TikTok",
  "Deezer",
  "Beatport",
  "Tidal",
];

const bars = [0.4, 0.7, 0.35, 0.9, 0.55, 0.8, 0.45, 0.65, 0.3, 0.75, 0.5, 0.85];

export function Hero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-start gap-14 py-16 lg:grid-cols-12 lg:gap-10 lg:py-24">
          {/* Left — headline + email capture */}
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 border border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-accent" />
              Now onboarding creators
            </span>

            <h1 className="mt-7 text-balance text-4xl font-semibold leading-[1.03] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              The infrastructure independent artists run their{" "}
              <span className="text-accent">whole business</span> on.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Distribution, fan marketing, monetization, rights and royalties, and a
              creative studio — one operating system instead of six subscriptions and
              a spreadsheet.
            </p>

            <div className="mt-9 max-w-lg">
              <EmailSignup />
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                First release included · No card required · Keep your masters
              </p>
            </div>

            <dl className="mt-12 grid max-w-xl grid-cols-3 divide-x divide-border border-y border-border">
              {[
                { v: "180+", l: "Stores & DSPs" },
                { v: "100%", l: "Royalties to you" },
                { v: "48h", l: "Median delivery" },
              ].map((s) => (
                <div key={s.l} className="px-4 py-5 first:pl-0">
                  <dt className="text-2xl font-semibold tracking-tight text-foreground">
                    {s.v}
                  </dt>
                  <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {s.l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right — release console mock */}
          <div className="lg:col-span-5">
            <div className="border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Release console
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-accent">
                  <span className="size-1.5 rounded-full bg-accent" />
                  Live
                </span>
              </div>

              <div className="p-5">
                <div className="aspect-square w-full rounded-md bg-muted" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-2/3 rounded-full bg-muted" />
                  <div className="h-2.5 w-1/2 rounded-full bg-muted/70" />
                </div>

                <div className="mt-5 space-y-2">
                  {bars.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-end gap-2"
                      style={{ height: 18 }}
                    >
                      <span className="w-12 shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        D{i + 1}
                      </span>
                      <div
                        className="h-full rounded-sm bg-foreground/80"
                        style={{ width: `${h * 100}%`, maxWidth: "100%" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Partner strip */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Distributed to
              </span>
              {partners.map((p) => (
                <span
                  key={p}
                  className="text-xs font-medium text-muted-foreground/80"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
