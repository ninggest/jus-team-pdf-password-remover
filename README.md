# Jus Team PDF 密码移除器 (Jus Team PDF Password Remover)

一款专为法律专业人士设计的轻量级、安全且高效的批量 PDF 密码移除工具。

## 功能特点

- **批量处理**：一次性处理整个文件夹中的 PDF 文件。
- **本地执行**：所有处理均在本地完成，不会上传您的私密文档到任何云端，确保数据安全。
- **智能路径**：
  - 自动识别 `.pdf` 和 `.PDF` 扩展名。
  - 支持保留原始文件夹层级结构。
  - 输入/输出同目录时自动添加 `_已解密` 后缀，防止覆盖原件。
- **一键直达**：处理完成后一键打开输出文件夹。
- **精美 UI**：现代化的界面设计，实时进度反馈。

## 技术栈

- **Frontend**: React + TypeScript + Tailwind CSS + Lucide Icons
- **Backend**: Tauri 2.0 (Rust)
- **Engine**: Python Sidecar (Powered by `pikepdf`)
- **State Management**: Zustand

## 安装与运行 (macOS)

1. 下载并打开 `Jus Team PDF 密码移除器_1.0.0_aarch64.dmg`。
2. 将程序拖入“应用程序”文件夹。
3. 运行程序，选择包含加密 PDF 的文件夹，输入统一密码，点击“开始处理”。

## 开发与构建 (Windows)

由于 PDF 处理核心使用 Python 侧载，在 Windows 上构建需要以下步骤：

1. 确保安装了 Node.js, Rust 和 Python 3.9+。
2. 将项目源码拷贝至 Windows。
3. 右键点击项目根目录下的 `BUILD.ps1` 并选择“通过 PowerShell 运行”。
4. 构建生成的安装包将位于 `src-tauri/target/release/bundle/msi/`。

## 开源协议

MIT License
Copyright (c) 2026 **Zane**
基于 Justeam 技术框架构建。
