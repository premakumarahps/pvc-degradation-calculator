@echo off
title PVC Photodegradation Kinetics & HALS Formulation Optimizer
cd /d "%~dp0\pvc_calculator_app"

if exist "dist\PVC_Degradation_Optimizer\PVC_Degradation_Optimizer.exe" (
    echo Launching standalone executable...
    start "" "dist\PVC_Degradation_Optimizer\PVC_Degradation_Optimizer.exe"
    exit /b
)

echo Starting PVC Degradation & HALS Formulation Optimizer via Python...
python main.py
if errorlevel 1 (
    echo.
    echo If Python packages are missing, please install them:
    echo pip install -r requirements.txt
    pause
)
