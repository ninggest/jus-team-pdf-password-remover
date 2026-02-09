import sys
import subprocess
import os

def check_python():
    try:
        subprocess.check_call([sys.executable, '--version'])
        print("Python is installed.")
        return True
    except:
        print("Python is not installed. Please install Python 3.9+.")
        return False

def check_node():
    try:
        subprocess.check_call(['node', '--version'])
        print("Node.js is installed.")
        return True
    except:
        print("Node.js is not installed. Please install Node.js LTS.")
        return False

def check_rust():
    try:
        subprocess.check_call(['cargo', '--version'])
        print("Rust is installed.")
        return True
    except:
        print("Rust is not installed. Please install Rust.")
        return False

if __name__ == "__main__":
    if check_python() and check_node() and check_rust():
        print("Environment check passed! Installing Python dependencies...")
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'pikepdf', 'pyinstaller'])
        print("\nReady to build! Run './BUILD.ps1' or 'powershell -ExecutionPolicy Bypass -File BUILD.ps1'")
    else:
        print("\nPlease install the missing dependencies and try again.")
