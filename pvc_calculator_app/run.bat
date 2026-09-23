@echo off
title PVC Photodegradation Kinetics & HALS Formulation Optimizer
echo =========================================================================
echo  PVC Photodegradation Kinetics & HALS Formulation Optimizer
echo  Academic Research Project - Group 1
echo =========================================================================
echo.
echo Checking Python environment...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in your system PATH.
    echo Please install Python 3.9+ from https://www.python.org/
    pause
    exit /b 1
)

echo Starting application...
python main.py
if errorlevel 1 (
    echo.
    echo [NOTE] If missing packages, install them with:
    echo        pip install -r requirements.txt
    pause
)
