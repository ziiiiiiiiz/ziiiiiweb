export type Platform = "小红书" | "抖音" | "B站" | "YouTube" | "X";

export type ContentType = "视频" | "图文" | "产品广告" | "教程" | "观点帖";

export interface HookResult {
  id: string;
  hook: string;
  styleTag: string;
  score: number;
  reason: string;
}

export interface HistoryItem {
  id: string;
  topic: string;
  platform: Platform;
  contentType: ContentType;
  hooks: HookResult[];
  createdAt: number;
}

export interface FavoriteItem {
  id: string;
  hook: string;
  styleTag: string;
  score: number;
  reason: string;
  topic: string;
  platform: Platform;
  contentType: ContentType;
  savedAt: number;
}

export type AppView = "results" | "history" | "favorites";

export type AppStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

export interface AppError {
  type: "api_not_configured" | "network" | "api_error" | "timeout";
  message: string;
}

export const PLATFORMS: Platform[] = ["小红书", "抖音", "B站", "YouTube", "X"];
export const CONTENT_TYPES: ContentType[] = ["视频", "图文", "产品广告", "教程", "观点帖"];

export const STYLE_POOL: string[] = [
  "悬念", "痛点", "反常识", "共鸣", "好奇", "挑战", "急迫", "幽默",
  "数字列举", "提问反问", "对比反差", "故事开头", "金句格言", "数据震撼", "场景代入", "身份标签"
];
