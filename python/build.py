import os
import subprocess
import sys
import platform

"""
Justeam PDF 工具箱 - Python Sidecar 打包助手
作用: 将 pdf_processor.py 打包为 Tauri 要求的 externalBin 格式
"""

def get_target_triple():
    """获取 Rust 风格的目标三元组"""
    arch = platform.machine().lower()
    if arch == 'amd64' or arch == 'x86_64':
        arch = 'x86_64'
    elif 'arm' in arch or 'aarch64' in arch:
        arch = 'aarch64'
    
    system = platform.system().lower()
    if system == 'darwin':
        return f"{arch}-apple-darwin"
    elif system == 'windows':
        return f"{arch}-pc-windows-msvc"
    elif system == 'linux':
        return f"{arch}-unknown-linux-gnu"
    return "unknown"

def build():
    triple = get_target_triple()
    binary_name = f"pdf-processor-{triple}"
    
    print(f"正在为平台 {triple} 构建 Sidecar: {binary_name}...")
    
    cmd = [
        "pyinstaller",
        "--onefile",
        "--clean",
        "--name", binary_name,
        "pdf_processor.py"
    ]
    
    try:
        subprocess.check_call(cmd)
        print("\n构建成功！")
        print(f"打包后的二进制文件位于: python/dist/{binary_name}")
        print(f"\n请根据 tauri.conf.json 的配置，将该文件复制到相应的发布目录中。")
    except Exception as e:
        print(f"构建失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # 检查是否安装了 pyinstaller
    try:
        import PyInstaller
    except ImportError:
        print("未检测到 PyInstaller，请运行: pip install pyinstaller")
        sys.exit(1)
        
    build()
