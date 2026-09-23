to pack one file try this code
pip install pyinstaller

navigate froject directory
pyinstaller --onefile --windowed main.py


pyinstaller --onefile --windowed --add-data "calculator_icon.png;." main.py

pyinstaller --onefile --windowed --add-data "calculator_icon.png;." --icon="icon_file.ico" main.py
