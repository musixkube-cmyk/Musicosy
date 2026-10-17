export type ObjectType =
  | "track"
  | "podcast_episode"
  | "video"
  | "live_stream"
  | "playlist"
  | "release"
  | "event"
  | "post"
  | "member_profile"
  | "sound";

export interface MediaObject {
  objectType: ObjectType;
  objectId: string;
  slug: string;
  title: string;
  creator: string;
  artwork: string;
  duration: number; // seconds, 0 = live
  genre?: string;
  live?: boolean;
  loves: number;
  notes: number;
  /** For videos — landscape 16:9 art */
  landscape?: string;
  /** Play count / view count / stream count */
  plays?: string;
  /** When the item was released (relative) */
  released?: string;
}

const art = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`;
const wide = (seed: string) => `https://picsum.photos/seed/${seed}/640/360`;

/* ============================================================
   CORE OBJECTS — the canonical media that flows through every
   rail, detail page, queue and context panel.
   ============================================================ */

export const TRACKS: MediaObject[] = [
  { objectType: "track", objectId: "t1", slug: "silent-stage", title: "Silent Stage", creator: "Ava Mirren", artwork: art("silentstage"), duration: 245, genre: "Ambient", loves: 12840, notes: 312, plays: "284K", released: "2h ago" },
  { objectType: "track", objectId: "t2", slug: "north-signal", title: "North Signal", creator: "Kobo Lane", artwork: art("northsignal"), duration: 198, genre: "Electronic", loves: 8210, notes: 144, plays: "192K", released: "5h ago" },
  { objectType: "track", objectId: "t3", slug: "paper-lungs", title: "Paper Lungs", creator: "Hollow Choir", artwork: art("paperlungs"), duration: 271, genre: "Indie", loves: 5390, notes: 96, plays: "118K", released: "8h ago" },
  { objectType: "track", objectId: "t4", slug: "midnight-transit", title: "Midnight Transit", creator: "Sable Room", artwork: art("midnighttransit"), duration: 312, genre: "Downtempo", loves: 21044, notes: 508, plays: "511K", released: "1d ago" },
  { objectType: "track", objectId: "t5", slug: "glass-orchard", title: "Glass Orchard", creator: "Ilya Verne", artwork: art("glassorchard"), duration: 226, genre: "Neo-classical", loves: 3110, notes: 41, plays: "67K", released: "1d ago" },
  { objectType: "track", objectId: "t6", slug: "rust-and-ribbon", title: "Rust & Ribbon", creator: "Marta Quinn", artwork: art("rustribbon"), duration: 189, genre: "Alt", loves: 7702, notes: 130, plays: "203K", released: "2d ago" },
  { objectType: "track", objectId: "t7", slug: "low-tide", title: "Low Tide", creator: "Ava Mirren", artwork: art("lowtide"), duration: 204, genre: "Ambient", loves: 4502, notes: 88, plays: "98K", released: "3d ago" },
  { objectType: "track", objectId: "t8", slug: "cassette-ghost", title: "Cassette Ghost", creator: "Kobo Lane", artwork: art("cassetteghost"), duration: 233, genre: "Electronic", loves: 6110, notes: 201, plays: "144K", released: "3d ago" },
  { objectType: "track", objectId: "t9", slug: "blue-hour", title: "Blue Hour", creator: "Hollow Choir", artwork: art("bluehour"), duration: 258, genre: "Indie", loves: 3890, notes: 72, plays: "82K", released: "4d ago" },
];

/* Released today — fresh drops from the past 24h */
export const MUSIC_TODAY: MediaObject[] = TRACKS.filter((t) =>
  ["silent-stage", "north-signal", "paper-lungs"].includes(t.slug)
);

/* Trending sounds — high-velocity tracks spiking right now */
export const TRENDING_SOUNDS: MediaObject[] = [
  ...TRACKS.filter((t) => ["midnight-transit", "rust-and-ribbon", "silent-stage", "cassette-ghost"].includes(t.slug)),
];

export const EPISODES: MediaObject[] = [
  { objectType: "podcast_episode", objectId: "e1", slug: "design-systems-weekly-42", title: "EP 42 — The Silent Stage", creator: "Design Systems Weekly", artwork: art("dsw42"), duration: 4500, loves: 980, notes: 77, plays: "12K", released: "6h ago" },
  { objectType: "podcast_episode", objectId: "e2", slug: "studio-notes-11", title: "EP 11 — Studio Notes", creator: "Room Tone", artwork: art("studionotes"), duration: 3220, loves: 512, notes: 33, plays: "8K", released: "1d ago" },
  { objectType: "podcast_episode", objectId: "e3", slug: "the-tape-room-05", title: "EP 05 — The Tape Room", creator: "Room Tone", artwork: art("taperoom05"), duration: 2880, loves: 401, notes: 28, plays: "6K", released: "2d ago" },
];

