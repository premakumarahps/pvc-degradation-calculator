"""
Interactive Kinetics Plotter Tab with light professional Matplotlib Canvas.
Simulates and visualizes all 8 chemical species over time with zero layout clipping.
"""

from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QGridLayout, QLabel, QLineEdit,
    QPushButton, QGroupBox, QCheckBox, QFileDialog, QMessageBox, QScrollArea, QFrame, QSizePolicy
)
from PyQt6.QtCore import Qt
import matplotlib
matplotlib.use("QtAgg")
from matplotlib.backends.backend_qtagg import FigureCanvasQTAgg, NavigationToolbar2QT
from matplotlib.figure import Figure

from core.kinetics import PVCDegradationModel
from core.constants import (
    SPECIES_KEYS,
    SPECIES_METADATA,
    OUTDOOR_HOURS_SCALING_FACTOR,
    STABILIZER_WT_MULTIPLIER
)


class PlotterTab(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.checkboxes = {}
        self.init_ui()

    def init_ui(self):
        self.setStyleSheet("background-color: #f8fafc;")
        main_layout = QHBoxLayout(self)
        main_layout.setSpacing(16)
        main_layout.setContentsMargins(18, 16, 18, 16)

        # ---------------------------------------------------------
        # Left Column: Controls panel
        # ---------------------------------------------------------
        ctrl_panel = QFrame()
        ctrl_panel.setFixedWidth(360)
        ctrl_panel.setStyleSheet("background-color: #f8fafc; border: none;")
        ctrl_layout = QVBoxLayout(ctrl_panel)
        ctrl_layout.setContentsMargins(0, 0, 0, 0)
        ctrl_layout.setSpacing(10)

        # Simulation Parameters Card
        param_group = QGroupBox("Simulation Parameters")
        param_group.setSizePolicy(QSizePolicy.Policy.Preferred, QSizePolicy.Policy.Maximum)
        p_layout = QVBoxLayout(param_group)
        p_layout.setSpacing(8)
        p_layout.setContentsMargins(14, 18, 14, 14)

        lbl_time = QLabel("Exposure Time (Outdoor Hours):")
        lbl_time.setStyleSheet("font-weight: 700; color: #0f172a; font-size: 12.5px;")
        self.input_plot_hours = QLineEdit("1500")
        self.input_plot_hours.setFixedHeight(36)
        self.input_plot_hours.setStyleSheet("""
            QLineEdit {
                background-color: #ffffff;
                color: #0f172a;
                border: 1.5px solid #cbd5e1;
                border-radius: 6px;
                padding: 4px 10px;
                font-size: 13.5px;
                font-weight: 600;
            }
            QLineEdit:focus { border: 2px solid #0284c7; }
        """)
        p_layout.addWidget(lbl_time)
        p_layout.addWidget(self.input_plot_hours)

        lbl_stab = QLabel("Stabilizer Dosage (wt.%):")
        lbl_stab.setStyleSheet("font-weight: 700; color: #0f172a; font-size: 12.5px;")
        self.input_plot_stab = QLineEdit("0.11")
        self.input_plot_stab.setFixedHeight(36)
        self.input_plot_stab.setStyleSheet("""
            QLineEdit {
                background-color: #ffffff;
                color: #0f172a;
                border: 1.5px solid #cbd5e1;
                border-radius: 6px;
                padding: 4px 10px;
                font-size: 13.5px;
                font-weight: 600;
            }
            QLineEdit:focus { border: 2px solid #0284c7; }
        """)
        p_layout.addWidget(lbl_stab)
        p_layout.addWidget(self.input_plot_stab)

        self.btn_run_plot = QPushButton("📈  Simulate and Plot Kinetics")
        self.btn_run_plot.setFixedHeight(38)
        self.btn_run_plot.setStyleSheet("""
            QPushButton {
                background-color: #0284c7;
                color: #ffffff;
                border: 1px solid #0284c7;
                border-radius: 6px;
                font-weight: 700;
                font-size: 13px;
            }
            QPushButton:hover { background-color: #0369a1; }
            QPushButton:pressed { background-color: #075985; }
        """)
        self.btn_run_plot.clicked.connect(self.run_simulation_and_plot)
        p_layout.addWidget(self.btn_run_plot)

        ctrl_layout.addWidget(param_group)

        # Species Selector Card
        species_group = QGroupBox("Chemical Species to Display")
        sp_layout = QVBoxLayout(species_group)
        sp_layout.setSpacing(8)
        sp_layout.setContentsMargins(14, 18, 14, 14)

        # Quick preset buttons
        sel_btn_layout = QHBoxLayout()
        sel_btn_layout.setSpacing(8)
        btn_preset_qss = """
            QPushButton {
                background-color: #ffffff;
                color: #334155;
                border: 1.5px solid #cbd5e1;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                padding: 4px 8px;
            }
            QPushButton:hover {
                background-color: #f1f5f9;
                border-color: #0284c7;
                color: #0284c7;
            }
        """
        btn_all = QPushButton("Select All")
        btn_all.setFixedHeight(30)
        btn_all.setStyleSheet(btn_preset_qss)
        btn_all.clicked.connect(self.select_all_species)

        btn_main = QPushButton("Key Species")
        btn_main.setFixedHeight(30)
        btn_main.setStyleSheet(btn_preset_qss)
        btn_main.clicked.connect(self.select_key_species)

        sel_btn_layout.addWidget(btn_all)
        sel_btn_layout.addWidget(btn_main)
        sp_layout.addLayout(sel_btn_layout)

        # 8 Species Checkboxes in a neat 2-Column Grid
        grid_species = QGridLayout()
        grid_species.setHorizontalSpacing(10)
        grid_species.setVerticalSpacing(6)

        for idx, key in enumerate(SPECIES_KEYS):
            meta = SPECIES_METADATA[key]
            cb = QCheckBox(f"{meta['label']}")
            cb.setFixedHeight(22)
            cb.setStyleSheet(f"QCheckBox {{ color: {meta['color']}; font-weight: 700; font-size: 11.5px; }}")
            if key in ["PVC", "R_N_H", "R_OO_rad"]:
                cb.setChecked(True)
            self.checkboxes[key] = cb
            row = idx // 2
            col = idx % 2
            grid_species.addWidget(cb, row, col)

        sp_layout.addLayout(grid_species)
        ctrl_layout.addWidget(species_group)

        # Export Plot Button
        self.btn_export_plot = QPushButton("💾  Export Plot Image (.PNG)")
        self.btn_export_plot.setFixedHeight(38)
        self.btn_export_plot.setStyleSheet("""
            QPushButton {
                background-color: #ffffff;
                color: #334155;
                border: 1.5px solid #cbd5e1;
                border-radius: 6px;
                font-weight: 600;
                font-size: 12.5px;
            }
            QPushButton:hover {
                background-color: #f1f5f9;
                border-color: #0284c7;
                color: #0284c7;
            }
        """)
        self.btn_export_plot.clicked.connect(self.export_plot_image)
        ctrl_layout.addWidget(self.btn_export_plot)
        ctrl_layout.addStretch()

        main_layout.addWidget(ctrl_panel)

        # ---------------------------------------------------------
        # Right Column: Matplotlib Embedded Canvas in Light Mode
        # ---------------------------------------------------------
        plot_panel = QFrame()
        plot_panel.setStyleSheet("""
            QFrame {
                background-color: #ffffff;
                border: 1.5px solid #e2e8f0;
                border-radius: 8px;
            }
        """)
        plot_layout = QVBoxLayout(plot_panel)
        plot_layout.setContentsMargins(10, 10, 10, 10)
        plot_layout.setSpacing(6)

        # Setup Matplotlib Figure with Light Theme and ample margins for axis titles
        self.figure = Figure(figsize=(7.5, 5.5), facecolor="#ffffff")
        self.figure.subplots_adjust(bottom=0.15, left=0.10, right=0.96, top=0.91)
        self.canvas = FigureCanvasQTAgg(self.figure)
        self.canvas.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Expanding)
        self.ax = self.figure.add_subplot(111)
        self.setup_light_axes()

        # Matplotlib toolbar with light styling
        self.toolbar = NavigationToolbar2QT(self.canvas, self)
        self.toolbar.setStyleSheet("""
            QToolBar {
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                padding: 2px 4px;
            }
            QToolButton {
                background-color: transparent;
                border: 1px solid transparent;
                border-radius: 4px;
                margin: 1px;
                padding: 4px;
            }
            QToolButton:hover {
                background-color: #e2e8f0;
                border-color: #cbd5e1;
            }
        """)

        plot_layout.addWidget(self.toolbar)
        plot_layout.addWidget(self.canvas)

        main_layout.addWidget(plot_panel, stretch=1)

        # Initial plot
        self.run_simulation_and_plot()

    def setup_light_axes(self):
        self.ax.set_facecolor("#f8fafc")
        self.ax.tick_params(colors="#475569", which="both", labelsize=9.5)
        for spine in self.ax.spines.values():
            spine.set_color("#cbd5e1")
            spine.set_linewidth(1.2)
        self.ax.grid(True, color="#e2e8f0", linestyle="--", linewidth=0.8, alpha=0.9)

    def select_all_species(self):
        for cb in self.checkboxes.values():
            cb.setChecked(True)
        self.run_simulation_and_plot()

    def select_key_species(self):
        for key, cb in self.checkboxes.items():
            cb.setChecked(key in ["PVC", "R_N_H", "R_OO_rad"])
        self.run_simulation_and_plot()

    def run_simulation_and_plot(self):
        try:
            raw_hours = self.input_plot_hours.text().strip()
            outdoor_hours = float(raw_hours) if raw_hours else 1500.0

            raw_stab_wt = self.input_plot_stab.text().strip()
            stab_wt = float(raw_stab_wt) if raw_stab_wt else 0.11
            stab_conc = stab_wt / STABILIZER_WT_MULTIPLIER

            scaled_hours = outdoor_hours / OUTDOOR_HOURS_SCALING_FACTOR

            model = PVCDegradationModel(stab_conc, scaled_hours)
            t_hours, y = model.solve()

            # Convert simulated time to outdoor equivalent hours
            t_outdoor = t_hours * OUTDOOR_HOURS_SCALING_FACTOR

            self.ax.clear()
            self.setup_light_axes()

            plotted_any = False
            for idx, key in enumerate(SPECIES_KEYS):
                if self.checkboxes[key].isChecked():
                    meta = SPECIES_METADATA[key]
                    self.ax.plot(
                        t_outdoor,
                        y[idx],
                        label=meta["label"],
                        color=meta["color"],
                        linewidth=2.2
                    )
                    plotted_any = True

            self.ax.set_xlabel("Outdoor Weathering Equivalent Time (Hours)", color="#0f172a", fontsize=11, fontweight=700, labelpad=8)
            self.ax.set_ylabel("Normalized Concentration (Fraction)", color="#0f172a", fontsize=11, fontweight=700, labelpad=8)
            self.ax.set_title(
                f"PVC Photodegradation Kinetics ({stab_wt:.3f} wt.% Tinuvin 770)",
                color="#0f172a",
                fontsize=11.5,
                fontweight=700,
                pad=10
            )

            # Threshold line at 80%
            self.ax.axhline(0.8, color="#dc2626", linestyle="--", linewidth=1.5, alpha=0.8, label="Critical Threshold (80% PVC)")

            if plotted_any:
                leg = self.ax.legend(
                    loc="best",
                    facecolor="#ffffff",
                    edgecolor="#cbd5e1",
                    labelcolor="#0f172a",
                    fontsize=9.5,
                    framealpha=0.95
                )
                leg.get_frame().set_boxstyle("round,pad=0.4")

            self.figure.subplots_adjust(bottom=0.15, left=0.10, right=0.96, top=0.91)
            self.canvas.draw()

        except Exception as e:
            QMessageBox.critical(self, "Plotting Error", f"Failed to simulate kinetics: {str(e)}")

    def export_plot_image(self):
        file_path, _ = QFileDialog.getSaveFileName(
            self,
            "Save Kinetics Plot",
            "pvc_degradation_kinetics.png",
            "PNG Image (*.png);;PDF Document (*.pdf);;SVG Vector (*.svg)"
        )
        if file_path:
            try:
                self.figure.savefig(file_path, dpi=300, facecolor=self.figure.get_facecolor(), bbox_inches="tight")
                QMessageBox.information(self, "Export Success", f"Plot successfully saved to:\n{file_path}")
            except Exception as e:
                QMessageBox.critical(self, "Export Failed", str(e))
