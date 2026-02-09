import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useAppStore } from "../store/useAppStore";

/**
 * 密码输入组件（带可见性切换）
 */
export const PasswordInput = () => {
    const { password, setPassword, isProcessing } = useAppStore();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Lock size={14} className="text-blue-500" />
                    PDF 访问密码
                </label>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    统一密码
                </span>
            </div>

            <div className="relative group">
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isProcessing}
                    placeholder="请输入解密密码..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300 disabled:bg-slate-50 disabled:text-slate-400"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <p className="px-1 text-xs text-slate-400 italic">
                * 如果文件夹内有不同密码的文件，请分批次处理
            </p>
        </div>
    );
};
