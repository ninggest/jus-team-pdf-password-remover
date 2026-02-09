import { useAppStore } from "../store/useAppStore";

/**
 * 底部状态栏组件
 */
export const StatusBar = () => {
    const { isProcessing, progress } = useAppStore();

    const getStatusText = () => {
        if (isProcessing) return `正在处理... ${progress}%`;
        return "就绪";
    };

    return (
        <div className="bg-white border-t p-2 text-xs text-slate-500 font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isProcessing ? "bg-amber-400 animate-pulse" : "bg-green-400"
                    }`} />
                {getStatusText()}
            </span>
            <span>Justeam PDF Toolbox v1.0</span>
        </div>
    );
};
