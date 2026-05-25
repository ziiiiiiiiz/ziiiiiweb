"use client";

import { AppView } from "@/lib/types";
import { Sparkles, Clock, Star } from "lucide-react";

interface Props {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  historyCount: number;
  favoritesCount: number;
}

const tabs: { key: AppView; label: string; icon: typeof Sparkles }[] = [
  { key: "results", label: "生成结果", icon: Sparkles },
  { key: "history", label: "历史", icon: Clock },
  { key: "favorites", label: "收藏", icon: Star },
];

export default function BottomTabs({
  activeView,
  onViewChange,
  historyCount,
  favoritesCount,
}: Props) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-neutral-100 mt-8">
      <div className="flex max-w-screen-sm mx-auto">
        {tabs.map((tab) => {
          const isActive = activeView === tab.key;
          const count =
            tab.key === "history"
              ? historyCount
              : tab.key === "favorites"
                ? favoritesCount
                : null;

          return (
            <button
              key={tab.key}
              onClick={() => onViewChange(tab.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors
                ${isActive ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"}`}
            >
              <div className="relative">
                <tab.icon className="w-5 h-5" />
                {count !== null && count > 0 && (
                  <span className="absolute -top-1.5 -right-3 text-[10px] font-bold
                                   text-neutral-400">
                    {count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
