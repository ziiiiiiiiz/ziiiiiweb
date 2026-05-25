"use client";

import { FavoriteItem, HookResult } from "@/lib/types";
import HookCard from "./HookCard";
import { Star } from "lucide-react";

interface Props {
  favorites: FavoriteItem[];
  onToggleFavorite: (hook: HookResult) => void;
}

export default function FavoritesPanel({ favorites, onToggleFavorite }: Props) {
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-300">
        <Star className="w-12 h-12 mb-3" />
        <p className="text-sm text-neutral-400">暂无收藏</p>
        <p className="text-xs text-neutral-300 mt-1">点击 Hook 卡片的收藏按钮添加</p>
      </div>
    );
  }

  const favoritedIds = new Set(favorites.map((f) => f.id));

  return (
    <div className="mx-4 mt-6 space-y-4">
      {favorites.map((fav) => (
        <div key={fav.id}>
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-xs text-neutral-400">
              来自: {fav.topic} · {fav.platform} · {fav.contentType}
            </span>
          </div>
          <HookCard
            hook={{
              id: fav.id,
              hook: fav.hook,
              styleTag: fav.styleTag,
              score: fav.score,
              reason: fav.reason,
            }}
            isFavorited={true}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      ))}
    </div>
  );
}
