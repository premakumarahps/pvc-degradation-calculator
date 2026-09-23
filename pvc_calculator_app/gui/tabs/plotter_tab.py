"""
Interactive Kinetics Plotter Tab with light professional Matplotlib Canvas.
Simulates and visualizes all 8 chemical species over time.
"""

from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit,
    QPushButton, QGroupBox, QCheckBox, QFileDialog, QMessageBox, QScrollArea, QFrame
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
        main_layout = QHBoxLayout(self)
        main_layout.setSpacing(18)
        main_layout.setContentsMargins(20, 20, 20, 20)

        # Left Column: Controls (Width 340px)
        ctrl_panel = QWidget()
        ctrl_panel.setFixedWidth(340)
        ctrl_layout = QVBoxLayout(ctrl_panel)
        ctrl_layout.setContentsMargins(0, 0, 0, 0)
        ctrl_layout.setSpacing(16)

        # Simulation Parameters Box
        param_group = QGroupBox("Simulation Parameters")
        p_layout = QVBoxLayout(param_group)
        p_layout.setSpacing(12)
        p_layout.setContentsMargins(16, 20, 16, 16)

        lbl_time = QLabel("Exposure Time (Outdoor Hours):")
        lbl_time.setStyleSheet("font-weight: 700; color: #0f172a; font-size: 13px;")
        self.input_plot_hours = QLineEdit("1500")
        self.input_plot_hours.setFixedHeight(42)
        self.input_plot_hours.setStyleSheet("font-size: 14px; font-weight: 600; padding: 6px 12px;")
        p_layout.addWidget(lbl_time)
        p_layout.addWidget(self.input_plot_hours)

        lbl_stab = QLabel("Stabilizer Dosage (wt.%):")
        lbl_stab.setStyleSheet("font-weight: 700; color: #0f172a; font-size: 13px;")
        self.input_plot_stab = QLineEdit("0.11")
        self.input_plot_stab.setFixedHeight(42)
        self.input_plot_stab.setStyleSheet("font-size: 14px; font-weight: 600; padding: 6px 12px;")
        p_layout.addWidget(lbl_stab)
        p_layout.addWidget(self.input_plot_stab)

        self.btn_run_plot = QPushButton("📈  Simulate & Plot Kinetics")
        self.btn_run_plot.setFixedHeight(44)
        self.btn_run_plot.setStyleSheet("font-size: 14px; font-weight: 700;")
        self.btn_run_plot.clicked.connect(self.run_simulation_and_plot)
        p_layout.addWidget(self.btn_run_plot)

        ctrl_layout.addWidget(param_group)

        # Species Selector Box
        species_group = QGroupBox("Chemical Species to Display")
        sp_layout = QVBoxLayout(species_group)
        sp_layout.setSpacing(10)
        sp_layout.setContentsMargins(16, 20, 16, 16)

        # Quick preset buttons
        sel_btn_layout = QHBoxLayout()
        btn_all = QPushButton("Select All")
        btn_all.setObjectName("secondaryButton")
        btn_all.setFixedHeight(32)
        btn_all.clicked.connect(self.select_all_species)
        btn_main = QPushButton("Key Species")
        btn_main.setObjectName("secondaryButton")
        btn_main.setFixedHeight(32)
        btn_main.clicked.connect(self.select_key_species)
        sel_btn_layout.addWidget(btn_all)
        sel_btn_layout.addWidget(btn_main)
        sp_layout.addLayout(sel_btn_layout)

        # Checkboxes for 8 species
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("background-color: transparent; border: none;")
        scroll_content = QWidget()
        scroll_layout = QVBoxLayout(scroll_content)
        scroll_layout.setSpacing(10)

        for key in SPECIES_KEYS:
            meta = SPECIES_METADATA[key]
            cb = QCheckBox(f"{meta['label']}")
            cb.setStyleSheet(f"color: {meta['color']}; font-weight: 700; font-size: 13px;")
            if key in ["PVC", "R_N_H", "R_OO_rad"]:
                cb.setChecked(True)
            self.checkboxes[key] = cb
            scroll_layout.addWidget(cb)

        scroll.setWidget(scroll_content)
        sp_layout.addWidget(scroll)
        ctrl_layout.addWidget(species_group)

        # Export Plot Button
        self.btn_export_plot = QPushButton("💾  Export Plot Image (.PNG)")
        self.btn_export_plot.setObjectName("secondaryButton")
        self.btn_export_plot.setFixedHeight(40)
        self.btn_export_plot.clicked.connect(self.export_plot_image)
        ctrl_layout.addWidget(self.btn_export_plot)
        ctrl_layout.addStretch()

        main_layout.addWidget(ctrl_panel)

        # Right Column: Matplotlib Embedded Canvas in Light Mode
        plot_panel = QFrame()
        plot_panel.setStyleSheet("""
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 8px;
        """)
        plot_layout = QVBoxLayout(plot_panel)
        plot_layout.setContentsMargins(8, 8, 8, 8)
        plot_layout.setSpacing(8)

        # Setup Matplotlib Figure with Light Theme
        self.figure = Figure(figsize=(8, 6), facecolor="#ffffff")
        self.canvas = FigureCanvasQTAgg(self.figure)
        self.ax = self.figure.add_subplot(111)
        self.setup_light_axes()

        # Matplotlib toolbar
        self.toolbar = NavigationToolbar2QT(self.canvas, self)
        self.toolbar.setStyleSheet("""
            QToolBar { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px; }
            QToolButton { background-color: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 6px; margin: 2px; padding: 4px; }
            QToolButton:hover { background-color: #e2e8f0; border-color: #0284c7; }
        """)

        plot_layout.addWidget(self.toolbar)
        plot_layout.addWidget(self.canvas)

        main_layout.addWidget(plot_panel, stretch=1)

        # Initial plot
        self.run_simulation_and_plot()

    def setup_light_axes(self):
        self.ax.set_facecolor("#f8fafc")
        self.ax.tick_params(colors="#475569", which="both", labelsize=10)
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
                f"PVC Photodegradation Kinetics (Dosage: {stab_wt:.3f} wt.% Tinuvin 770)",
                color="#0f172a",
                fontsize=13,
                fontweight=700,
                pad=12
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
                leg.get_frame().set_boxstyle("round,pad=0.5")

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
