"""
Clean Light Modern Professional Theme for PVC Calculator.
Engineered for reliable Qt layout rendering without styling leaks or cascading background bugs.
"""

LIGHT_MODERN_STYLESHEET = """
/* Base Window & Global Fonts */
QMainWindow, QDialog {
    background-color: #f8fafc;
}

QWidget {
    color: #0f172a;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    font-size: 13px;
}

/* Enforce pure light background on all containers & scroll viewports */
QWidget#centralWidget, QWidget#contentContainer {
    background-color: #f8fafc;
}

QScrollArea, QScrollArea > QWidget, QScrollArea > QWidget > QWidget, QAbstractScrollArea {
    background-color: #f8fafc;
    border: none;
}

/* Header & Banner */
QFrame#headerFrame {
    background-color: #ffffff;
    border-bottom: 1.5px solid #e2e8f0;
    padding: 12px 20px;
}

QLabel#appTitle {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
}

QLabel#appSubtitle {
    font-size: 12.5px;
    color: #64748b;
}

/* Tab Widget */
QTabWidget::pane {
    border: 1.5px solid #e2e8f0;
    background-color: #f8fafc;
    border-radius: 8px;
    margin-top: -1px;
}

QTabBar::tab {
    background-color: #f1f5f9;
    color: #64748b;
    padding: 10px 22px;
    margin-right: 4px;
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

/* GroupBox Cards */
QGroupBox {
    background-color: #ffffff;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    margin-top: 14px;
    font-weight: 700;
    font-size: 13px;
    color: #0f172a;
}

QGroupBox::title {
    subcontrol-origin: margin;
    subcontrol-position: top left;
    padding: 0 8px;
    background-color: #ffffff;
    color: #0284c7;
    font-weight: 700;
}

/* Input Fields - Spacious & High Contrast */
QLineEdit {
    background-color: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 6px;
    padding: 5px 10px;
    color: #0f172a;
    font-size: 13.5px;
    font-weight: 600;
    selection-background-color: #0284c7;
    selection-color: #ffffff;
}

QLineEdit:focus {
    border: 2px solid #0284c7;
    background-color: #ffffff;
}

QLineEdit::placeholder {
    color: #94a3b8;
    font-weight: 400;
}

QWidget#centralWidget, QWidget#contentContainer {
    background-color: #f8fafc;
}

/* Push Buttons */
QPushButton {
    background-color: #0284c7;
    color: #ffffff;
    border: 1px solid #0284c7;
    border-radius: 6px;
    padding: 6px 14px;
    font-weight: 700;
    font-size: 13px;
}

QPushButton:hover {
    background-color: #0369a1;
    border-color: #0369a1;
}

QPushButton:pressed {
    background-color: #075985;
}

QPushButton:disabled {
    background-color: #e2e8f0;
    color: #94a3b8;
    border: 1px solid #cbd5e1;
}

QPushButton#secondaryButton {
    background-color: #ffffff;
    color: #334155;
    border: 1.5px solid #cbd5e1;
    font-weight: 600;
}

QPushButton#secondaryButton:hover {
    background-color: #f1f5f9;
    border-color: #94a3b8;
    color: #0f172a;
}

QPushButton#secondaryButton:pressed {
    background-color: #e2e8f0;
}

QPushButton#secondaryButton:disabled {
    background-color: #f1f5f9;
    color: #94a3b8;
    border-color: #e2e8f0;
}

QPushButton#primaryButton {
    background-color: #0284c7;
    color: #ffffff;
    border: 1px solid #0284c7;
    font-weight: 700;
    font-size: 14px;
}

QPushButton#primaryButton:hover {
    background-color: #0369a1;
}

QPushButton#primaryButton:disabled {
    background-color: #e2e8f0;
    color: #94a3b8;
    border: 1px solid #cbd5e1;
}

QPushButton#successButton {
    background-color: #10b981;
    border: 1px solid #10b981;
    color: #ffffff;
    font-weight: 700;
}

QPushButton#successButton:hover {
    background-color: #059669;
    border-color: #059669;
}

QPushButton#successButton:disabled {
    background-color: #e2e8f0;
    color: #94a3b8;
    border: 1px solid #cbd5e1;
}

/* Tables */
QTableWidget {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    gridline-color: #f1f5f9;
    color: #0f172a;
    selection-background-color: #e0f2fe;
    selection-color: #0369a1;
}

QHeaderView::section {
    background-color: #f8fafc;
    color: #475569;
    padding: 8px;
    border: none;
    border-bottom: 2px solid #e2e8f0;
    font-weight: 700;
    font-size: 12px;
}

/* Checkboxes */
QCheckBox {
    spacing: 8px;
    color: #1e293b;
    font-size: 13px;
    font-weight: 600;
}

QCheckBox::indicator {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1.5px solid #cbd5e1;
    background-color: #ffffff;
}

QCheckBox::indicator:hover {
    border-color: #0284c7;
}

QCheckBox::indicator:checked {
    background-color: #0284c7;
    border: 1.5px solid #0284c7;
}

/* Scroll Area & Bars */
QScrollArea {
    background: transparent;
    border: none;
}

QScrollBar:vertical {
    border: none;
    background: #f1f5f9;
    width: 8px;
    margin: 0;
    border-radius: 4px;
}

QScrollBar::handle:vertical {
    background: #cbd5e1;
    min-height: 30px;
    border-radius: 4px;
}

QScrollBar::handle:vertical:hover {
    background: #94a3b8;
}

QProgressBar {
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background-color: #f1f5f9;
    text-align: center;
    color: #0f172a;
    font-weight: 700;
    height: 16px;
}

QProgressBar::chunk {
    background-color: #0284c7;
    border-radius: 5px;
}
"""
