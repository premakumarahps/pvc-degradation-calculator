"""
Batch Sensitivity Analysis Tab.
Light modern styling with spacious inputs and Excel export.
"""

from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit,
    QPushButton, QGroupBox, QTableWidget, QTableWidgetItem,
    QProgressBar, QFileDialog, QMessageBox, QHeaderView
)
from PyQt6.QtCore import QThread, pyqtSignal, Qt
import pandas as pd

from core.analyzer import run_batch_analysis, export_analysis_to_excel
from core.constants import DEFAULT_MAX_STABILIZER_CONC, STABILIZER_WT_MULTIPLIER


class BatchWorker(QThread):
    progress = pyqtSignal(int, int)
    finished = pyqtSignal(object)
    error = pyqtSignal(str)

    def __init__(self, hours: float, max_conc: float, samples: int):
        super().__init__()
        self.hours = hours
        self.max_conc = max_conc
        self.samples = samples

    def run(self):
        try:
            df = run_batch_analysis(
                outdoor_hours=self.hours,
                max_stabilizer_conc=self.max_conc,
                num_samples=self.samples,
                progress_callback=lambda cur, tot: self.progress.emit(cur, tot)
            )
            self.finished.emit(df)
        except Exception as e:
            self.error.emit(str(e))


class AnalysisTab(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.current_df = None
        self.worker = None
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(16)
        layout.setContentsMargins(24, 22, 24, 22)

        # Controls Group
        ctrl_group = QGroupBox("Batch Degradation Analysis Settings")
        grid_layout = QHBoxLayout(ctrl_group)
        grid_layout.setSpacing(16)
        grid_layout.setContentsMargins(18, 22, 18, 18)

        # Hours
        v_h = QVBoxLayout()
        lbl_h = QLabel("Outdoor Exposure (Hours):")
        lbl_h.setStyleSheet("font-weight: 700; color: #0f172a;")
        self.input_hours = QLineEdit("1500")
        self.input_hours.setFixedHeight(42)
        self.input_hours.setStyleSheet("font-size: 14px; font-weight: 600; padding: 6px 12px;")
        v_h.addWidget(lbl_h)
        v_h.addWidget(self.input_hours)
        grid_layout.addLayout(v_h)

        # Max Dosage
        v_m = QVBoxLayout()
        lbl_m = QLabel("Max Stabilizer (wt.%):")
        lbl_m.setStyleSheet("font-weight: 700; color: #0f172a;")
        self.input_max = QLineEdit("0.8")
        self.input_max.setFixedHeight(42)
        self.input_max.setStyleSheet("font-size: 14px; font-weight: 600; padding: 6px 12px;")
        v_m.addWidget(lbl_m)
        v_m.addWidget(self.input_max)
        grid_layout.addLayout(v_m)

        # Samples
        v_s = QVBoxLayout()
        lbl_s = QLabel("Sample Resolutions:")
        lbl_s.setStyleSheet("font-weight: 700; color: #0f172a;")
        self.input_samples = QLineEdit("50")
        self.input_samples.setFixedHeight(42)
        self.input_samples.setStyleSheet("font-size: 14px; font-weight: 600; padding: 6px 12px;")
        v_s.addWidget(lbl_s)
        v_s.addWidget(self.input_samples)
        grid_layout.addLayout(v_s)

        # Run Button
        self.btn_run = QPushButton("⚡  Run Batch Simulation")
        self.btn_run.setFixedHeight(44)
        self.btn_run.setStyleSheet("font-size: 14px; font-weight: 700;")
        self.btn_run.clicked.connect(self.start_batch_analysis)
        grid_layout.addWidget(self.btn_run)

        layout.addWidget(ctrl_group)

        # Progress bar
        self.progress_bar = QProgressBar()
        self.progress_bar.setFixedHeight(18)
        self.progress_bar.setVisible(False)
        layout.addWidget(self.progress_bar)

        # Table Display
        self.table = QTableWidget()
        self.table.setColumnCount(5)
        self.table.setHorizontalHeaderLabels([
            "Stabilizer (wt.%)",
            "Final PVC Integrity (%)",
            "Degradation (%)",
            "Loss Reduction (%)",
            "HALS Efficiency (%)"
        ])
        self.table.horizontalHeader().setSectionResizeMode(QHeaderView.ResizeMode.Stretch)
        self.table.setStyleSheet("font-size: 13px; font-weight: 500;")
        layout.addWidget(self.table)

        # Export Buttons Row
        export_layout = QHBoxLayout()
        self.lbl_status = QLabel("Ready to analyze.")
        self.lbl_status.setStyleSheet("color: #475569; font-weight: 600; font-size: 13px;")
        export_layout.addWidget(self.lbl_status)
        export_layout.addStretch()

        self.btn_export_excel = QPushButton("📊  Export to Excel (.xlsx)")
        self.btn_export_excel.setObjectName("successButton")
        self.btn_export_excel.setFixedHeight(42)
        self.btn_export_excel.setEnabled(False)
        self.btn_export_excel.clicked.connect(self.export_excel)
        export_layout.addWidget(self.btn_export_excel)

        self.btn_export_csv = QPushButton("Export to CSV")
        self.btn_export_csv.setObjectName("secondaryButton")
        self.btn_export_csv.setFixedHeight(42)
        self.btn_export_csv.setEnabled(False)
        self.btn_export_csv.clicked.connect(self.export_csv)
        export_layout.addWidget(self.btn_export_csv)

        layout.addLayout(export_layout)

    def start_batch_analysis(self):
        try:
            hours = float(self.input_hours.text().strip())
            max_wt = float(self.input_max.text().strip())
            samples = int(self.input_samples.text().strip())
            samples = max(5, min(samples, 500))

            self.btn_run.setEnabled(False)
            self.progress_bar.setVisible(True)
            self.progress_bar.setValue(0)
            self.lbl_status.setText("Simulating chemical kinetics...")

            self.worker = BatchWorker(hours, max_wt / STABILIZER_WT_MULTIPLIER, samples)
            self.worker.progress.connect(self.on_progress)
            self.worker.finished.connect(self.on_finished)
            self.worker.error.connect(self.on_error)
            self.worker.start()

        except Exception as e:
            QMessageBox.critical(self, "Invalid Input", str(e))

    def on_progress(self, current, total):
        pct = int(current / total * 100)
        self.progress_bar.setValue(pct)

    def on_finished(self, df: pd.DataFrame):
        self.current_df = df
        self.btn_run.setEnabled(True)
        self.progress_bar.setVisible(False)
        self.btn_export_excel.setEnabled(True)
        self.btn_export_csv.setEnabled(True)
        self.lbl_status.setText(f"Batch completed: {len(df)} discrete formulations simulated.")

        self.table.setRowCount(len(df))
        for row_idx, row in df.iterrows():
            self.table.setItem(row_idx, 0, QTableWidgetItem(f"{row['Stabilizer_wt_percent']:.4f}"))
            self.table.setItem(row_idx, 1, QTableWidgetItem(f"{row['Final_PVC_Retention_Pct']:.2f}%"))
            self.table.setItem(row_idx, 2, QTableWidgetItem(f"{row['Degradation_Pct']:.2f}%"))
            self.table.setItem(row_idx, 3, QTableWidgetItem(f"{row['Degradation_Reduction_Pct']:.2f}%"))
            self.table.setItem(row_idx, 4, QTableWidgetItem(f"{row['Stabilizer_Efficiency_Pct']:.2f}%"))

    def on_error(self, err_msg):
        self.btn_run.setEnabled(True)
        self.progress_bar.setVisible(False)
        self.lbl_status.setText("Simulation failed.")
        QMessageBox.critical(self, "Simulation Error", err_msg)

    def export_excel(self):
        if self.current_df is None:
            return
        file_path, _ = QFileDialog.getSaveFileName(
            self,
            "Export Degradation Analysis to Excel",
            "pvc_degradation_analysis.xlsx",
            "Excel Files (*.xlsx)"
        )
        if file_path:
            try:
                hours = float(self.input_hours.text().strip())
                export_analysis_to_excel(self.current_df, file_path, hours)
                QMessageBox.information(self, "Export Complete", f"Successfully exported to:\n{file_path}")
            except Exception as e:
                QMessageBox.critical(self, "Export Error", str(e))

    def export_csv(self):
        if self.current_df is None:
            return
        file_path, _ = QFileDialog.getSaveFileName(
            self,
            "Export Degradation Analysis to CSV",
            "pvc_degradation_analysis.csv",
            "CSV Files (*.csv)"
        )
        if file_path:
            try:
                self.current_df.to_csv(file_path, index=False)
                QMessageBox.information(self, "Export Complete", f"Successfully exported to:\n{file_path}")
            except Exception as e:
                QMessageBox.critical(self, "Export Error", str(e))
