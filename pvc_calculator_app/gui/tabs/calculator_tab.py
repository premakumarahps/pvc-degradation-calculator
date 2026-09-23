"""
Optimum Stabilizer Calculator Tab.
Clean light modern interface with scrollable container, vibrant buttons, and rock-solid layout.
"""

from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QGridLayout, QLabel,
    QLineEdit, QPushButton, QGroupBox, QFrame, QMessageBox, QScrollArea, QSizePolicy
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
        # Root layout with QScrollArea to prevent any squashing or overlapping
        self.setStyleSheet("background-color: #f8fafc;")
        root_layout = QVBoxLayout(self)
        root_layout.setContentsMargins(0, 0, 0, 0)
        root_layout.setSpacing(0)

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QFrame.Shape.NoFrame)
        scroll.setStyleSheet("QScrollArea { background-color: #f8fafc; border: none; }")
        scroll.viewport().setStyleSheet("background-color: #f8fafc;")

        content_widget = QWidget()
        content_widget.setStyleSheet("background-color: #f8fafc;")
        content_layout = QVBoxLayout(content_widget)
        content_layout.setContentsMargins(18, 6, 18, 8)
        content_layout.setSpacing(10)

        # -------------------------------------------------------------
        # Section 1: Inputs Card
        # -------------------------------------------------------------
        input_group = QGroupBox("Formulation and Lifespan Requirements")
        input_layout = QVBoxLayout(input_group)
        input_layout.setContentsMargins(14, 14, 14, 8)
        input_layout.setSpacing(8)

        # 3-Row Grid for Inputs
        grid = QGridLayout()
        grid.setHorizontalSpacing(16)
        grid.setVerticalSpacing(6)

        input_qss = """
            QLineEdit {
                background-color: #ffffff;
                color: #0f172a;
                border: 1.5px solid #cbd5e1;
                border-radius: 6px;
                padding: 4px 10px;
                font-size: 14px;
                font-weight: 600;
            }
            QLineEdit:focus {
                border: 2px solid #0284c7;
            }
        """

        # Row 0: Lifetime
        lbl_life = QLabel("Expected Outdoor Lifetime:")
        lbl_life.setStyleSheet("font-weight: 700; color: #0f172a; font-size: 13px;")
        lbl_life.setFixedWidth(220)
        self.input_lifetime = QLineEdit("1500")
        self.input_lifetime.setFixedHeight(34)
        self.input_lifetime.setStyleSheet(input_qss)
        self.input_lifetime.setPlaceholderText("e.g. 1500")
        hint_life = QLabel("(Hours of accelerated outdoor weathering exposure)")
        hint_life.setStyleSheet("color: #64748b; font-size: 12px;")

        grid.addWidget(lbl_life, 0, 0)
        grid.addWidget(self.input_lifetime, 0, 1)
        grid.addWidget(hint_life, 0, 2)

        # Row 1: Max Stabilizer Bound
        lbl_max = QLabel("Max Stabilizer Bound (wt.%):")
        lbl_max.setStyleSheet("font-weight: 700; color: #0f172a; font-size: 13px;")
        lbl_max.setFixedWidth(220)
        self.input_max_stab = QLineEdit(str(DEFAULT_MAX_STABILIZER_CONC * STABILIZER_WT_MULTIPLIER))
        self.input_max_stab.setFixedHeight(34)
        self.input_max_stab.setStyleSheet(input_qss)
        self.input_max_stab.setPlaceholderText("e.g. 0.8")
        hint_max = QLabel("(Standard industrial addition limit: 0.2 – 1.0 wt.%)")
        hint_max.setStyleSheet("color: #64748b; font-size: 12px;")

        grid.addWidget(lbl_max, 1, 0)
        grid.addWidget(self.input_max_stab, 1, 1)
        grid.addWidget(hint_max, 1, 2)

        # Row 2: Target Retention
        lbl_target = QLabel("Target PVC Retention (%):")
        lbl_target.setStyleSheet("font-weight: 700; color: #0f172a; font-size: 13px;")
        lbl_target.setFixedWidth(220)
        self.input_target = QLineEdit(str(int(DEFAULT_TARGET_PVC_RETENTION * 100)))
        self.input_target.setFixedHeight(34)
        self.input_target.setStyleSheet(input_qss)
        self.input_target.setPlaceholderText("e.g. 80")
        hint_target = QLabel("(Critical integrity threshold before yellowing/cracking)")
        hint_target.setStyleSheet("color: #64748b; font-size: 12px;")

        grid.addWidget(lbl_target, 2, 0)
        grid.addWidget(self.input_target, 2, 1)
        grid.addWidget(hint_target, 2, 2)

        input_layout.addLayout(grid)

        # Presets Row
        preset_layout = QHBoxLayout()
        preset_layout.setSpacing(10)
        lbl_preset = QLabel("Quick Presets:")
        lbl_preset.setStyleSheet("font-weight: 700; color: #475569; font-size: 12px;")
        lbl_preset.setFixedWidth(100)
        preset_layout.addWidget(lbl_preset)

        preset_qss = """
            QPushButton {
                background-color: #ffffff;
                color: #334155;
                border: 1.5px solid #cbd5e1;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
            }
            QPushButton:hover {
                background-color: #f1f5f9;
                border-color: #0284c7;
                color: #0284c7;
            }
            QPushButton:pressed {
                background-color: #e2e8f0;
            }
        """

        for hours in [500, 1000, 1500, 1800]:
            btn = QPushButton(f"{hours} Hours")
            btn.setFixedHeight(30)
            btn.setFixedWidth(105)
            btn.setStyleSheet(preset_qss)
            btn.clicked.connect(lambda checked, h=hours: self.input_lifetime.setText(str(h)))
            preset_layout.addWidget(btn)
        preset_layout.addStretch()
        input_layout.addLayout(preset_layout)

        # Action Buttons Row
        btn_layout = QHBoxLayout()
        btn_layout.setSpacing(12)

        self.btn_calculate = QPushButton("⚡  Calculate Optimal Stabilizer Dosage")
        self.btn_calculate.setFixedHeight(38)
        self.btn_calculate.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Fixed)
        self.btn_calculate.setStyleSheet("""
            QPushButton {
                background-color: #0284c7;
                color: #ffffff;
                border: 1px solid #0284c7;
                border-radius: 6px;
                font-size: 13.5px;
                font-weight: 700;
                letter-spacing: 0.2px;
            }
            QPushButton:hover {
                background-color: #0369a1;
                border-color: #0369a1;
            }
            QPushButton:pressed {
                background-color: #075985;
            }
        """)
        self.btn_calculate.clicked.connect(self.run_calculation)
        btn_layout.addWidget(self.btn_calculate, stretch=3)

        self.btn_clear = QPushButton("Reset Defaults")
        self.btn_clear.setFixedHeight(38)
        self.btn_clear.setFixedWidth(140)
        self.btn_clear.setStyleSheet("""
            QPushButton {
                background-color: #ffffff;
                color: #475569;
                border: 1.5px solid #cbd5e1;
                border-radius: 6px;
                font-size: 12.5px;
                font-weight: 600;
            }
            QPushButton:hover {
                background-color: #f1f5f9;
                border-color: #94a3b8;
                color: #0f172a;
            }
            QPushButton:pressed {
                background-color: #e2e8f0;
            }
        """)
        self.btn_clear.clicked.connect(self.reset_defaults)
        btn_layout.addWidget(self.btn_clear, stretch=1)

        input_layout.addLayout(btn_layout)
        content_layout.addWidget(input_group)

        # -------------------------------------------------------------
        # Section 2: Results Card
        # -------------------------------------------------------------
        self.result_card = QGroupBox("Prediction and Formulation Recommendation")
        res_layout = QVBoxLayout(self.result_card)
        res_layout.setContentsMargins(14, 14, 14, 8)
        res_layout.setSpacing(8)

        # Status Banner
        self.status_banner = QLabel("Enter requirements above and click 'Calculate Optimal Stabilizer Dosage'")
        self.status_banner.setMinimumHeight(38)
        self.status_banner.setStyleSheet("""
            background-color: #f1f5f9;
            color: #475569;
            font-size: 12.5px;
            font-weight: 600;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #cbd5e1;
        """)
        self.status_banner.setWordWrap(True)
        res_layout.addWidget(self.status_banner)

        # Metrics display row (4 Cards)
        metrics_container = QWidget()
        metrics_container.setStyleSheet("background-color: transparent;")
        metrics_layout = QHBoxLayout(metrics_container)
        metrics_layout.setContentsMargins(0, 0, 0, 0)
        metrics_layout.setSpacing(8)

        self.metric_wt = self.create_metric_card("Recommended Stabilizer", "-- wt.%")
        self.metric_dosage = self.create_metric_card("Compounding Ratio", "-- g / kg PVC")
        self.metric_retention = self.create_metric_card("Projected PVC Retention", "-- %")
        self.metric_compute = self.create_metric_card("Solver Execution", "-- ms")

        metrics_layout.addWidget(self.metric_wt)
        metrics_layout.addWidget(self.metric_dosage)
        metrics_layout.addWidget(self.metric_retention)
        metrics_layout.addWidget(self.metric_compute)
        res_layout.addWidget(metrics_container)

        # Chemical Mechanism Description Card
        self.txt_details = QLabel(
            "<b>Chemical Mechanism Rationale:</b> "
            "Tinuvin 770 operates through the catalytic, regenerative <b>Denisov Cycle</b>. Under UV radiation, "
            "hindered amine groups (>NH) scavenge photo-generated peroxy radicals (ROO*), forming nitroxyl radicals (>NO*) "
            "which intercept polymer alkyl radicals (R*) at near diffusion-controlled rates (k3 = 1.2 × 10⁹ M⁻¹s⁻¹), "
            "suppressing auto-oxidation chain scission."
        )
        self.txt_details.setStyleSheet("""
            background-color: #f8fafc;
            color: #475569;
            line-height: 135%;
            padding: 8px 12px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 11.5px;
        """)
        self.txt_details.setWordWrap(True)
        res_layout.addWidget(self.txt_details)

        content_layout.addWidget(self.result_card)

        scroll.setWidget(content_widget)
        root_layout.addWidget(scroll)

    def create_metric_card(self, title: str, default_val: str) -> QFrame:
        card = QFrame()
        card.setObjectName("metricCard")
        card.setMinimumHeight(76)
        card.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Fixed)
        card.setStyleSheet("""
            QFrame#metricCard {
                background-color: #ffffff;
                border: 1.5px solid #e2e8f0;
                border-radius: 8px;
            }
        """)
        card_layout = QVBoxLayout(card)
        card_layout.setContentsMargins(12, 10, 12, 10)
        card_layout.setSpacing(4)

        lbl_t = QLabel(title)
        lbl_t.setStyleSheet("font-size: 11.5px; color: #64748b; font-weight: 600; border: none; background: transparent;")
        lbl_v = QLabel(default_val)
        lbl_v.setStyleSheet("font-size: 18px; color: #0284c7; font-weight: 700; border: none; background: transparent;")
        lbl_v.setObjectName("valueLabel")

        card_layout.addWidget(lbl_t)
        card_layout.addWidget(lbl_v)
        return card

    def set_metric_value(self, card: QFrame, value: str, color: str = "#0284c7"):
        lbl = card.findChild(QLabel, "valueLabel")
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
                    padding: 12px 16px;
                    border-radius: 6px;
                    border: 1.5px solid #86efac;
                """)
                self.set_metric_value(self.metric_wt, "0.0000 wt.%", "#16a34a")
                self.set_metric_value(self.metric_dosage, "0.00 g / kg", "#16a34a")
                self.set_metric_value(self.metric_retention, f"{result.final_pvc_retention:.1f}%", "#16a34a")

            elif result.status == OptimizationStatus.OPTIMUM_FOUND:
                rec_wt = result.recommended_wt_percent
                g_per_kg = rec_wt * 10.0
                self.status_banner.setText(f"🎯  OPTIMAL DOSAGE FOUND: Add {rec_wt:.4f} wt.% of Tinuvin 770 HALS stabilizer.")
                self.status_banner.setStyleSheet("""
                    background-color: #f0fdf4;
                    color: #166534;
                    font-size: 14px;
                    font-weight: 700;
                    padding: 12px 16px;
                    border-radius: 6px;
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
                    padding: 12px 16px;
                    border-radius: 6px;
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
            background-color: #f1f5f9;
            color: #475569;
            font-size: 13.5px;
            font-weight: 600;
            padding: 12px 16px;
            border-radius: 6px;
            border: 1px solid #cbd5e1;
        """)
        self.set_metric_value(self.metric_wt, "-- wt.%")
        self.set_metric_value(self.metric_dosage, "-- g / kg PVC")
        self.set_metric_value(self.metric_retention, "-- %")
        self.set_metric_value(self.metric_compute, "-- ms")
