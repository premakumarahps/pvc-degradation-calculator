"""
Optimum Stabilizer Calculator Tab.
Light modern professional interface with large, spacious input controls.
"""

from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QGridLayout, QLabel,
    QLineEdit, QPushButton, QGroupBox, QFrame, QMessageBox
)
from PyQt6.QtCore import Qt
import time

from core.optimizer import find_optimum_stabilizer, OptimizationStatus
from core.constants import DEFAULT_TARGET_PVC_RETENTION, DEFAULT_MAX_STABILIZER_CONC, STABILIZER_WT_MULTIPLIER


class CalculatorTab(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(18)
        layout.setContentsMargins(24, 22, 24, 22)

        # 1. Inputs Section
        input_group = QGroupBox("Formulation & Lifespan Requirements")
        grid = QGridLayout(input_group)
        grid.setSpacing(14)
        grid.setContentsMargins(18, 22, 18, 18)

        # Row 0: Lifetime Input
        lbl_lifetime = QLabel("Expected Outdoor Lifetime:")
        lbl_lifetime.setStyleSheet("font-weight: 700; color: #0f172a; font-size: 14px;")
        self.input_lifetime = QLineEdit("1500")
        self.input_lifetime.setFixedHeight(44)
        self.input_lifetime.setPlaceholderText("e.g. 1500")
        self.input_lifetime.setStyleSheet("font-size: 15px; font-weight: 600; padding: 6px 12px;")
        grid.addWidget(lbl_lifetime, 0, 0)
        grid.addWidget(self.input_lifetime, 0, 1)

        lbl_lifetime_hint = QLabel("(Hours of accelerated outdoor weathering exposure)")
        lbl_lifetime_hint.setStyleSheet("color: #64748b; font-size: 12px;")
        grid.addWidget(lbl_lifetime_hint, 0, 2)

        # Row 1: Max Dosage Input
        lbl_max_stab = QLabel("Max Stabilizer Bound (wt.%):")
        lbl_max_stab.setStyleSheet("font-weight: 700; color: #0f172a; font-size: 14px;")
        self.input_max_stab = QLineEdit(str(DEFAULT_MAX_STABILIZER_CONC * STABILIZER_WT_MULTIPLIER))
        self.input_max_stab.setFixedHeight(44)
        self.input_max_stab.setPlaceholderText("e.g. 0.8")
        self.input_max_stab.setStyleSheet("font-size: 15px; font-weight: 600; padding: 6px 12px;")
        grid.addWidget(lbl_max_stab, 1, 0)
        grid.addWidget(self.input_max_stab, 1, 1)

        lbl_max_hint = QLabel("(Typical industrial addition limit: 0.2 – 1.0 wt.%)")
        lbl_max_hint.setStyleSheet("color: #64748b; font-size: 12px;")
        grid.addWidget(lbl_max_hint, 1, 2)

        # Row 2: Target Retention Input
        lbl_target = QLabel("Target PVC Retention (%):")
        lbl_target.setStyleSheet("font-weight: 700; color: #0f172a; font-size: 14px;")
        self.input_target = QLineEdit(str(int(DEFAULT_TARGET_PVC_RETENTION * 100)))
        self.input_target.setFixedHeight(44)
        self.input_target.setPlaceholderText("e.g. 80")
        self.input_target.setStyleSheet("font-size: 15px; font-weight: 600; padding: 6px 12px;")
        grid.addWidget(lbl_target, 2, 0)
        grid.addWidget(self.input_target, 2, 1)

        lbl_target_hint = QLabel("(Critical integrity threshold before discoloration/embrittlement)")
        lbl_target_hint.setStyleSheet("color: #64748b; font-size: 12px;")
        grid.addWidget(lbl_target_hint, 2, 2)

        # Row 3: Quick Presets
        preset_layout = QHBoxLayout()
        preset_label = QLabel("Quick Presets:")
        preset_label.setStyleSheet("color: #475569; font-weight: 700; font-size: 13px;")
        preset_layout.addWidget(preset_label)

        for hours in [500, 1000, 1500, 1800]:
            btn = QPushButton(f"{hours} Hours")
            btn.setObjectName("secondaryButton")
            btn.setFixedHeight(34)
            btn.setFixedWidth(115)
            btn.setStyleSheet("font-size: 13px; font-weight: 600;")
            btn.clicked.connect(lambda checked, h=hours: self.input_lifetime.setText(str(h)))
            preset_layout.addWidget(btn)
        preset_layout.addStretch()
        grid.addLayout(preset_layout, 3, 0, 1, 3)

        # Row 4: Action Buttons
        btn_layout = QHBoxLayout()
        self.btn_calculate = QPushButton("⚡  Calculate Optimal Stabilizer Dosage")
        self.btn_calculate.setFixedHeight(48)
        self.btn_calculate.setStyleSheet("font-size: 15px; font-weight: 700; letter-spacing: 0.2px;")
        self.btn_calculate.clicked.connect(self.run_calculation)
        btn_layout.addWidget(self.btn_calculate, stretch=3)

        self.btn_clear = QPushButton("Reset Defaults")
        self.btn_clear.setObjectName("secondaryButton")
        self.btn_clear.setFixedHeight(48)
        self.btn_clear.setStyleSheet("font-size: 14px; font-weight: 600;")
        self.btn_clear.clicked.connect(self.reset_defaults)
        btn_layout.addWidget(self.btn_clear, stretch=1)

        grid.addLayout(btn_layout, 4, 0, 1, 3)
        layout.addWidget(input_group)

        # 2. Results Section Card
        self.result_card = QGroupBox("Prediction & Formulation Recommendation")
        res_layout = QVBoxLayout(self.result_card)
        res_layout.setSpacing(14)
        res_layout.setContentsMargins(18, 22, 18, 18)

        self.status_banner = QLabel("Enter desired lifetime above and click 'Calculate Optimal Stabilizer Dosage'")
        self.status_banner.setStyleSheet("""
            background-color: #f8fafc;
            color: #475569;
            font-size: 14px;
            font-weight: 600;
            padding: 14px 18px;
            border-radius: 8px;
            border: 1.5px solid #e2e8f0;
        """)
        self.status_banner.setWordWrap(True)
        res_layout.addWidget(self.status_banner)

        # Metrics display row
        self.metrics_frame = QFrame()
        self.metrics_frame.setStyleSheet("""
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 14px;
        """)
        metrics_layout = QHBoxLayout(self.metrics_frame)
        metrics_layout.setSpacing(12)

        self.metric_wt = self.create_metric_widget("Recommended Stabilizer", "-- wt.%")
        self.metric_dosage = self.create_metric_widget("Compounding Ratio", "-- g / kg PVC")
        self.metric_retention = self.create_metric_widget("Projected PVC Retention", "-- %")
        self.metric_compute = self.create_metric_widget("Solver Execution", "-- ms")

        metrics_layout.addWidget(self.metric_wt)
        metrics_layout.addWidget(self.metric_dosage)
        metrics_layout.addWidget(self.metric_retention)
        metrics_layout.addWidget(self.metric_compute)
        res_layout.addWidget(self.metrics_frame)

        # Detailed Chemical Guidance Card
        self.txt_details = QLabel(
            "<b>Chemical Mechanism Rationale:</b><br>"
            "Tinuvin 770 acts through the catalytic, regenerative <b>Denisov Cycle</b>. Under UV exposure, sterically "
            "hindered amine groups (>NH) trap photo-generated peroxy radicals (ROO*), converting into nitroxyl radicals (>NO*). "
            "These rapidly scavenge polymer alkyl radicals (R*) at near diffusion-controlled rates (k3 = 1.2 × 10⁹ M⁻¹s⁻¹), "
            "preventing destructive auto-oxidation chain scissions."
        )
        self.txt_details.setStyleSheet("""
            background-color: #ffffff;
            color: #475569;
            line-height: 150%;
            padding: 12px 16px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 13px;
        """)
        self.txt_details.setWordWrap(True)
        res_layout.addWidget(self.txt_details)

        layout.addWidget(self.result_card)
        layout.addStretch()

    def create_metric_widget(self, title: str, default_val: str) -> QWidget:
        box = QFrame()
        box.setStyleSheet("""
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px;
        """)
        box_layout = QVBoxLayout(box)
        box_layout.setContentsMargins(4, 4, 4, 4)
        box_layout.setSpacing(4)
        lbl_t = QLabel(title)
        lbl_t.setStyleSheet("font-size: 12px; color: #64748b; font-weight: 600; border: none; background: transparent;")
        lbl_v = QLabel(default_val)
        lbl_v.setStyleSheet("font-size: 18px; color: #0284c7; font-weight: 700; border: none; background: transparent;")
        lbl_v.setObjectName("valueLabel")
        box_layout.addWidget(lbl_t)
        box_layout.addWidget(lbl_v)
        return box

    def set_metric_value(self, metric_widget: QWidget, value: str, color: str = "#0284c7"):
        lbl = metric_widget.findChild(QLabel, "valueLabel")
        if lbl:
            lbl.setText(value)
            lbl.setStyleSheet(f"font-size: 18px; color: {color}; font-weight: 700; border: none; background: transparent;")

    def run_calculation(self):
        try:
            raw_lifetime = self.input_lifetime.text().strip()
            if not raw_lifetime:
                raise ValueError("Please provide an expected outdoor lifetime.")
            lifetime_hours = float(raw_lifetime)

            raw_max_wt = self.input_max_stab.text().strip()
            max_wt = float(raw_max_wt) if raw_max_wt else (DEFAULT_MAX_STABILIZER_CONC * STABILIZER_WT_MULTIPLIER)
            max_stab_fraction = max_wt / STABILIZER_WT_MULTIPLIER

            raw_target = self.input_target.text().strip()
            target_pct = float(raw_target) if raw_target else (DEFAULT_TARGET_PVC_RETENTION * 100.0)
            target_fraction = target_pct / 100.0

            t0 = time.time()
            result = find_optimum_stabilizer(
                expected_outdoor_hours=lifetime_hours,
                max_stabilizer_conc=max_stab_fraction,
                target_pvc_retention=target_fraction
            )
            elapsed_ms = (time.time() - t0) * 1000.0

            self.set_metric_value(self.metric_compute, f"{elapsed_ms:.1f} ms", "#0f172a")

            if result.status == OptimizationStatus.SAFE_WITHOUT_STABILIZER:
                self.status_banner.setText("✅  NO STABILIZER NEEDED: The polymer matrix retains over 80% integrity naturally for this exposure period.")
                self.status_banner.setStyleSheet("""
                    background-color: #f0fdf4;
                    color: #15803d;
                    font-size: 14px;
                    font-weight: 700;
                    padding: 14px 18px;
                    border-radius: 8px;
                    border: 1.5px solid #86efac;
                """)
                self.set_metric_value(self.metric_wt, "0.0000 wt.%", "#16a34a")
                self.set_metric_value(self.metric_dosage, "0.00 g / kg", "#16a34a")
                self.set_metric_value(self.metric_retention, f"{result.final_pvc_retention:.1f}%", "#16a34a")

            elif result.status == OptimizationStatus.OPTIMUM_FOUND:
                rec_wt = result.recommended_wt_percent
                g_per_kg = rec_wt * 10.0  # wt% * 10 = g / kg
                self.status_banner.setText(f"🎯  OPTIMAL DOSAGE FOUND: Add {rec_wt:.4f} wt.% of Tinuvin 770 HALS stabilizer.")
                self.status_banner.setStyleSheet("""
                    background-color: #f0fdf4;
                    color: #166534;
                    font-size: 15px;
                    font-weight: 700;
                    padding: 14px 18px;
                    border-radius: 8px;
                    border: 1.5px solid #86efac;
                """)
                self.set_metric_value(self.metric_wt, f"{rec_wt:.4f} wt.%", "#0284c7")
                self.set_metric_value(self.metric_dosage, f"{g_per_kg:.2f} g / kg", "#0284c7")
                self.set_metric_value(self.metric_retention, f"{result.final_pvc_retention:.1f}%", "#0284c7")

            else:
                self.status_banner.setText("⚠️  LIFETIME EXCEEDED: Target duration exceeds single-stabilizer maximum capability within standard dosage limits.")
                self.status_banner.setStyleSheet("""
                    background-color: #fffbeb;
                    color: #92400e;
                    font-size: 14px;
                    font-weight: 700;
                    padding: 14px 18px;
                    border-radius: 8px;
                    border: 1.5px solid #fde68a;
                """)
                self.set_metric_value(self.metric_wt, "Exceeded", "#d97706")
                self.set_metric_value(self.metric_dosage, "N/A", "#d97706")
                self.set_metric_value(self.metric_retention, "< 80.0%", "#d97706")

        except Exception as e:
            QMessageBox.critical(self, "Calculation Error", str(e))

    def reset_defaults(self):
        self.input_lifetime.setText("1500")
        self.input_max_stab.setText(str(DEFAULT_MAX_STABILIZER_CONC * STABILIZER_WT_MULTIPLIER))
        self.input_target.setText(str(int(DEFAULT_TARGET_PVC_RETENTION * 100)))
        self.status_banner.setText("Defaults restored. Click 'Calculate Optimal Stabilizer Dosage'.")
        self.status_banner.setStyleSheet("""
            background-color: #f8fafc;
            color: #475569;
            font-size: 14px;
            font-weight: 600;
            padding: 14px 18px;
            border-radius: 8px;
            border: 1.5px solid #e2e8f0;
        """)
        self.set_metric_value(self.metric_wt, "-- wt.%")
        self.set_metric_value(self.metric_dosage, "-- g / kg PVC")
        self.set_metric_value(self.metric_retention, "-- %")
        self.set_metric_value(self.metric_compute, "-- ms")
