"use client";

import { useState, useCallback, useMemo } from "react";
import { nanoid } from "nanoid";
import {
  Platform,
  ContentType,
  HookResult,
  HistoryItem,
  FavoriteItem,
  AppView,
  AppError,
} from "@/lib/types";
import { addHistory, getHistory, addFavorite, removeFavorite, getFavorites } from "@/lib/storage";

import Header from "@/components/Header";
import InputPanel from "@/components/InputPanel";
import ErrorBanner from "@/components/ErrorBanner";
import HookCardList from "@/components/HookCardList";
import BottomTabs from "@/components/BottomTabs";
import HistoryPanel from "@/components/HistoryPanel";
import FavoritesPanel from "@/components/FavoritesPanel";

export default function HomePage() {
  const [hooks, setHooks] = useState<HookResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [activeView, setActiveView] = useState<AppView>("results");

  // localStorage 数据用 state + 直接读写（简单场景不需要 hook）
  const [history, setHistory] = useState<HistoryItem[]>(getHistory);
  const [favorites, setFavorites] = useState<FavoriteItem[]>(getFavorites);
  const [lastTopic, setLastTopic] = useState("");
  const [lastPlatform, setLastPlatform] = useState<Platform>("小红书");
  const [lastContentType, setLastContentType] = useState<ContentType>("图文");

  const favoritedIds = useMemo(
    () => new Set(favorites.map((f) => f.id)),
    [favorites]
  );

  const handleGenerate = useCallback(
    async (topic: string, platform: Platform, contentType: ContentType) => {
      setIsLoading(true);
      setError(null);
      setHooks(null);
      setLastTopic(topic);
      setLastPlatform(platform);
      setLastContentType(contentType);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, platform, contentType }),
        });

        const data = await res.json();

        if (!res.ok) {
          const errorType =
            data.error === "API_NOT_CONFIGURED"
              ? "api_not_configured"
              : data.error === "TIMEOUT"
                ? "timeout"
                : data.error === "NETWORK"
                  ? "network"
                  : "api_error";

          setError({ type: errorType as AppError["type"], message: data.message || "未知错误" });
          return;
        }

        const generatedHooks = data.hooks as HookResult[];
        setHooks(generatedHooks);
        setActiveView("results");

        // 保存历史
        const historyItem: HistoryItem = {
          id: nanoid(),
          topic,
          platform,
          contentType,
          hooks: generatedHooks,
          createdAt: Date.now(),
        };
        addHistory(historyItem);
        setHistory(getHistory());
      } catch {
        setError({ type: "network", message: "网络连接失败，请检查网络" });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleToggleFavorite = useCallback(
    (hook: HookResult) => {
      const existing = favorites.find((f) => f.id === hook.id);
      if (existing) {
        removeFavorite(hook.id);
      } else {
        addFavorite({
          id: hook.id,
          hook: hook.hook,
          styleTag: hook.styleTag,
          score: hook.score,
          reason: hook.reason,
          topic: lastTopic,
          platform: lastPlatform,
          contentType: lastContentType,
          savedAt: Date.now(),
        });
      }
      setFavorites(getFavorites());
    },
    [favorites, lastTopic, lastPlatform, lastContentType]
  );

  const handleRetry = useCallback(() => {
    if (lastTopic) {
      handleGenerate(lastTopic, lastPlatform, lastContentType);
    }
  }, [lastTopic, lastPlatform, lastContentType, handleGenerate]);

  return (
    <div className="max-w-screen-sm mx-auto min-h-screen flex flex-col pb-16">
      <Header />

      <InputPanel onGenerate={handleGenerate} isLoading={isLoading} />

      {error && <div className="mt-4"><ErrorBanner error={error} onRetry={error.type !== "api_not_configured" ? handleRetry : undefined} /></div>}

      <div className="flex-1">
        {activeView === "results" && (
          <>
            {!hooks && !isLoading && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-300">
                <div className="text-4xl mb-3">✨</div>
                <p className="text-sm text-neutral-400">输入主题开始生成爆款 Hook</p>
                <p className="text-xs text-neutral-300 mt-1">每次生成 10 条不同风格的开头文案</p>
              </div>
            )}
            <HookCardList
              hooks={hooks}
              isLoading={isLoading}
              favoritedIds={favoritedIds}
              onToggleFavorite={handleToggleFavorite}
            />
          </>
        )}

        {activeView === "history" && (
          <HistoryPanel
            history={history}
            favoritedIds={favoritedIds}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeView === "favorites" && (
          <FavoritesPanel
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>

      <BottomTabs
        activeView={activeView}
        onViewChange={setActiveView}
        historyCount={history.length}
        favoritesCount={favorites.length}
      />
    </div>
  );
}
