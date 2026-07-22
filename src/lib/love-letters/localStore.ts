// Lightweight localStorage-backed user store (no real auth).

export type LocalUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string; // data URL or remote URL
  bio?: string;
  city?: string;
  createdAt: number;
};

export type WrittenLetter = {
  id: string;
  venueId: string;
  venueName: string;
  city: string;
  rating: number;
  message: string;
  createdAt: number;
};

const K_USER = "ll.user";
const K_SAVED = "ll.saved.venues"; // string[]
const K_LETTERS = "ll.letters"; // WrittenLetter[]
const K_HELPFUL = "ll.helpful"; // string[] (letter ids voted helpful)

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("ll:store", { detail: { key } }));
  } catch {
    /* noop */
  }
}

/* ---- User ---- */
export function getUser(): LocalUser | null {
  return read<LocalUser | null>(K_USER, null);
}
export function signIn(email: string, name?: string): LocalUser {
  const existing = getUser();
  const user: LocalUser = existing ?? {
    id: "u-" + Math.random().toString(36).slice(2, 9),
    name: name || email.split("@")[0],
    email,
    createdAt: Date.now(),
  };
  if (name && !existing) user.name = name;
  write(K_USER, user);
  return user;
}
export function updateUser(patch: Partial<LocalUser>): LocalUser | null {
  const u = getUser();
  if (!u) return null;
  const next = { ...u, ...patch };
  write(K_USER, next);
  return next;
}
export function signOut() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(K_USER);
  window.dispatchEvent(new CustomEvent("ll:store", { detail: { key: K_USER } }));
}

/* ---- Saved venues ---- */
export function getSavedVenueIds(): string[] {
  return read<string[]>(K_SAVED, []);
}
export function isSaved(venueId: string): boolean {
  return getSavedVenueIds().includes(venueId);
}
export function toggleSaved(venueId: string): boolean {
  const list = getSavedVenueIds();
  const idx = list.indexOf(venueId);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(venueId);
  write(K_SAVED, list);
  return idx < 0;
}

/* ---- Letters ---- */
export function getLetters(): WrittenLetter[] {
  return read<WrittenLetter[]>(K_LETTERS, []);
}
export function addLetter(l: Omit<WrittenLetter, "id" | "createdAt">): WrittenLetter {
  const letter: WrittenLetter = {
    ...l,
    id: "l-" + Math.random().toString(36).slice(2, 9),
    createdAt: Date.now(),
  };
  write(K_LETTERS, [letter, ...getLetters()]);
  return letter;
}

/* ---- Helpful votes ---- */
export function getHelpfulIds(): string[] {
  return read<string[]>(K_HELPFUL, []);
}
export function toggleHelpful(letterId: string): boolean {
  const list = getHelpfulIds();
  const idx = list.indexOf(letterId);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(letterId);
  write(K_HELPFUL, list);
  return idx < 0;
}

/* ---- React hook for reactive reads ---- */
import { useEffect, useState } from "react";
export function useLocalStore<T>(read: () => T): T {
  const [val, setVal] = useState<T>(() => read());
  useEffect(() => {
    const on = () => setVal(read());
    window.addEventListener("ll:store", on);
    window.addEventListener("storage", on);
    on();
    return () => {
      window.removeEventListener("ll:store", on);
      window.removeEventListener("storage", on);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return val;
}
