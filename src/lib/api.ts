import { invoke } from "@tauri-apps/api/core";
import { PDFFile } from "../types";

/**
 * 包装 Tauri 命令调用
 */
export const API = {
    /**
     * 扫描目录下的 PDF 文件
     * @param folderPath 文件夹路径
     * @param includeSubfolders 是否包含子文件夹
     */
    scanPdfFiles: async (
        folderPath: string,
        includeSubfolders: boolean
    ): Promise<PDFFile[]> => {
        try {
            const results: any[] = await invoke("scan_pdf_files", {
                folderPath,
                includeSubfolders,
            });
            return results.map((f) => ({
                ...f,
                status: "pending",
            }));
        } catch (error) {
            console.error("扫描文件失败:", error);
            throw error;
        }
    },

    /**
     * 开始批量处理任务
     * @param inputFolder 输入路径
     * @param outputFolder 输出路径
     * @param password 统一使用的密码
     */
    processPdfBatch: async (
        inputFolder: string,
        outputFolder: string,
        password: string
    ): Promise<string> => {
        try {
            return await invoke("process_pdf_batch", {
                inputFolder,
                outputFolder,
                password,
            });
        } catch (error) {
            console.error("启动处理任务失败:", error);
            throw error;
        }
    },
    /**
     * 在操作系统的管理器中显示文件
     */
    revealInExplorer: async (path: string): Promise<void> => {
        try {
            await invoke("reveal_in_explorer", { path });
        } catch (error) {
            console.error("打开文件夹失败:", error);
        }
    },
};
