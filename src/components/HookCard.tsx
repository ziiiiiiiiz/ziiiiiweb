"use client";

import { useState, useCallback } from "react";
import { HookResult } from "@/lib/types";
import { Copy, Check, Star } from "lucide-react";

interface Props {
  hook: HookResult;
  isFavorited: boolean;
  onToggleFavorite: (hook: HookResult) => void;
}

export default function HookCard({ hook, isFavorited, onToggleFavorite }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(hook.hook);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
    }
  }, [hook.hook]);

  return (
    <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm
                    hover:shadow-md transition-shadow">
      {/* 顶部：风格标签 + 评分 */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold
                         bg-neutral-100 text-neutral-600">
          {hook.styleTag}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-2xl font-extrabold text-neutral-900 tabular-nums">
            {hook.score}
          </span>
          <span className="text-xs text-neutral-400">/100</span>
        </div>
      </div>

      {/* Hook 文案 */}
      <p className="text-[15px] font-semibold text-neutral-900 leading-relaxed mb-3">
        &ldquo;{hook.hook}&rdquo;
      </p>

      {/* 分割线 */}
      <div className="border-t border-neutral-50 mb-3" />

      {/* 推荐理由 */}
      <p className="text-xs text-neutral-500 leading-relaxed mb-4">
        💡 {hook.reason}
      </p>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-2">
        <button
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     transition-all ${
                       copied
                         ? "bg-green-50 text-green-600"
                         : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                     }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              已复制
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              复制
            </>
          )}
        </button>
        <button
          onClick={() => onToggleFavorite(hook)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     transition-all ${
                       isFavorited
                         ? "bg-amber-50 text-amber-500"
                         : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                     }`}
        >
          <Star
            className={`w-3.5 h-3.5 ${isFavorited ? "fill-amber-500" : ""}`}
          />
          {isFavorited ? "已收藏" : "收藏"}
        </button>
      </div>
    </div>
  );
}
