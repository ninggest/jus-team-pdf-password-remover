import { create } from "zustand";
import { PDFFile, AppSettings } from "../types";

/**
 * 应用程序全局状态接口
 */
interface AppState {
    inputFolder: string | null;
    outputFolder: string | null;
    password: string;
    files: PDFFile[];
    isProcessing: boolean;
    progress: number;
    currentFile: string | null;
    settings: AppSettings;

    // Actions
    setInputFolder: (path: string | null) => void;
    setOutputFolder: (path: string | null) => void;
    setPassword: (password: string) => void;
    setFiles: (files: PDFFile[]) => void;
    setProcessing: (status: boolean) => void;
    updateProgress: (progress: number, currentFile: string | null) => void;
    updateFileStatus: (filePath: string, status: PDFFile["status"], error?: string) => void;
    updateSettings: (settings: Partial<AppSettings>) => void;
    resetProgress: () => void;
}

/**
 * 创建 Zustand Store (无深色模式)
 */
export const useAppStore = create<AppState>((set) => ({
    inputFolder: null,
    outputFolder: null,
    password: "",
    files: [],
    isProcessing: false,
    progress: 0,
    currentFile: null,
    settings: {
        includeSubfolders: true,
        preserveStructure: true,
        autoOpenOutput: true,
    },

    setInputFolder: (path: string | null) => set((state: AppState) => ({
        inputFolder: path,
        outputFolder: state.outputFolder || path
    })),
    setOutputFolder: (path: string | null) => set({ outputFolder: path }),
    setPassword: (password: string) => set({ password }),
    setFiles: (files: PDFFile[]) => set({ files }),
    setProcessing: (status: boolean) => set({ isProcessing: status }),
    updateProgress: (progress: number, currentFile: string | null) => set({ progress, currentFile }),
    updateFileStatus: (filePath: string, status: PDFFile["status"], error?: string) =>
        set((state: AppState) => ({
            files: state.files.map((f: PDFFile) =>
                f.path === filePath ? { ...f, status, error } : f
            ),
        })),
    updateSettings: (newSettings: Partial<AppSettings>) =>
        set((state: AppState) => ({ settings: { ...state.settings, ...newSettings } })),
    resetProgress: () => set({ progress: 0, currentFile: null, isProcessing: false }),
}));
