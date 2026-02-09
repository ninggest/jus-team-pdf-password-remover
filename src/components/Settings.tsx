import { X } from "lucide-react";
import { useAppStore } from "../store/useAppStore";

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * 设置面板组件 (已移除深色模式)
 */
export const Settings = ({ isOpen, onClose }: SettingsProps) => {
    const { settings, updateSettings } = useAppStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-slate-800">设置</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* 包含子文件夹 */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium text-slate-700 block">
                                递归扫描子文件夹
                            </label>
                            <p className="text-xs text-slate-500">
                                扫描所选目录下的所有嵌套文件夹
                            </p>
                        </div>
                        <button
                            onClick={() =>
                                updateSettings({ includeSubfolders: !settings.includeSubfolders })
                            }
                            className={`w-11 h-6 flex items-center rounded-full transition-colors p-1 ${settings.includeSubfolders ? "bg-blue-500" : "bg-slate-200"
                                }`}
                        >
                            <div
                                className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${settings.includeSubfolders ? "translate-x-5" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>

                    {/* 保持目录结构 */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium text-slate-700 block">
                                保持目录结构
                            </label>
                            <p className="text-xs text-slate-500">
                                处理后的文件将保持原有的目录层级
                            </p>
                        </div>
                        <button
                            onClick={() =>
                                updateSettings({ preserveStructure: !settings.preserveStructure })
                            }
                            className={`w-11 h-6 flex items-center rounded-full transition-colors p-1 ${settings.preserveStructure ? "bg-blue-500" : "bg-slate-200"
                                }`}
                        >
                            <div
                                className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${settings.preserveStructure ? "translate-x-5" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>

                    {/* 自动可以打开输出目录 */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium text-slate-700 block">
                                自动打开输出文件夹
                            </label>
                            <p className="text-xs text-slate-500">
                                批量处理完成后自动打开结果位置
                            </p>
                        </div>
                        <button
                            onClick={() =>
                                updateSettings({ autoOpenOutput: !settings.autoOpenOutput })
                            }
                            className={`w-11 h-6 flex items-center rounded-full transition-colors p-1 ${settings.autoOpenOutput ? "bg-blue-500" : "bg-slate-200"
                                }`}
                        >
                            <div
                                className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${settings.autoOpenOutput ? "translate-x-5" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                        完成
                    </button>
                </div>
            </div>
        </div>
    );
};
