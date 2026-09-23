Convert .ui files to Python files
Use the pyuic6 tool to convert these .ui files to Python files:

open cmd in folder location
try below codes
pyuic6 -o main_window.py main_window.ui
pyuic6 -o calculator_mode.py calculator_mode.ui
pyuic6 -o analysis_mode.py analysis_mode.ui

if you want modify ui file open these ui file in Qt studio