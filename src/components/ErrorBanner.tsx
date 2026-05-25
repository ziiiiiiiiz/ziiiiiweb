import { AppError } from "@/lib/types";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  error: AppError;
  onRetry?: () => void;
}

export default function ErrorBanner({ error, onRetry }: Props) {
  return (
    <div className="mx-4 mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-800">{error.message}</p>
        {error.type === "api_not_configured" && (
          <p className="text-xs text-amber-600 mt-1">
            请在项目根目录的 .env.local 文件中设置 API_BASE_URL、API_KEY 和 API_MODEL
          </p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          重试
        </button>
      )}
    </div>
  );
}
