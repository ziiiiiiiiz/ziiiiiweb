import { HistoryItem, FavoriteItem } from "./types";

const HISTORY_KEY = "hook-history";
const FAVORITES_KEY = "hook-favorites";

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}

export function addHistory(item: HistoryItem): void {
  const history = getHistory();
  history.unshift(item);
  saveHistory(history);
}

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(items: FavoriteItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
}

export function addFavorite(item: FavoriteItem): void {
  const favorites = getFavorites();
  favorites.unshift(item);
  saveFavorites(favorites);
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites().filter((f) => f.id !== id);
  saveFavorites(favorites);
}

export function isFavorited(id: string): boolean {
  return getFavorites().some((f) => f.id === id);
}