/* Video objects — 16:9 landscape art */
export const VIDEOS: MediaObject[] = [
  { objectType: "video", objectId: "v1", slug: "midnight-transit-visualizer", title: "Midnight Transit — Visualizer", creator: "Sable Room", artwork: wide("vizmidnight"), landscape: wide("vizmidnight"), duration: 312, genre: "Downtempo", loves: 18402, notes: 287, plays: "422K", released: "12h ago" },
  { objectType: "video", objectId: "v2", slug: "silent-stage-live-session", title: "Silent Stage — Live Session", creator: "Ava Mirren", artwork: wide("avasession"), landscape: wide("avasession"), duration: 289, genre: "Ambient", loves: 9210, notes: 144, plays: "201K", released: "1d ago" },
  { objectType: "video", objectId: "v3", slug: "north-signal-music-video", title: "North Signal — Music Video", creator: "Kobo Lane", artwork: wide("northmv"), landscape: wide("northmv"), duration: 198, genre: "Electronic", loves: 7320, notes: 98, plays: "178K", released: "2d ago" },
  { objectType: "video", objectId: "v4", slug: "paper-lungs-lyric-video", title: "Paper Lungs — Lyric Video", creator: "Hollow Choir", artwork: wide("paperlyrics"), landscape: wide("paperlyrics"), duration: 271, genre: "Indie", loves: 4890, notes: 61, plays: "112K", released: "3d ago" },
  { objectType: "video", objectId: "v5", slug: "studio-walkthrough-01", title: "Studio Walkthrough — Episode 1", creator: "Ava Mirren", artwork: wide("walkthrough"), landscape: wide("walkthrough"), duration: 842, genre: "Ambient", loves: 2210, notes: 44, plays: "48K", released: "4d ago" },
];

export const TRENDING_VIDEOS: MediaObject[] = VIDEOS.filter((v) =>
  ["midnight-transit-visualizer", "silent-stage-live-session", "north-signal-music-video"].includes(v.slug)
);

export const LIVE_NOW: MediaObject[] = [
  { objectType: "live_stream", objectId: "l1", slug: "late-desk-session", title: "Late Desk Session", creator: "Kobo Lane", artwork: art("latedesk"), duration: 0, live: true, loves: 402, notes: 219, plays: "1.2K watching" },
  { objectType: "live_stream", objectId: "l2", slug: "open-mix-room", title: "Open Mix Room", creator: "Sable Room", artwork: art("openmix"), duration: 0, live: true, loves: 188, notes: 96, plays: "644 watching" },
  { objectType: "live_stream", objectId: "l3", slug: "after-hours-qa", title: "After Hours Q&A", creator: "Ilya Verne", artwork: art("afterhours"), duration: 0, live: true, loves: 91, notes: 42, plays: "318 watching" },
];

/* Happening now — a mixed feed of posts + drops + live going on right now */
export interface HappeningItem {
  objectId: string;
  kind: "live" | "drop" | "post" | "event";
  title: string;
  meta: string;
  ago: string;
  artwork: string;
  href: string;
}

export const HAPPENING_NOW: HappeningItem[] = [
  { objectId: "h1", kind: "live", title: "Late Desk Session", meta: "Kobo Lane · 1.2K watching", ago: "live", artwork: art("latedesk"), href: "/live/late-desk-session" },
  { objectId: "h2", kind: "drop", title: "Silent Stage dropped", meta: "Ava Mirren · Ambient", ago: "2h", artwork: art("silentstage"), href: "/music/silent-stage" },
  { objectId: "h3", kind: "post", title: "Kobo Lane is going live in 20", meta: "@kobolane · bring requests", ago: "1h", artwork: art("kobo"), href: "/scroll" },
  { objectId: "h4", kind: "event", title: "Warehouse Nine — doors 8pm", meta: "Chicago, IL · tonight", ago: "5h", artwork: art("warehouse"), href: "/event/warehouse-nine" },
  { objectId: "h5", kind: "drop", title: "Midnight Transit — visualizer out", meta: "Sable Room · 422K plays", ago: "12h", artwork: wide("vizmidnight"), href: "/music/midnight-transit" },
];

