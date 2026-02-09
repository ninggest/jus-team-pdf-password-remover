import { useAppStore } from "../store/useAppStore";
import { FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

/**
 * PDF 文件列表组件
 */
export const FileList = () => {
    const { files, isProcessing } = useAppStore();

    if (files.length === 0) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full max-h-[400px]">
            <div className="px-4 py-3 border-b bg-slate-50 flex items-center justify-between sticky top-0 z-10">
                <h3 className="font-semibold text-slate-700 text-sm">任务清单 ({files.length})</h3>
                {isProcessing && (
                    <span className="text-xs text-blue-600 animate-pulse font-medium">处理中...</span>
                )}
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {files.map((file, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-3 p-2.5 rounded-lg text-sm transition-colors ${file.status === "processing"
                                ? "bg-blue-50 border border-blue-100"
                                : "hover:bg-slate-50 border border-transparent"
                            }`}
                    >
                        <div className={`p-1.5 rounded-md ${file.status === "error" ? "bg-red-50 text-red-500" :
                                file.status === "success" ? "bg-green-50 text-green-600" :
                                    "bg-slate-100 text-slate-500"
                            }`}>
                            <FileText size={16} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-700 truncate" title={file.name}>
                                {file.name}
                            </p>
                            <p className="text-xs text-slate-400 truncate font-mono" title={file.path}>
                                {file.path}
                            </p>
                        </div>

                        <div className="shrink-0">
                            {file.status === "success" && (
                                <CheckCircle2 size={18} className="text-green-500" />
                            )}
                            {file.status === "error" && (
                                <div className="group relative">
                                    <AlertCircle size={18} className="text-red-500 cursor-help" />
                                    {file.error && (
                                        <div className="absolute right-0 top-full mt-1 w-48 p-2 bg-red-800 text-white text-xs rounded shadow-lg z-20 hidden group-hover:block">
                                            {file.error}
                                        </div>
                                    )}
                                </div>
                            )}
                            {file.status === "processing" && (
                                <Loader2 size={18} className="text-blue-500 animate-spin" />
                            )}
                            {file.status === "pending" && (
                                <div className="w-2 h-2 rounded-full bg-slate-300 mx-1" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
