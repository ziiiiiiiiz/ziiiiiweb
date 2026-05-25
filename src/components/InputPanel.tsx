"use client";

import { useState } from "react";
import { Platform, ContentType, PLATFORMS, CONTENT_TYPES } from "@/lib/types";
import { Sparkles, Loader2 } from "lucide-react";

interface Props {
  onGenerate: (topic: string, platform: Platform, contentType: ContentType) => void;
  isLoading: boolean;
}

export default function InputPanel({ onGenerate, isLoading }: Props) {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("小红书");
  const [contentType, setContentType] = useState<ContentType>("图文");

  const canSubmit = topic.trim().length > 0 && !isLoading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onGenerate(topic.trim(), platform, contentType);
  };

  return (
    <div className="mx-4 space-y-5">
      {/* 主题输入 */}
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="输入你的内容主题，例如：AI 写作工具、早起打卡、减脂食谱..."
        rows={3}
        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm
                   placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900
                   focus:border-transparent resize-none transition-shadow"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />

      {/* 平台选择 */}
      <div>
        <p className="text-xs font-medium text-neutral-400 mb-2">选择平台</p>
        <div className="flex gap-2 flex-wrap">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${
                  platform === p
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 内容类型选择 */}
      <div>
        <p className="text-xs font-medium text-neutral-400 mb-2">内容类型</p>
        <div className="flex gap-2 flex-wrap">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct}
              onClick={() => setContentType(ct)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${
                  contentType === ct
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
            >
              {ct}
            </button>
          ))}
        </div>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full py-3 rounded-xl bg-neutral-900 text-white font-semibold text-sm
                   hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400
                   transition-all flex items-center justify-center gap-2
                   disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            生成中...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            生成 10 条 Hook
          </>
        )}
      </button>
    </div>
  );
}
