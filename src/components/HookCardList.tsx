"use client";

import { HookResult } from "@/lib/types";
import HookCard from "./HookCard";

interface Props {
  hooks: HookResult[] | null;
  isLoading: boolean;
  favoritedIds: Set<string>;
  onToggleFavorite: (hook: HookResult) => void;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-neutral-100 bg-white p-5 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-6 w-20 bg-neutral-100 rounded-full" />
        <div className="h-8 w-14 bg-neutral-100 rounded" />
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-neutral-100 rounded w-full" />
        <div className="h-4 bg-neutral-100 rounded w-3/4" />
      </div>
      <div className="border-t border-neutral-50 mb-3" />
      <div className="h-3 bg-neutral-100 rounded w-2/3 mb-4" />
      <div className="flex justify-end gap-2">
        <div className="h-7 w-14 bg-neutral-100 rounded-lg" />
        <div className="h-7 w-14 bg-neutral-100 rounded-lg" />
      </div>
    </div>
  );
}

export default function HookCardList({
  hooks,
  isLoading,
  favoritedIds,
  onToggleFavorite,
}: Props) {
  if (isLoading) {
    return (
      <div className="mx-4 mt-6 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!hooks) return null;

  return (
    <div className="mx-4 mt-6 space-y-4">
      {hooks.map((hook) => (
        <HookCard
          key={hook.id}
          hook={hook}
          isFavorited={favoritedIds.has(hook.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
