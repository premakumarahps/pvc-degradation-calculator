"""
Main Entrypoint for the PVC Photodegradation Kinetics & HALS Formulation Optimizer.
Supports both Graphical User Interface (GUI) and Command-Line Interface (CLI).
"""

import sys
import os
import argparse

# Add current directory to path for clean relative imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from core.optimizer import find_optimum_stabilizer, OptimizationStatus
from core.analyzer import run_batch_analysis, export_analysis_to_excel
from core.constants import DEFAULT_MAX_STABILIZER_CONC, STABILIZER_WT_MULTIPLIER


def run_cli(args):
    """Executes the calculation via CLI without launching a window."""
    print("=" * 65)
    print("  PVC Photodegradation Kinetics & HALS Formulation Optimizer")
    print("  Academic Research: University Group 1")
    print("=" * 65)

    if args.batch:
        print(f"\nRunning batch analysis for {args.hours} outdoor hours across dosages up to {args.max_stab} wt.%...")
        df = run_batch_analysis(
            outdoor_hours=args.hours,
            max_stabilizer_conc=args.max_stab / STABILIZER_WT_MULTIPLIER,
            num_samples=args.samples
        )
        out_file = args.batch
        if out_file.endswith('.csv'):
            df.to_csv(out_file, index=False)
        else:
            export_analysis_to_excel(df, out_file, args.hours)
        print(f"Batch results successfully saved to: {out_file}")
        print("\nFirst 5 entries:")
        print(df.head().to_string())
        return

    print(f"\nEvaluating requirements:")
    print(f" - Expected Outdoor Weathering: {args.hours} hours")
    print(f" - Maximum Stabilizer Bound:    {args.max_stab} wt.%")
    print(f" - Target Minimum PVC Integrity:{args.target * 100:.1f} %")

    result = find_optimum_stabilizer(
        expected_outdoor_hours=args.hours,
        max_stabilizer_conc=args.max_stab / STABILIZER_WT_MULTIPLIER,
        target_pvc_retention=args.target
    )

    print("\nResult:")
    if result.status == OptimizationStatus.SAFE_WITHOUT_STABILIZER:
        print(" [STATUS: SAFE]")
        print(" No stabilizer is required. PVC retains over 80% integrity naturally.")
    elif result.status == OptimizationStatus.OPTIMUM_FOUND:
        print(" [STATUS: OPTIMAL DOSAGE FOUND]")
        print(f" Recommended Stabilizer Dosage: {result.recommended_wt_percent:.4f} wt.% (Tinuvin 770)")
        print(f" Compounding Formulation Ratio: {result.recommended_wt_percent * 10.0:.2f} g / kg PVC")
        print(f" Projected PVC Retention:      {result.final_pvc_retention:.1f} %")
    else:
        print(" [STATUS: EXCEEDED]")
        print(" Target lifetime exceeds single-stabilizer maximum capability within standard dosage limits.")
        print(" Consider combining Tinuvin 770 with a UV absorber (e.g. Tinuvin P) or adjusting formulation.")
    print("=" * 65)


def run_gui():
    """Launches the PyQt6 Graphical User Interface with an enforced Light Modern Theme."""
    from PyQt6.QtWidgets import QApplication
    from PyQt6.QtGui import QPalette, QColor
    from PyQt6.QtCore import Qt
    from gui.main_window import MainWindow
    from gui.theme import LIGHT_MODERN_STYLESHEET

    app = QApplication(sys.argv)
    app.setApplicationName("PVC Degradation Optimizer")
    app.setStyle("Fusion")

    # Enforce pure light modern palette across all platforms
    palette = QPalette()
    palette.setColor(QPalette.ColorRole.Window, QColor("#f8fafc"))
    palette.setColor(QPalette.ColorRole.WindowText, QColor("#0f172a"))
    palette.setColor(QPalette.ColorRole.Base, QColor("#ffffff"))
    palette.setColor(QPalette.ColorRole.AlternateBase, QColor("#f1f5f9"))
    palette.setColor(QPalette.ColorRole.ToolTipBase, QColor("#ffffff"))
    palette.setColor(QPalette.ColorRole.ToolTipText, QColor("#0f172a"))
    palette.setColor(QPalette.ColorRole.Text, QColor("#0f172a"))
    palette.setColor(QPalette.ColorRole.Button, QColor("#ffffff"))
    palette.setColor(QPalette.ColorRole.ButtonText, QColor("#0f172a"))
    palette.setColor(QPalette.ColorRole.BrightText, QColor("#ef4444"))
    palette.setColor(QPalette.ColorRole.Link, QColor("#0284c7"))
    palette.setColor(QPalette.ColorRole.Highlight, QColor("#0284c7"))
    palette.setColor(QPalette.ColorRole.HighlightedText, QColor("#ffffff"))
    app.setPalette(palette)

    app.setStyleSheet(LIGHT_MODERN_STYLESHEET)

    window = MainWindow()
    window.show()

    sys.exit(app.exec())


def main():
    parser = argparse.ArgumentParser(description="PVC Photodegradation Kinetics & HALS Formulation Optimizer")
    parser.add_argument("--cli", action="store_true", help="Run in Command-Line Interface mode")
    parser.add_argument("--hours", type=float, default=1500.0, help="Expected outdoor weathering hours (default: 1500)")
    parser.add_argument("--max-stab", type=float, default=0.8, help="Maximum stabilizer bound in wt. percent (default: 0.8)")
    parser.add_argument("--target", type=float, default=0.8, help="Target minimum PVC retention fraction (default: 0.8)")
    parser.add_argument("--batch", type=str, default=None, help="Save batch analysis to output filename (.xlsx or .csv)")
    parser.add_argument("--samples", type=int, default=50, help="Number of samples for batch analysis (default: 50)")

    args = parser.parse_args()

    if args.cli or args.batch:
        run_cli(args)
    else:
        run_gui()


if __name__ == "__main__":
    main()
