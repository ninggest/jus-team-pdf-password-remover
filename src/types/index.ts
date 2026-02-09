/**
 * PDF 文件状态接口
 */
export interface PDFFile {
    name: string;
    path: string;
    status: "pending" | "processing" | "success" | "error";
    error?: string;
}

/**
 * 应用设置接口 (已移除深色模式)
 */
export interface AppSettings {
    includeSubfolders: boolean;
    preserveStructure: boolean;
    autoOpenOutput: boolean;
}

/**
 * 处理进度事件接口
 */
export interface ProcessingEvent {
    timestamp: string;
    file: string;
    status: "processing" | "success" | "error" | "finished";
    message: string;
    progress: {
        current: number;
        total: number;
        percentage: number;
    };
}
