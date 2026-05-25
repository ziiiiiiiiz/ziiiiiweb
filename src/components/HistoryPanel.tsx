"use client";

import { HistoryItem, HookResult } from "@/lib/types";
import HookCard from "./HookCard";
import { FileText } from "lucide-react";

interface Props {
  history: HistoryItem[];
  favoritedIds: Set<string>;
  onToggleFavorite: (hook: HookResult) => void;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60_000) return "刚刚";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`;
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function HistoryPanel({
  history,
  favoritedIds,
  onToggleFavorite,
}: Props) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-300">
        <FileText className="w-12 h-12 mb-3" />
        <p className="text-sm text-neutral-400">暂无历史记录</p>
        <p className="text-xs text-neutral-300 mt-1">生成 Hook 后将自动保存在这里</p>
      </div>
    );
  }

  return (
    <div className="mx-4 mt-6 space-y-6">
      {history.map((item) => (
        <div key={item.id}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="text-xs font-medium text-neutral-400">
              {formatTime(item.createdAt)}
            </span>
            <span className="text-xs text-neutral-300">·</span>
            <span className="text-xs font-medium text-neutral-500">
              {item.topic}
            </span>
            <span className="text-xs text-neutral-300">·</span>
            <span className="text-xs text-neutral-400">
              {item.platform} / {item.contentType}
            </span>
          </div>
          <div className="space-y-3">
            {item.hooks.map((hook) => (
              <HookCard
                key={hook.id}
                hook={hook}
                isFavorited={favoritedIds.has(hook.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
