import { useAppStore } from "../store/useAppStore";

/**
 * 进度条组件
 * 显示百分比和当前处理的文件名
 */
export const ProgressBar = () => {
    const { progress, currentFile, isProcessing, files } = useAppStore();

    if (!isProcessing && progress === 0) return null;

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-4 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700">处理进度</span>
                <span className="text-xs font-mono font-medium text-slate-500">
                    {Math.round(progress)}%
                </span>
            </div>

            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out relative"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse w-full h-full" />
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                {currentFile ? (
                    <div className="flex items-center gap-1.5 truncate max-w-[80%]">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="truncate">{currentFile}</span>
                    </div>
                ) : (
                    <span>准备就绪</span>
                )}
                <span>{files.length} 个文件</span>
            </div>
        </div>
    );
};
