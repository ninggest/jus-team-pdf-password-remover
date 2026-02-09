import { useState, useEffect } from "react";
import { message } from "@tauri-apps/plugin-dialog";
import { Settings as SettingsIcon, Info, Play, X, FolderSearch, ExternalLink } from "lucide-react";
import { API } from "./lib/api";
import { useAppStore } from "./store/useAppStore";
import { usePdfProcessor } from "./hooks/usePdfProcessor";
import { FileDropzone } from "./components/FileDropzone";
import { ProgressBar } from "./components/ProgressBar";
import { FileList } from "./components/FileList";
import { PasswordInput } from "./components/PasswordInput";
import { StatusBar } from "./components/StatusBar";
import { Settings } from "./components/Settings";
import { open } from "@tauri-apps/plugin-dialog";

function App() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const {
        inputFolder,
        outputFolder,
        password,
        isProcessing,
        setOutputFolder,
        settings,
        updateSettings,
        files
    } = useAppStore();

    const { startProcessing, scanFiles } = usePdfProcessor();

    /**
     * 阻止浏览器默认的拖拽行为（防止导航/卡死）
     */
    useEffect(() => {
        const preventDefault = (e: DragEvent) => e.preventDefault();
        window.addEventListener("dragover", preventDefault);
        window.addEventListener("drop", preventDefault);
        return () => {
            window.removeEventListener("dragover", preventDefault);
            window.removeEventListener("drop", preventDefault);
        };
    }, []);

    /**
     * 选择输出文件夹
     */
    const handleSelectOutput = async () => {
        if (isProcessing) return;
        try {
            const selected = await open({
                directory: true,
                multiple: false,
                title: "选择保存结果的文件夹",
            });

            // 处理不同返回格式 (Tauri 2.0 可能返回 string 或 string[])
            const path = Array.isArray(selected) ? selected[0] : selected;
            if (path) {
                setOutputFolder(path);
            }
        } catch (error) {
            console.error("选择文件夹失败:", error);
        }
    };

    /**
     * 打开输出文件夹
     */
    const handleOpenOutput = () => {
        if (outputFolder) {
            API.revealInExplorer(outputFolder);
        }
    };

    /**
     * 启动处理逻辑
     */
    const handleStart = async () => {
        if (!inputFolder || !outputFolder || !password) {
            return;
        }
        await startProcessing();
    };

    /**
     * 显示版权信息
     */
    const handleShowCopyright = async () => {
        await message("Copyright (c) 2026 Zane v1.0.0", { title: "关于 Justeam PDF 密码移除器", kind: "info" });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans select-none">
            {/* 顶部标题栏 */}
            <header className="h-12 bg-white border-b flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="w-6 h-6 rounded" />
                    <span className="font-semibold text-slate-700 tracking-tight">Jus Team PDF 密码移除器</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full font-medium">v1.0.0</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                        title="设置"
                    >
                        <SettingsIcon size={18} />
                    </button>
                    <button
                        onClick={handleShowCopyright}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                        title="关于"
                    >
                        <Info size={18} />
                    </button>
                </div>
            </header>

            {/* 主界面内容 */}
            <main className="flex-1 overflow-y-auto p-6 scrollbox">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* 文件扫描区域 */}
                    <FileDropzone />

                    {/* 核心配置区域 */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            {/* 输入/输出路径汇总 */}
                            <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">输入源</label>
                                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100 min-h-[36px]">
                                        <span className="text-sm truncate flex-1 text-slate-600">
                                            {inputFolder || "尚未选择文件夹"}
                                        </span>
                                        <button
                                            onClick={scanFiles}
                                            disabled={!inputFolder || isProcessing}
                                            className="p-1 hover:bg-white rounded text-blue-500 disabled:opacity-30"
                                            title="重新扫描"
                                        >
                                            <FolderSearch size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">输出目标</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-slate-50 p-2 rounded border border-slate-100 text-sm truncate text-slate-600">
                                            {outputFolder || "请选择输出路径"}
                                        </div>
                                        <button
                                            onClick={handleSelectOutput}
                                            disabled={isProcessing}
                                            className="px-3 py-1 bg-white border rounded text-sm hover:bg-slate-50 font-medium whitespace-nowrap"
                                        >
                                            选择
                                        </button>
                                        {outputFolder && (
                                            <button
                                                onClick={handleOpenOutput}
                                                className="p-2 bg-blue-50 text-blue-600 rounded border border-blue-100 hover:bg-blue-100 transition-colors"
                                                title="打开输出目录"
                                            >
                                                <ExternalLink size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 选项配置 */}
                            <div className="flex flex-col gap-3 px-1 mt-2">
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={settings.includeSubfolders}
                                        onChange={(e) => updateSettings({ includeSubfolders: e.target.checked })}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                                    />
                                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">递归包含所有子文件夹</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={settings.preserveStructure}
                                        onChange={(e) => updateSettings({ preserveStructure: e.target.checked })}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                                    />
                                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">输出时保留原始文件夹结构</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* 密码输入 */}
                            <div className="p-4 bg-white border rounded-xl shadow-sm h-full flex flex-col justify-center">
                                <PasswordInput />
                            </div>
                        </div>
                    </section>

                    {/* 实时进度反馈 */}
                    <ProgressBar />

                    {/* 文件处理列表 */}
                    <FileList />
                </div>
            </main>

            {/* 底部操作栏 */}
            <footer className="h-16 bg-white border-t px-6 flex items-center justify-between shrink-0 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
                <StatusBar />

                <div className="flex gap-3">
                    <button
                        onClick={handleStart}
                        disabled={isProcessing || !inputFolder || !outputFolder || !password || files.length === 0}
                        className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:transform active:scale-95 flex items-center gap-2 transition-all shadow-md shadow-blue-200 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
                    >
                        <Play size={18} fill="currentColor" />
                        开始处理任务
                    </button>
                    <button
                        disabled={!isProcessing}
                        className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-semibold hover:bg-slate-200 flex items-center gap-2 transition-all disabled:opacity-30"
                    >
                        <X size={18} />
                        停止
                    </button>
                </div>
            </footer>

            {/* 设置模态框 */}
            <Settings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}

export default App;
