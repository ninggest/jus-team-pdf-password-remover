use std::path::PathBuf;
use walkdir::WalkDir;
use serde::Serialize;
use tauri::{AppHandle, Emitter, Runtime, Window};
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;
use std::sync::Arc;

/// PDF 文件信息
#[derive(Debug, Serialize, Clone)]
pub struct PdfFile {
    pub name: String,
    pub path: String,
}

/// 扫描指定目录下的 PDF 文件
/// 代码注释使用中文
#[tauri::command]
pub async fn scan_pdf_files(
    folder_path: String,
    include_subfolders: bool,
) -> Result<Vec<PdfFile>, String> {
    let mut pdf_files = Vec::new();
    let root = PathBuf::from(&folder_path);

    if !root.exists() || !root.is_dir() {
        return Err("所选路径不是有效的目录".to_string());
    }

    let max_depth = if include_subfolders { usize::MAX } else { 1 };

    for entry in WalkDir::new(&root)
        .max_depth(max_depth)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        if entry.file_type().is_file() {
            if let Some(ext) = entry.path().extension() {
                if ext.to_string_lossy().to_lowercase() == "pdf" {
                    pdf_files.push(PdfFile {
                        name: entry.file_name().to_string_lossy().into_owned(),
                        path: entry.path().to_string_lossy().into_owned(),
                    });
                }
            }
        }
    }

    Ok(pdf_files)
}

/// 批量处理 PDF 文件（通过 Python Sidecar）
/// 监听侧载进程的输出并发送事件到前端
#[tauri::command]
pub async fn process_pdf_batch<R: Runtime>(
    app: AppHandle<R>,
    window: Window<R>,
    input_folder: String,
    output_folder: String,
    password: String,
) -> Result<String, String> {
    // 启动 Python sidecar 进程
    // 注意：在 Tauri 2.0 中使用 shell 插件
    let sidecar_command = app.shell()
        .sidecar("pdf-processor")
        .map_err(|e| format!("无法找到 Python 处理器: {}", e))?
        .args(&[
            "--input", &input_folder,
            "--output", &output_folder,
            "--password", &password,
        ]);

    let (mut rx, _child) = sidecar_command.spawn()
        .map_err(|e| format!("启动处理器失败: {}", e))?;

    // 监听进程输出并透传给前端
    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line) => {
                    // 假设 Python 脚本输出 JSON 格式的进度
                    let output = String::from_utf8_lossy(&line).into_owned();
                    window.emit("processing-progress", output).ok();
                }
                CommandEvent::Stderr(line) => {
                    let error = String::from_utf8_lossy(&line).into_owned();
                    window.emit("processing-error", error).ok();
                }
                CommandEvent::Terminated(payload) => {
                    window.emit("processing-finished", format!("{:?}", payload.code)).ok();
                }
                _ => {}
            }
        }
    });

    Ok("处理任务已启动".to_string())
}
/// 在文件管理器中打开指定路径
#[tauri::command]
pub async fn reveal_in_explorer(path: String) -> Result<(), String> {
    let path_buf = PathBuf::from(path);
    if !path_buf.exists() {
        return Err("路径不存在".to_string());
    }

    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg("-R")
            .arg(path_buf)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg("/select,")
            .arg(path_buf)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "linux")]
    {
        // Linux 下通常只能打开文件夹
        let folder = if path_buf.is_dir() {
            path_buf
        } else {
            path_buf.parent().unwrap_or(&PathBuf::from("/")).to_path_buf()
        };
        std::process::Command::new("xdg-open")
            .arg(folder)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}
