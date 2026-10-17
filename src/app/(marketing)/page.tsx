"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SiteFooter } from "@/components/site/site-footer";

const sections = [
  {
    id: "stream",
    word: "Stream",
    body: "Your favorite songs and podcasts. Follow and discover your favorite creators, build your own playlist, go live with friends who share your taste in music.",
  },
  {
    id: "earn",
    word: "Earn",
    body: "Monetize your audience: streams, downloads, subscribers and merch.",
  },
  {
    id: "publish",
    word: "Publish",
    body: "Your music once. Labels, sync agents, distributors and advertisers looking for your sound and audience.",
  },
  {
    id: "create",
    word: "Create",
    body: "Music and podcasts with studio tools built to help you reach your audience.",
  },
  {
    id: "engage",
    word: "Engage",
    body: "Talk to your listeners and followers, get real-time feedback, and sell merch directly.",
  },
  {
    id: "manage",
    word: "Manage",
    body: "Handle rights, touring, rosters, distribution and social campaigns — all in one place.",
  },
  {
    id: "promote",
    word: "Promote",
    body: "Promote and schedule events, market your shows, sell tickets.",
  },
  {
    id: "advertise",
    word: "Advertise",
    body: "Reach the audience that fits your sound. Partner with artists who share your vision.",
  },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const vidA = useRef<HTMLVideoElement>(null);
  const vidB = useRef<HTMLVideoElement>(null);
  const [showA, setShowA] = useState(true);

  // Crossfade loop: two copies of the same video alternate so the loop
  // seam is a smooth dissolve instead of a visible glitch. The video is
  // 6 seconds; we start the lag video at 4.5s and crossfade over 1.5s
  // so the transition hides the loop point entirely.
  useEffect(() => {
    const DURATION = 6;
    const FADE_START = 4.5;
    const FADE_MS = (DURATION - FADE_START) * 1000;

    const lead = showA ? vidA : vidB;
    const lag = showA ? vidB : vidA;

    function onTimeUpdate() {
      if (!lead.current || lead.current.currentTime < FADE_START) return;
      lead.current.removeEventListener("timeupdate", onTimeUpdate);

      if (lag.current) {
        lag.current.currentTime = 0;
        lag.current.play();
      }
      setShowA(!showA);

      setTimeout(() => {
        if (lead.current) {
          lead.current.pause();
          lead.current.currentTime = 0;
        }
      }, FADE_MS + 200);
    }

    if (lead.current) {
      lead.current.addEventListener("timeupdate", onTimeUpdate);
    }
    return () => {
      if (lead.current) lead.current.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [showA]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const vh = window.innerHeight;
        let current = 0;
        wordRefs.current.forEach((el, i) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          // 0 when entering from the bottom, 1 when parked at its position
          const p = Math.min(Math.max(1 - (rect.top - vh * 0.2) / (vh * 0.8), 0), 1);
          el.style.setProperty("--p", String(p));
          if (p > 0.65) current = i;
        });
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col text-ink-foreground">
      {/* Full-bleed background video — dual-video crossfade loop.
          Two copies alternate so the loop seam is a smooth dissolve.
          Never times out — rotates at all times. */}
      <div className="fixed inset-0 z-0">
        <video
          ref={vidA}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${showA ? "opacity-100" : "opacity-0"}`}
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/video-canvas.mp4" type="video/mp4" />
        </video>
        <video
          ref={vidB}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${showA ? "opacity-0" : "opacity-100"}`}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/video-canvas.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/50 to-ink/25" />
      </div>

      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-end px-5 py-4 sm:px-10">
        <div className="flex items-center gap-2">
          <Link
            href="/signin"
            className="rounded-full border border-ink-foreground/25 px-4 py-2 text-sm font-medium text-ink-foreground/90 backdrop-blur transition-colors hover:border-primary hover:text-primary"
          >
            Sign in
          </Link>
          <Link
            href="/signin"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Join
          </Link>
        </div>
      </header>

      {/* Sections wrapper — the left rail nav is INSIDE this wrapper as
          position: sticky. When the wrapper ends (i.e., when the footer
          begins), the rail scrolls away naturally with the content instead
          of staying fixed over the footer. This is the real fix for the
          rail bleeding into the white footer area — not hiding it. */}
      <div className="relative flex-1">
        {/* Far-left rail — sticky so it stays centered while sections
            scroll past, then scrolls away when the wrapper ends. */}
        <nav
          aria-label="Sections"
          className="sticky top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 px-4 sm:flex"
          style={{ position: "sticky" }}
        >
          {sections.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`flex items-baseline gap-1 font-display text-sm uppercase tracking-[0.28em] transition-colors ${
                active === i ? "text-primary" : "text-ink-muted hover:text-ink-foreground"
              }`}
            >
              {s.word}
              <span className="text-primary">+</span>
            </a>
          ))}
        </nav>

        {/* Hero */}
        <section className="relative flex min-h-screen flex-col justify-end px-5 pb-24 sm:px-10 lg:pl-32">
          <h1 className="font-display text-[13vw] font-bold leading-[0.85] tracking-tight sm:text-[9vw]">
            Everything music.
            <span className="block text-primary">One place.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-muted">
            Zero gravity, zero gatekeepers. Scroll down.
          </p>
        </section>

        {/* Scrolling block-letter sections */}
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className="relative flex min-h-screen items-center overflow-hidden px-5 sm:px-10 lg:pl-32"
          >
            <div className="w-full">
              <div
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                style={{ "--p": 0 } as React.CSSProperties}
                className="[transform:translateX(calc((1_-_var(--p))_*_60vw))] [opacity:calc(0.15_+_var(--p)_*_0.85)] will-change-transform"
              >
                <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
                  0{i + 1}
                </p>
                <h2 className="flex items-baseline gap-2 font-display text-[20vw] font-bold uppercase leading-[0.8] tracking-tighter sm:text-[15vw]">
                  {s.word}
                  <Link href={s.id === "advertise" ? "/advertise" : "/signin"} className="text-[0.35em] font-semibold normal-case tracking-normal text-primary transition-colors hover:text-primary/80">+</Link>
                </h2>
              </div>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-muted">{s.body}</p>

            </div>
          </section>
        ))}
      </div>

      {/* Footer — shared SiteFooter component. White background, BLACK
          Musicosy logo (not orange), same component as the Help Center
          pages. The rail nav scrolls away naturally before the footer
          begins because it's sticky inside the sections wrapper above. */}
      <SiteFooter />
    </div>
  );
}
