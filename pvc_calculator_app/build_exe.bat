@echo off
title Build Standalone Executable (.exe)
echo =========================================================================
echo  Packaging PVC Optimizer into Single Windows Executable (.exe)
echo =========================================================================
echo.
echo Installing/Verifying PyInstaller...
pip install pyinstaller

echo.
echo Building single-file executable with PyInstaller...
pyinstaller --noconfirm --onedir --windowed ^
    --name "PVC_Degradation_Optimizer" ^
    --icon "gui/assets/calculator_icon.png" ^
    --add-data "gui/assets;gui/assets" ^
    --hidden-import "scipy.special.cython_special" ^
    --hidden-import "scipy.integrate" ^
    --hidden-import "matplotlib.backends.backend_qtagg" ^
    --hidden-import "openpyxl" ^
    main.py

echo.
if exist "dist\PVC_Degradation_Optimizer\PVC_Degradation_Optimizer.exe" (
    echo =========================================================================
    echo  BUILD SUCCESSFUL!
    echo  Executable is ready at:
    echo  dist\PVC_Degradation_Optimizer\PVC_Degradation_Optimizer.exe
    echo =========================================================================
) else (
    echo [ERROR] Build may have encountered an issue. Check the logs above.
)
pause
