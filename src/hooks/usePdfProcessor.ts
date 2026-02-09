import { useEffect, useCallback, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import { API } from "../lib/api";
import { useAppStore } from "../store/useAppStore";
import { ProcessingEvent } from "../types";

/**
 * PDF 处理业务逻辑 Hook
 */
export const usePdfProcessor = () => {
    const {
        inputFolder,
        outputFolder,
        password,
        settings,
        setFiles,
        setProcessing,
        updateProgress,
        updateFileStatus,
        resetProgress,
        isProcessing,
    } = useAppStore();

    // 使用 Ref 追踪最新的设置和输出路径，供事件监听器调用
    const settingsRef = useRef(settings);
    const outputFolderRef = useRef(outputFolder);

    useEffect(() => {
        settingsRef.current = settings;
        outputFolderRef.current = outputFolder;
    }, [settings, outputFolder]);

    /**
     * 扫描文件
     */
    const scanFiles = useCallback(async () => {
        if (!inputFolder) return;
        try {
            const results = await API.scanPdfFiles(inputFolder, settings.includeSubfolders);
            setFiles(results);
        } catch (error) {
            console.error("扫描失败:", error);
        }
    }, [inputFolder, settings.includeSubfolders, setFiles]);

    /**
     * 自动扫描
     */
    useEffect(() => {
        scanFiles();
    }, [scanFiles]);

    /**
     * 监听进度事件
     */
    useEffect(() => {
        let unlistenProgress: (() => void) | null = null;
        let unlistenError: (() => void) | null = null;
        let unlistenFinished: (() => void) | null = null;

        const setupListeners = async () => {
            // 进度更新
            unlistenProgress = await listen<string>("processing-progress", (event) => {
                try {
                    const data: ProcessingEvent = JSON.parse(event.payload);
                    updateProgress(data.progress.percentage, data.file);

                    if (data.status === "success" || data.status === "error") {
                        updateFileStatus(data.file, data.status, data.message === "转换成功" ? undefined : data.message);
                    }
                } catch (e) {
                    console.error("解析进度数据失败:", e);
                }
            });

            // 错误通知
            unlistenError = await listen<string>("processing-error", (event) => {
                console.error("处理器错误:", event.payload);
            });

            // 任务完成
            unlistenFinished = await listen<string>("processing-finished", () => {
                setProcessing(false);

                // 自动打开输出目录
                if (settingsRef.current.autoOpenOutput && outputFolderRef.current) {
                    API.revealInExplorer(outputFolderRef.current);
                }
            });
        };

        setupListeners();

        return () => {
            if (unlistenProgress) unlistenProgress();
            if (unlistenError) unlistenError();
            if (unlistenFinished) unlistenFinished();
        };
    }, [updateProgress, updateFileStatus, setProcessing]);

    /**
     * 启动处理逻辑
     */
    const startProcessing = async () => {
        if (!inputFolder || !outputFolder || !password || isProcessing) return;

        resetProgress();
        setProcessing(true);

        try {
            await API.processPdfBatch(inputFolder, outputFolder, password);
        } catch (error) {
            setProcessing(false);
            console.error("任务启动失败:", error);
        }
    };

    return {
        startProcessing,
        scanFiles,
    };
};
