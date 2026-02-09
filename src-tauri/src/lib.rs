mod commands;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())  // 启用 Sidecar 必需的 Shell 插件
    .plugin(tauri_plugin_dialog::init()) // 启用文件选择对话框插件
    .plugin(tauri_plugin_log::Builder::default()
      .level(log::LevelFilter::Info)
      .build())
    .invoke_handler(tauri::generate_handler![
      scan_pdf_files,
      process_pdf_batch,
      reveal_in_explorer
    ])
    .run(tauri::generate_context!())
    .expect("运行 Justeam PDF 工具箱时发生错误");
}