export const PLAYLISTS = [
  { objectId: "p1", slug: "night-driving", title: "Night Driving", count: 42, artwork: art("nightdriving") },
  { objectId: "p2", slug: "monochrome-focus", title: "Monochrome Focus", count: 18, artwork: art("monochrome") },
  { objectId: "p3", slug: "resings-2026", title: "Resings 2026", count: 31, artwork: art("resings") },
  { objectId: "p4", slug: "field-recordings", title: "Field Recordings", count: 12, artwork: art("field") },
  { objectId: "p5", slug: "late-tape", title: "Late Tape", count: 24, artwork: art("latetape") },
  { objectId: "p6", slug: "analog-warmth", title: "Analog Warmth", count: 16, artwork: art("analogwarmth") },
];

export const CREATORS = [
  { handle: "avamirren", name: "Ava Mirren", role: "Producer", avatar: art("ava"), followers: "24.1k" },
  { handle: "kobolane", name: "Kobo Lane", role: "Live artist", avatar: art("kobo"), followers: "11.8k" },
  { handle: "hollowchoir", name: "Hollow Choir", role: "Band", avatar: art("hollow"), followers: "8.2k" },
  { handle: "sableroom", name: "Sable Room", role: "DJ", avatar: art("sable"), followers: "42.9k" },
  { handle: "ilyaverne", name: "Ilya Verne", role: "Composer", avatar: art("ilya"), followers: "15.3k" },
  { handle: "martaquinn", name: "Marta Quinn", role: "Songwriter", avatar: art("marta"), followers: "9.7k" },
];

/* Discover new creators — rising creators you don't follow yet */
export const DISCOVER_CREATORS = CREATORS.filter((c) =>
  ["ilyaverne", "martaquinn", "hollowchoir"].includes(c.handle)
);

/* New followers — social feed of who followed you recently */
export interface FollowerItem {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  ago: string;
  mutual?: number;
}

export const NEW_FOLLOWERS: FollowerItem[] = [
  { id: "f1", handle: "sableroom", name: "Sable Room", avatar: art("sable"), ago: "8m", mutual: 4 },
  { id: "f2", handle: "ilyaverne", name: "Ilya Verne", avatar: art("ilya"), ago: "40m", mutual: 2 },
  { id: "f3", handle: "martaquinn", name: "Marta Quinn", avatar: art("marta"), ago: "3h", mutual: 7 },
  { id: "f4", handle: "hollowchoir", name: "Hollow Choir", avatar: art("hollow"), ago: "5h", mutual: 1 },
];

export const EVENTS = [
  { objectId: "ev1", slug: "warehouse-nine", title: "Warehouse Nine", city: "Chicago, IL", date: "Aug 22", artwork: art("warehouse") },
  { objectId: "ev2", slug: "quiet-rooms-tour", title: "Quiet Rooms Tour", city: "Detroit, MI", date: "Sep 04", artwork: art("quietrooms") },
  { objectId: "ev3", slug: "signal-fest", title: "Signal Fest", city: "Austin, TX", date: "Sep 19", artwork: art("signalfest") },
  { objectId: "ev4", slug: "north-loop-basement", title: "North Loop Basement", city: "Minneapolis, MN", date: "Aug 29", artwork: art("northloop") },
  { objectId: "ev5", slug: "tape-room-residency", title: "Tape Room Residency", city: "Portland, OR", date: "Sep 11", artwork: art("taperoom") },
];

export const POSTS = [
  { objectId: "po1", author: "Ava Mirren", handle: "avamirren", avatar: art("ava"), body: "Mixed the outro three times tonight. The third one keeps the room noise in.", media: TRACKS[0]!, loves: 231, notes: 18, ago: "12m" },
  { objectId: "po2", author: "Kobo Lane", handle: "kobolane", avatar: art("kobo"), body: "Going live in 20 with the modular rack. Bring requests.", media: LIVE_NOW[0]!, loves: 88, notes: 41, ago: "1h" },
  { objectId: "po3", author: "Marta Quinn", handle: "martaquinn", avatar: art("marta"), body: "New single is up. Vocals recorded in one pass, no comping.", media: TRACKS[5]!, loves: 604, notes: 73, ago: "4h" },
  { objectId: "po4", author: "Sable Room", handle: "sableroom", avatar: art("sable"), body: "Visualizer for Midnight Transit is out. Watch the low end on a real system.", media: VIDEOS[0]!, loves: 1402, notes: 188, ago: "12h" },
];

