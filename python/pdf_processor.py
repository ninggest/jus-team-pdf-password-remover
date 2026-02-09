import pikepdf
import json
import argparse
import sys
import traceback
from pathlib import Path
from datetime import datetime

"""
Justeam PDF 工具箱 - PDF 密码移除端 (Python Sidecar)
版本: v1.1
优化: 增强路径处理与异常捕获，支持大小写不敏感
"""

def report_progress(file_path, status, message, current=0, total=0):
    """
    向 stdout 输出 JSON 格式的进度信息，供 Rust 端解析
    """
    data = {
        "timestamp": datetime.now().isoformat(),
        "file": file_path,
        "status": status,  # "success", "error", "processing", "finished"
        "message": message,
        "progress": {
            "current": current,
            "total": total,
            "percentage": round((current / total) * 100, 2) if total > 0 else 0
        }
    }
    print(json.dumps(data, ensure_ascii=False), flush=True)

def remove_password(input_path, output_path, password):
    """
    移除单个 PDF 文件的密码
    """
    try:
        # 确保输出目录存在
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # 尝试使用密码打开 PDF
        with pikepdf.open(input_path, password=password) as pdf:
            # 即使文件没有加密，save 也会生成一个新的 PDF
            pdf.save(output_path)
        return True, None
    except pikepdf.PasswordError:
        return False, "密码错误"
    except Exception as e:
        return False, str(e)

def main():
    try:
        parser = argparse.ArgumentParser(description="Justeam PDF 处理器")
        parser.add_argument("--input", required=True, help="输入文件夹路径")
        parser.add_argument("--output", required=True, help="输出文件夹路径")
        parser.add_argument("--password", required=True, help="PDF 密码")
        
        args = parser.parse_args()
        
        input_root = Path(args.input).absolute()
        output_root = Path(args.output).absolute()
        
        if not input_root.exists():
            report_progress("", "error", f"输入文件夹路径不存在: {input_root}", 0, 0)
            sys.exit(1)

        # 发现所有 PDF 文件 (忽略大小写)
        pdf_files = [f for f in input_root.rglob("*") if f.suffix.lower() == ".pdf"]
        total_files = len(pdf_files)
        
        if total_files == 0:
            report_progress("", "error", "在指定目录下未发现任何 PDF 文件 (检查扩展名是否为 .pdf 或 .PDF)", 0, 0)
            report_progress("", "finished", "未执行任何操作", 0, 0)
            sys.exit(0)

        # 开始批量处理
        for i, pdf_path in enumerate(pdf_files, 1):
            # 计算相对于输入根目录的路径，以便在输出文件夹中还原结构
            try:
                relative_path = pdf_path.relative_to(input_root)
            except ValueError:
                # 如果 pdf_path 不在 input_root 下（通常不应该发生），直接取文件名
                relative_path = Path(pdf_path.name)
                
            target_path = output_root / relative_path
            
            # 如果输入和输出是同一个目录，添加后缀以避免覆盖原始文件
            if input_root == output_root:
                target_path = target_path.with_name(f"{target_path.stem}_已解密{target_path.suffix}")
            
            report_progress(str(relative_path), "processing", "正在处理...", i, total_files)
            
            success, error = remove_password(pdf_path, target_path, args.password)
            
            if success:
                report_progress(str(relative_path), "success", f"已输出至: {target_path}", i, total_files)
            else:
                report_progress(str(relative_path), "error", f"处理失败: {error}", i, total_files)

        report_progress("", "finished", f"所有文件处理完成，成功处理 {total_files} 个文件", total_files, total_files)

    except Exception as global_e:
        report_progress("", "error", f"运行时致命错误: {str(global_e)}", 0, 0)
        report_progress("", "finished", "异常终止", 0, 0)
        sys.exit(1)

if __name__ == "__main__":
    main()
