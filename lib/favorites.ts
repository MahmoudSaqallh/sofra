"use client";

import { useSyncExternalStore } from "react";

/* Favorite dishes (slugs), persisted in localStorage so the heart state survives reloads and feeds My Account. */

const STORAGE_KEY = "sufra-favorites-v1";
const EMPTY: string[] = [];
let favorites: string[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    favorites = Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : EMPTY;
  } catch {
    favorites = EMPTY;
  }
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return favorites;
}

export function toggleFavorite(slug: string) {
  commit(favorites.includes(slug) ? favorites.filter((s) => s !== slug) : [...favorites, slug]);
}

export function clearFavorites() {
  commit(EMPTY);
}

/** Puts back a previous list (undo after "مسح الكل"). */
export function restoreFavorites(slugs: string[]) {
  commit([...slugs]);
}

function commit(next: string[]) {
  favorites = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // Storage blocked: favorites last for this visit only.
  }
  listeners.forEach((l) => l());
}

/** Favorite slugs; empty during SSR/hydration. */
export function useFavorites() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}