/* Recent activity — what's happened in your world */
export interface ActivityItem {
  id: string;
  kind: "love" | "note" | "resing" | "save" | "follow" | "release" | "queue";
  text: string;
  target?: string;
  ago: string;
  href: string;
}

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: "a1", kind: "love", text: "Sable Room loved your note on", target: "Midnight Transit", ago: "8m", href: "/music/midnight-transit" },
  { id: "a2", kind: "follow", text: "Ilya Verne started following you", ago: "40m", href: "/creator/ilyaverne" },
  { id: "a3", kind: "resing", text: "Marta Quinn resang", target: "Silent Stage", ago: "3h", href: "/music/silent-stage" },
  { id: "a4", kind: "release", text: "Ava Mirren released", target: "Low Tide", ago: "4h", href: "/music/low-tide" },
  { id: "a5", kind: "note", text: "Hollow Choir noted at 01:08 on", target: "Paper Lungs", ago: "6h", href: "/music/paper-lungs" },
  { id: "a6", kind: "queue", text: "You added North Signal to your queue", ago: "8h", href: "/music/north-signal" },
];

/* Saved content — the user's saved items for quick resume */
export const SAVED_CONTENT: MediaObject[] = [
  ...TRACKS.filter((t) => ["midnight-transit", "glass-orchard"].includes(t.slug)),
  ...EPISODES.filter((e) => e.slug === "design-systems-weekly-42"),
  ...VIDEOS.filter((v) => v.slug === "silent-stage-live-session"),
];

export const CONVERSATIONS = [
  { id: "c1", name: "Ava Mirren", avatar: art("ava"), last: "Sent the stems — check the 2:14 mark.", ago: "3m", unread: 2 },
  { id: "c2", name: "Signal Fest Booking", avatar: art("signalfest"), last: "Contract attached for review.", ago: "2h", unread: 1 },
  { id: "c3", name: "Hollow Choir", avatar: art("hollow"), last: "Rehearsal moved to Thursday.", ago: "1d", unread: 0 },
];

export const NOTIFICATIONS = [
  { id: "n1", kind: "love", text: "Sable Room loved your note on Midnight Transit", ago: "8m", unread: true },
  { id: "n2", kind: "follow", text: "Ilya Verne started following you", ago: "40m", unread: true },
  { id: "n3", kind: "resing", text: "Marta Quinn resang Silent Stage", ago: "3h", unread: true },
  { id: "n4", kind: "live", text: "Kobo Lane is live now: Late Desk Session", ago: "5h", unread: false },
];

export const NOTES = [
  { id: "nt1", author: "Sable Room", avatar: art("sable"), at: "02:14", body: "That low pass sweep is the whole track." },
  { id: "nt2", author: "Ilya Verne", avatar: art("ilya"), at: "03:02", body: "Room noise left in — deliberate and correct." },
  { id: "nt3", author: "Hollow Choir", avatar: art("hollow"), at: "01:08", body: "Would love an instrumental cut of this." },
];

export const TRANSCRIPT = [
  { at: "00:00", body: "Intro: the minimalist approach to media tooling." },
  { at: "15:30", body: "Dieter Rams and the discipline of removal." },
  { at: "42:15", body: "Monochrome typography as a structural device." },
  { at: "58:00", body: "Tools of the trade, and what we stopped using." },
];

export const LYRICS = [
  "Hold the room still",
  "let the tape run long",
  "nothing here needs saying twice",
  "the silence is the song",
];

/* Sounds — trending audio snippets/sounds used in posts */
export interface SoundItem {
  objectId: string;
  slug: string;
  title: string;
  creator: string;
  artwork: string;
  uses: string;
}

export const SOUNDS: SoundItem[] = [
  { objectId: "s1", slug: "low-pass-sweep", title: "Low Pass Sweep", creator: "Sable Room", artwork: art("lowpass"), uses: "12.4K" },
  { objectId: "s2", slug: "tape-hiss-loop", title: "Tape Hiss Loop", creator: "Ava Mirren", artwork: art("tapehiss"), uses: "8.9K" },
  { objectId: "s3", slug: "modular-riser", title: "Modular Riser", creator: "Kobo Lane", artwork: art("modular"), uses: "6.2K" },
  { objectId: "s4", slug: "room-tone-pad", title: "Room Tone Pad", creator: "Ilya Verne", artwork: art("roomtone"), uses: "4.1K" },
];

export const ALL_OBJECTS = [...TRACKS, ...EPISODES, ...LIVE_NOW, ...VIDEOS];

export const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

/* Helper: find any object by slug across all catalogs */
export function findBySlug(slug: string): MediaObject | undefined {
  return ALL_OBJECTS.find((o) => o.slug === slug);
}

/* Helper: find a creator by handle */
export function findCreator(handle: string) {
  return CREATORS.find((c) => c.handle === handle);
}

/* Helper: find a playlist by slug */
export function findPlaylist(slug: string) {
  return PLAYLISTS.find((p) => p.slug === slug);
}

/* Helper: find an event by slug */
export function findEvent(slug: string) {
  return EVENTS.find((e) => e.slug === slug);
}
