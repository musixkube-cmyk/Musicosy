"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { MediaObject } from "../data/demo";
import { TRACKS } from "../data/demo";

const FIRST = TRACKS[0]!;

export type RailPanel =
  | "notes"
  | "queue"
  | "lyrics"
  | "transcript"
  | "chapters"
  | "chat"
  | "participants"
  | "details"
  | "activity"
  | "collaborators";

export type MemberContext = "personal" | "workspace";

interface ShellState {
  active: MediaObject | null;
  isPlaying: boolean;
  position: number;
  queue: MediaObject[];
  volume: number;
  panel: RailPanel;
  railCollapsed: boolean;
  searchOpen: boolean;
  overlay: string | null;
  memberContext: MemberContext;
  loved: Record<string, boolean>;
  saved: Record<string, boolean>;
  followed: Record<string, boolean>;
  playObject: (o: MediaObject, panel?: RailPanel) => void;
  focusObject: (o: MediaObject, panel?: RailPanel) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  addToQueue: (o: MediaObject) => void;
  playNext: (o: MediaObject) => void;
  removeFromQueue: (id: string) => void;
  setPanel: (p: RailPanel) => void;
  toggleRail: () => void;
  setSearchOpen: (v: boolean) => void;
  openOverlay: (id: string) => void;
  closeOverlay: () => void;
  setMemberContext: (c: MemberContext) => void;
  toggleLove: (o: MediaObject) => void;
  toggleSave: (o: MediaObject) => void;
  toggleFollow: (handle: string) => void;
  focused: MediaObject;
}

const ShellContext = createContext<ShellState | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<MediaObject | null>(null);
  const [focused, setFocused] = useState<MediaObject>(FIRST);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [queue, setQueue] = useState<MediaObject[]>(TRACKS.slice(1, 5));
  const [volume, setVolume] = useState(70);
  const [panel, setPanel] = useState<RailPanel>("notes");
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [overlay, setOverlay] = useState<string | null>(null);
  const [memberContext, setMemberContext] = useState<MemberContext>("personal");
  const [loved, setLoved] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  const playObject = useCallback((o: MediaObject, p?: RailPanel) => {
    setActive(o);
    setFocused(o);
    setPosition(0);
    setIsPlaying(true);
    if (p) setPanel(p);
  }, []);

  const focusObject = useCallback((o: MediaObject, p?: RailPanel) => {
    setFocused(o);
    if (p) setPanel(p);
    setRailCollapsed(false);
  }, []);

  const next = useCallback(() => {
    setQueue((q) => {
      const head = q[0];
      if (!head) return q;
      setActive(head);
      setFocused(head);
      setPosition(0);
      setIsPlaying(true);
      return q.slice(1);
    });
  }, []);

  const previous = useCallback(() => setPosition(0), []);

  // Real playback clock — advances position every second while playing.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!isPlaying || !active) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setPosition((p) => {
        if (active.live) return p;
        if (p >= active.duration) {
          // auto-advance
          return p;
        }
        return p + 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, active]);

  // Keyboard shortcut: '/' opens search, 'space' toggles play
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (isTyping) return;
      if (e.key === "/") {
        e.preventDefault();
        setSearchOpen((s) => !s);
      } else if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
        setOverlay(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo<ShellState>(
    () => ({
      active,
      focused,
      isPlaying,
      position,
      queue,
      volume,
      panel,
      railCollapsed,
      searchOpen,
      overlay,
      memberContext,
      loved,
      saved,
      followed,
      playObject,
      focusObject,
      togglePlay: () => setIsPlaying((p) => !p),
      next,
      previous,
      seek: setPosition,
      setVolume,
      addToQueue: (o) => setQueue((q) => [...q, o]),
      playNext: (o) => setQueue((q) => [o, ...q]),
      removeFromQueue: (id) => setQueue((q) => q.filter((i) => i.objectId !== id)),
      setPanel,
      toggleRail: () => setRailCollapsed((c) => !c),
      setSearchOpen,
      openOverlay: setOverlay,
      closeOverlay: () => setOverlay(null),
      setMemberContext,
      toggleLove: (o) => setLoved((l) => ({ ...l, [o.objectId]: !l[o.objectId] })),
      toggleSave: (o) => setSaved((s) => ({ ...s, [o.objectId]: !s[o.objectId] })),
      toggleFollow: (h) => setFollowed((f) => ({ ...f, [h]: !f[h] })),
    }),
    [
      active,
      focused,
      isPlaying,
      position,
      queue,
      volume,
      panel,
      railCollapsed,
      searchOpen,
      overlay,
      memberContext,
      loved,
      saved,
      followed,
      playObject,
      focusObject,
      next,
      previous,
    ],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used inside AppShellProvider");
  return ctx;
}
