"""
Modern dark styling and CSS stylesheet for the PVC Degradation Calculator application.
Crafted for high-DPI displays with a scientific, premium dark aesthetic.
"""

MODERN_DARK_STYLESHEET = """
QMainWindow {
    background-color: #0b0f19;
}

QWidget {
    background-color: #0b0f19;
    color: #e2e8f0;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    font-size: 13px;
}

/* Header & Banner */
QFrame#headerFrame {
    background-color: #0f172a;
    border-bottom: 1px solid #1e293b;
    padding: 12px;
}

QLabel#appTitle {
    font-size: 20px;
    font-weight: 700;
    color: #38bdf8;
}

QLabel#appSubtitle {
    font-size: 12px;
    color: #94a3b8;
}

/* Tabs */
QTabWidget::pane {
    border: 1px solid #1e293b;
    background-color: #0f172a;
    border-radius: 8px;
    margin-top: -1px;
}

QTabBar::tab {
    background-color: #1e293b;
    color: #94a3b8;
    padding: 10px 22px;
    margin-right: 4px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    font-weight: 600;
}

QTabBar::tab:selected {
    background-color: #0f172a;
    color: #38bdf8;
    border: 1px solid #1e293b;
    border-bottom: 1px solid #0f172a;
}

QTabBar::tab:hover:!selected {
    background-color: #26334d;
    color: #f1f5f9;
}

/* Cards & Panels */
QGroupBox {
    background-color: #131d33;
    border: 1px solid #233554;
    border-radius: 10px;
    margin-top: 18px;
    padding: 18px;
    font-weight: 600;
    color: #38bdf8;
}

QGroupBox::title {
    subcontrol-origin: margin;
    subcontrol-position: top left;
    padding: 2px 10px;
    background-color: #1e293b;
    border-radius: 4px;
    color: #38bdf8;
}

/* Inputs */
QLineEdit, QSpinBox, QDoubleSpinBox {
    background-color: #090d16;
    border: 1px solid #2d3e5e;
    border-radius: 6px;
    padding: 8px 12px;
    color: #f8fafc;
    font-size: 13px;
    selection-background-color: #0284c7;
}

QLineEdit:focus, QSpinBox:focus, QDoubleSpinBox:focus {
    border: 1px solid #38bdf8;
    background-color: #0b1120;
}

/* Push Buttons */
QPushButton {
    background-color: #0284c7;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    padding: 9px 18px;
    font-weight: 600;
    font-size: 13px;
}

QPushButton:hover {
    background-color: #0369a1;
}

QPushButton:pressed {
    background-color: #075985;
}

QPushButton#secondaryButton {
    background-color: #1e293b;
    color: #cbd5e1;
    border: 1px solid #334155;
}

QPushButton#secondaryButton:hover {
    background-color: #27374f;
    color: #ffffff;
}

QPushButton#successButton {
    background-color: #059669;
}

QPushButton#successButton:hover {
    background-color: #047857;
}

/* Text Displays & Logs */
QTextEdit, QPlainTextEdit {
    background-color: #090d16;
    border: 1px solid #233554;
    border-radius: 6px;
    padding: 10px;
    color: #e2e8f0;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 12px;
}

/* Tables */
QTableWidget {
    background-color: #090d16;
    border: 1px solid #233554;
    border-radius: 6px;
    gridline-color: #1e293b;
    color: #e2e8f0;
}

QHeaderView::section {
    background-color: #1e293b;
    color: #94a3b8;
    padding: 6px;
    border: 1px solid #0f172a;
    font-weight: 600;
}

/* Checkboxes */
QCheckBox {
    spacing: 8px;
    color: #cbd5e1;
}

QCheckBox::indicator {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid #334155;
    background-color: #090d16;
}

QCheckBox::indicator:checked {
    background-color: #0284c7;
    border: 1px solid #38bdf8;
}

/* Progress Bar */
QProgressBar {
    border: 1px solid #233554;
    border-radius: 6px;
    background-color: #090d16;
    text-align: center;
    color: #ffffff;
    font-weight: 600;
    height: 16px;
}

QProgressBar::chunk {
    background-color: #0284c7;
    border-radius: 5px;
}

/* Scrollbars */
QScrollBar:vertical {
    border: none;
    background: #090d16;
    width: 10px;
    margin: 0px;
}

QScrollBar::handle:vertical {
    background: #233554;
    min-height: 20px;
    border-radius: 5px;
}

QScrollBar::handle:vertical:hover {
    background: #38bdf8;
}
"""
