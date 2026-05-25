import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { STYLE_POOL } from "@/lib/types";

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;
const API_MODEL = process.env.API_MODEL;

const SYSTEM_PROMPT = `你是一个顶级专业文案策划师，擅长为各大内容平台（小红书、抖音、B站、YouTube、X）创作爆款内容的开头 Hook。

你的任务：根据用户提供的主题、平台和内容类型，生成 10 条不同风格的 Hook 开头文案。

要求：
1. 每条 Hook 必须来自不同的风格角度，避免重复
2. 参考风格池：${STYLE_POOL.join("、")}
3. 针对指定平台的受众特点调整语气和表达方式
4. 每条 Hook 给出 0-100 的点击欲评分
5. 每条 Hook 给出简短的推荐理由（为什么这个 Hook 有效）

返回纯 JSON 数组（不要 markdown 代码块包裹）：
[
  {
    "hook": "Hook 文案内容",
    "styleTag": "风格标签",
    "score": 92,
    "reason": "推荐理由"
  }
  // ... 共 10 条
]`;

export async function POST(request: NextRequest) {
  if (!API_BASE_URL || !API_KEY || !API_MODEL) {
    return NextResponse.json(
      {
        error: "API_NOT_CONFIGURED",
        message: "请先在 .env.local 中配置 API_BASE_URL、API_KEY 和 API_MODEL",
      },
      { status: 500 }
    );
  }

  let body: { topic?: string; platform?: string; contentType?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "INVALID_REQUEST", message: "请求格式错误" },
      { status: 400 }
    );
  }

  const { topic, platform, contentType } = body;
  if (!topic || !platform || !contentType) {
    return NextResponse.json(
      { error: "MISSING_FIELDS", message: "请填写主题、平台和内容类型" },
      { status: 400 }
    );
  }

  const userMessage = `请为主题"${topic}"生成 10 条 Hook。
目标平台：${platform}
内容类型：${contentType}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: API_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.9,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: "API_ERROR", message: `大模型 API 返回错误: ${response.status} ${errText}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "API_ERROR", message: "大模型返回内容为空" },
        { status: 502 }
      );
    }

    // 解析 JSON：清除可能的 markdown 代码块包裹
    let cleaned = content.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }

    let hooks;
    try {
      hooks = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "PARSE_ERROR", message: "大模型返回格式异常，请重试" },
        { status: 502 }
      );
    }

    if (!Array.isArray(hooks) || hooks.length === 0) {
      return NextResponse.json(
        { error: "PARSE_ERROR", message: "大模型返回数据为空" },
        { status: 502 }
      );
    }

    const result = hooks.slice(0, 10).map((h: Record<string, unknown>) => ({
      id: nanoid(),
      hook: String(h.hook || ""),
      styleTag: String(h.styleTag || "通用"),
      score: Math.min(100, Math.max(0, Number(h.score) || 70)),
      reason: String(h.reason || ""),
    }));

    return NextResponse.json({ hooks: result });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === "AbortError") {
      return NextResponse.json(
        { error: "TIMEOUT", message: "请求超时，请重试" },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "NETWORK", message: "网络连接失败，请检查网络" },
      { status: 502 }
    );
  }
}
