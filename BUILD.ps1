# Windows 自动化构建脚本
# 此脚本将编译 Python Sidecar 并构建 Windows 版应用

Write-Host "Checking for Python installation..."
try {
    python --version
} catch {
    Write-Error "Python not found! Please install Python 3.9+ and add to PATH."
    exit 1
}

Write-Host "Installing Python dependencies..."
pip install pikepdf pyinstaller

Write-Host "Building Python Sidecar..."
cd python
pyinstaller --onefile --clean --name pdf-processor-x86_64-pc-windows-msvc pdf_processor.py
cd ..

Write-Host "Setting up binary..."
if (!(Test-Path src-tauri\binaries)) {
    New-Item -ItemType Directory -Force -Path src-tauri\binaries
}
Copy-Item python\dist\pdf-processor-x86_64-pc-windows-msvc.exe src-tauri\binaries\

Write-Host "Building Tauri Application..."
npm install
npm run tauri build

Write-Host "Build Complete!"
