"""
Main Application Window.
Light modern professional interface combining Calculator, Plotter, Batch Analysis, and Theory tabs.
"""

import os
from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLabel, QTabWidget, QFrame, QStatusBar
)
from PyQt6.QtGui import QIcon, QPixmap
from PyQt6.QtCore import Qt

from gui.tabs import CalculatorTab, PlotterTab, AnalysisTab, TheoryTab


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("PVC Degradation Kinetics & HALS Formulation Optimizer")
        self.resize(1140, 800)
        self.setMinimumSize(960, 650)

        # Set Window Icon
        icon_path = os.path.join(os.path.dirname(__file__), "assets", "calculator_icon.png")
        if os.path.exists(icon_path):
            self.setWindowIcon(QIcon(icon_path))

        self.init_ui(icon_path)

    def init_ui(self, icon_path: str):
        # Central widget
        central_widget = QWidget()
        central_widget.setObjectName("centralWidget")
        self.setCentralWidget(central_widget)

        root_layout = QVBoxLayout(central_widget)
        root_layout.setContentsMargins(0, 0, 0, 0)
        root_layout.setSpacing(0)

        # Top Header Bar (Clean Light Modern)
        header = QFrame()
        header.setObjectName("headerFrame")
        h_layout = QHBoxLayout(header)
        h_layout.setContentsMargins(24, 16, 24, 16)

        # Icon and Titles
        if os.path.exists(icon_path):
            lbl_icon = QLabel()
            pixmap = QPixmap(icon_path).scaled(46, 46, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation)
            lbl_icon.setPixmap(pixmap)
            h_layout.addWidget(lbl_icon)

        title_box = QVBoxLayout()
        title_box.setSpacing(3)
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
            background-color: #f0f9ff;
            color: #0369a1;
            border: 1.5px solid #bae6fd;
            padding: 8px 18px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
        """)
        h_layout.addWidget(lbl_badge)

        root_layout.addWidget(header)

        # Tab Widget Container
        content_container = QWidget()
        content_container.setObjectName("contentContainer")
        content_layout = QVBoxLayout(content_container)
        content_layout.setContentsMargins(20, 16, 20, 14)

        self.tabs = QTabWidget()
        self.tab_calculator = CalculatorTab(self)
        self.tab_plotter = PlotterTab(self)
        self.tab_analysis = AnalysisTab(self)
        self.tab_theory = TheoryTab(self)

        self.tabs.addTab(self.tab_calculator, "⚡  Formulation Optimizer")
        self.tabs.addTab(self.tab_plotter, "📈  Kinetics Plotter")
        self.tabs.addTab(self.tab_analysis, "📊  Batch Sensitivity and Export")
        self.tabs.addTab(self.tab_theory, "📖  Theory and Reaction Models")

        content_layout.addWidget(self.tabs)
        root_layout.addWidget(content_container)

        # Status Bar
        status = QStatusBar()
        status.setStyleSheet("""
            background-color: #ffffff;
            color: #64748b;
            font-size: 12px;
            padding: 6px 16px;
            border-top: 1px solid #e2e8f0;
        """)
        status.showMessage("Ready · SciPy BDF Stiff ODE Solver (8 Coupled Species) · Active")
        self.setStatusBar(status)
