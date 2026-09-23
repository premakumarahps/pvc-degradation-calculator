@echo off
title PVC Photodegradation Kinetics & HALS Formulation Optimizer
cd /d "%~dp0\pvc_calculator_app"

echo Starting PVC Degradation & HALS Formulation Optimizer...
python main.py
if errorlevel 1 (
    echo.
    echo If Python packages are missing, please install them:
    echo pip install -r requirements.txt
    pause
)
