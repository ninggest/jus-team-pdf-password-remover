import { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { open } from "@tauri-apps/plugin-dialog";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

/**
 * 文件夹选择与拖放组件
 * 已优化：使用 Tauri 原生拖拽事件，防止 Webview 导航导致的卡死
 */
export const FileDropzone = () => {
    const { setInputFolder, inputFolder, isProcessing } = useAppStore();
    const [isDragActive, setIsDragActive] = useState(false);

    /**
     * 初始化时监听全窗口的原生拖拽事件
     */
    useEffect(() => {
        const unlisten = getCurrentWebviewWindow().listen<any>("tauri://drag-drop", (event) => {
            setIsDragActive(false);
            const paths = event.payload.paths;
            if (paths && paths.length > 0) {
                // 取第一个路径作为输入文件夹
                setInputFolder(paths[0]);
            }
        });

        const unlistenOver = getCurrentWebviewWindow().listen<any>("tauri://drag-over", () => {
            if (!isProcessing) setIsDragActive(true);
        });

        const unlistenLeave = getCurrentWebviewWindow().listen<any>("tauri://drag-leave", () => {
            setIsDragActive(false);
        });

        return () => {
            unlisten.then(f => f());
            unlistenOver.then(f => f());
            unlistenLeave.then(f => f());
        };
    }, [setInputFolder, isProcessing]);

    /**
     * 点击时弹出系统原生文件夹选择器
     */
    const handleSelectFolder = async () => {
        if (isProcessing) return;

        try {
            const selected = await open({
                directory: true,
                multiple: false,
                title: "选择包含 PDF 的文件夹",
            });

            const path = Array.isArray(selected) ? selected[0] : selected;
            if (path) {
                setInputFolder(path);
            }
        } catch (error) {
            console.error("手动选择文件夹失败:", error);
        }
    };

    return (
        <section
            onClick={handleSelectFolder}
            className={`bg-white p-12 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${isDragActive ? "border-blue-500 bg-blue-50/30 scale-[1.02]" : "border-slate-200 hover:border-blue-400"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            <div className={`p-4 rounded-full transition-colors ${isDragActive ? "bg-blue-100 text-blue-600" : "bg-blue-50 text-blue-500"
                }`}>
                <FolderOpen size={32} />
            </div>
            <div className="text-center">
                <p className="font-medium text-slate-800">
                    {inputFolder ? "已选择文件夹" : "拖拽文件夹到此处"}
                </p>
                <div className="flex flex-col items-center gap-1 mt-1">
                    {inputFolder ? (
                        <span className="text-sm text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded truncate max-w-md">
                            {inputFolder}
                        </span>
                    ) : (
                        <p className="text-sm text-slate-500">或点击本区域浏览选择包含 PDF 的目录</p>
                    )}
                </div>
            </div>
        </section>
    );
};
