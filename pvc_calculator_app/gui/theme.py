"""
Light Modern Professional Theme stylesheet for the PVC Degradation Calculator application.
Clean, high-contrast, modern typography and spacious input controls.
"""

LIGHT_MODERN_STYLESHEET = """
/* Base Window & Global Fonts */
QMainWindow {
    background-color: #f8fafc;
}

QWidget {
    background-color: #f8fafc;
    color: #0f172a;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    font-size: 13px;
}

/* Header & Banner */
QFrame#headerFrame {
    background-color: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    padding: 14px 20px;
}

QLabel#appTitle {
    font-size: 21px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.3px;
}

QLabel#appSubtitle {
    font-size: 13px;
    color: #64748b;
    margin-top: 2px;
}

/* Tabs */
QTabWidget::pane {
    border: 1px solid #e2e8f0;
    background-color: #ffffff;
    border-radius: 10px;
    margin-top: -1px;
}

QTabBar::tab {
    background-color: #f1f5f9;
    color: #64748b;
    padding: 11px 24px;
    margin-right: 6px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    font-weight: 600;
    font-size: 13px;
    border: 1px solid #e2e8f0;
    border-bottom: none;
}

QTabBar::tab:selected {
    background-color: #ffffff;
    color: #0284c7;
    border: 1px solid #e2e8f0;
    border-bottom: 2px solid #ffffff;
    font-weight: 700;
}

QTabBar::tab:hover:!selected {
    background-color: #e2e8f0;
    color: #0f172a;
}

/* Cards & GroupBoxes */
QGroupBox {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    margin-top: 20px;
    padding: 22px 20px 20px 20px;
    font-weight: 700;
    font-size: 14px;
    color: #0f172a;
}

QGroupBox::title {
    subcontrol-origin: margin;
    subcontrol-position: top left;
    padding: 4px 12px;
    background-color: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    color: #0284c7;
    font-weight: 700;
}

/* Input Fields - Spacious & High Contrast */
QLineEdit, QSpinBox, QDoubleSpinBox {
    background-color: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 8px;
    padding: 8px 14px;
    color: #0f172a;
    font-size: 14px;
    font-weight: 600;
    min-height: 24px;
    selection-background-color: #0284c7;
    selection-color: #ffffff;
}

QLineEdit:focus, QSpinBox:focus, QDoubleSpinBox:focus {
    border: 2px solid #0284c7;
    background-color: #ffffff;
}

QLineEdit::placeholder {
    color: #94a3b8;
    font-weight: 400;
}

/* Push Buttons */
QPushButton {
    background-color: #0284c7;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-weight: 600;
    font-size: 13px;
    min-height: 20px;
}

QPushButton:hover {
    background-color: #0369a1;
}

QPushButton:pressed {
    background-color: #075985;
}

QPushButton#secondaryButton {
    background-color: #f8fafc;
    color: #334155;
    border: 1.5px solid #cbd5e1;
}

QPushButton#secondaryButton:hover {
    background-color: #f1f5f9;
    border-color: #94a3b8;
    color: #0f172a;
}

QPushButton#secondaryButton:pressed {
    background-color: #e2e8f0;
}

QPushButton#successButton {
    background-color: #10b981;
    color: #ffffff;
}

QPushButton#successButton:hover {
    background-color: #059669;
}

/* Text Displays & Logs */
QTextEdit, QPlainTextEdit {
    background-color: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 12px;
    color: #0f172a;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 13px;
}

/* Tables */
QTableWidget {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    gridline-color: #f1f5f9;
    color: #0f172a;
    selection-background-color: #e0f2fe;
    selection-color: #0369a1;
}

QHeaderView::section {
    background-color: #f8fafc;
    color: #475569;
    padding: 10px;
    border: none;
    border-bottom: 2px solid #e2e8f0;
    font-weight: 700;
    font-size: 12px;
}

/* Checkboxes */
QCheckBox {
    spacing: 8px;
    color: #334155;
    font-size: 13px;
    font-weight: 600;
}

QCheckBox::indicator {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: 1.5px solid #cbd5e1;
    background-color: #ffffff;
}

QCheckBox::indicator:hover {
    border-color: #0284c7;
}

QCheckBox::indicator:checked {
    background-color: #0284c7;
    border: 1.5px solid #0284c7;
    image: none;
}

/* Progress Bar */
QProgressBar {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background-color: #f1f5f9;
    text-align: center;
    color: #0f172a;
    font-weight: 600;
    height: 18px;
}

QProgressBar::chunk {
    background-color: #0284c7;
    border-radius: 7px;
}

/* Scrollbars */
QScrollBar:vertical {
    border: none;
    background: #f8fafc;
    width: 10px;
    margin: 0px;
}

QScrollBar::handle:vertical {
    background: #cbd5e1;
    min-height: 25px;
    border-radius: 5px;
}

QScrollBar::handle:vertical:hover {
    background: #94a3b8;
}
"""
