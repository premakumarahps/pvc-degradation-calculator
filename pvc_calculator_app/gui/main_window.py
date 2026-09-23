"""
Main Application Window.
Combines Calculator, Plotter, Batch Analysis, and Theory tabs into a modern interface.
"""

import os
from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLabel, QTabWidget, QFrame, QStatusBar
)
from PyQt6.QtGui import QIcon, QPixmap
from PyQt6.QtCore import Qt

from gui.tabs import CalculatorTab, PlotterTab, AnalysisTab, TheoryTab
from gui.theme import MODERN_DARK_STYLESHEET


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("PVC Degradation Kinetics & HALS Formulation Optimizer")
        self.resize(1120, 780)
        self.setMinimumSize(940, 620)

        # Set Window Icon
        icon_path = os.path.join(os.path.dirname(__file__), "assets", "calculator_icon.png")
        if os.path.exists(icon_path):
            self.setWindowIcon(QIcon(icon_path))

        self.init_ui(icon_path)

    def init_ui(self, icon_path: str):
        # Central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        root_layout = QVBoxLayout(central_widget)
        root_layout.setContentsMargins(0, 0, 0, 0)
        root_layout.setSpacing(0)

        # Top Header Bar
        header = QFrame()
        header.setObjectName("headerFrame")
        h_layout = QHBoxLayout(header)
        h_layout.setContentsMargins(18, 12, 18, 12)

        # Icon and Titles
        if os.path.exists(icon_path):
            lbl_icon = QLabel()
            pixmap = QPixmap(icon_path).scaled(42, 42, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation)
            lbl_icon.setPixmap(pixmap)
            h_layout.addWidget(lbl_icon)

        title_box = QVBoxLayout()
        title_box.setSpacing(2)
        lbl_title = QLabel("PVC Photodegradation Kinetics & HALS Formulation Optimizer")
        lbl_title.setObjectName("appTitle")
        lbl_sub = QLabel("Kinetic auto-oxidation modeling & optimal Tinuvin 770 HALS stabilizer prediction")
        lbl_sub.setObjectName("appSubtitle")
        title_box.addWidget(lbl_title)
        title_box.addWidget(lbl_sub)
        h_layout.addLayout(title_box)

        h_layout.addStretch()

        # University badge
        lbl_badge = QLabel("Academic Research Project · Group 1")
        lbl_badge.setStyleSheet("""
            background-color: #1e293b;
            color: #38bdf8;
            border: 1px solid #334155;
            padding: 6px 14px;
            border-radius: 14px;
            font-size: 11px;
            font-weight: 600;
        """)
        h_layout.addWidget(lbl_badge)

        root_layout.addWidget(header)

        # Tab Widget Container
        content_container = QWidget()
        content_layout = QVBoxLayout(content_container)
        content_layout.setContentsMargins(16, 14, 16, 10)

        self.tabs = QTabWidget()
        self.tab_calculator = CalculatorTab(self)
        self.tab_plotter = PlotterTab(self)
        self.tab_analysis = AnalysisTab(self)
        self.tab_theory = TheoryTab(self)

        self.tabs.addTab(self.tab_calculator, "⚡  Formulation Optimizer")
        self.tabs.addTab(self.tab_plotter, "📈  Kinetics Plotter")
        self.tabs.addTab(self.tab_analysis, "📊  Batch Sensitivity & Export")
        self.tabs.addTab(self.tab_theory, "📖  Theory & Reaction Models")

        content_layout.addWidget(self.tabs)
        root_layout.addWidget(content_container)

        # Status Bar
        status = QStatusBar()
        status.setStyleSheet("background-color: #090d16; color: #64748b; font-size: 11px; padding: 4px;")
        status.showMessage("Ready · SciPy BDF Stiff ODE Solver (8 Species) · Active")
        self.setStatusBar(status)
