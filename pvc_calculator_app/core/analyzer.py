"""
Batch sensitivity and degradation analysis module.
Generates comprehensive Excel/CSV reports of polymer retention across stabilizer dosages.
"""

from typing import Optional, Callable
import numpy as np
import pandas as pd

from core.kinetics import PVCDegradationModel
from core.constants import OUTDOOR_HOURS_SCALING_FACTOR, STABILIZER_WT_MULTIPLIER


def run_batch_analysis(
    outdoor_hours: float,
    max_stabilizer_conc: float = 0.2,
    num_samples: int = 200,
    progress_callback: Optional[Callable[[int, int], None]] = None
) -> pd.DataFrame:
    """
    Simulates PVC degradation across a range of stabilizer concentrations.
    
    Args:
        outdoor_hours: Real-world outdoor exposure hours
        max_stabilizer_conc: Maximum stabilizer fraction
        num_samples: Number of discrete concentration samples
        progress_callback: Optional function (current_step, total_steps)
    
    Returns:
        pd.DataFrame containing full degradation metrics.
    """
    scaled_hours = outdoor_hours / OUTDOOR_HOURS_SCALING_FACTOR
    concentrations = np.linspace(0.0, max_stabilizer_conc, num=num_samples)

    records = []
    initial_degradation_pct = None

    for idx, conc in enumerate(concentrations):
        model = PVCDegradationModel(conc, scaled_hours)
        _, y = model.solve()
        final_pvc = float(y[0][-1])
        degrade_pct = max(0.0, (1.0 - final_pvc) * 100.0)

        if idx == 0:
            initial_degradation_pct = degrade_pct

        reduction_pct = max(0.0, initial_degradation_pct - degrade_pct)
        efficiency_pct = (reduction_pct / initial_degradation_pct * 100.0) if initial_degradation_pct > 0 else 0.0

        records.append({
            "Stabilizer_Fraction": round(conc, 6),
            "Stabilizer_wt_percent": round(conc * STABILIZER_WT_MULTIPLIER, 4),
            "Final_PVC_Retention_Fraction": round(final_pvc, 6),
            "Final_PVC_Retention_Pct": round(final_pvc * 100.0, 2),
            "Degradation_Pct": round(degrade_pct, 2),
            "Degradation_Reduction_Pct": round(reduction_pct, 2),
            "Stabilizer_Efficiency_Pct": round(efficiency_pct, 2)
        })

        if progress_callback:
            progress_callback(idx + 1, num_samples)

    return pd.DataFrame(records)


def export_analysis_to_excel(
    df: pd.DataFrame,
    file_path: str,
    outdoor_hours: float
) -> str:
    """
    Saves analysis DataFrame to Excel with formatted sheets and metadata.
    """
    if not file_path.endswith('.xlsx'):
        file_path += '.xlsx'

    with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Kinetics Analysis', index=False)

        # Write metadata sheet
        meta_df = pd.DataFrame([
            {"Parameter": "Outdoor Exposure Hours", "Value": outdoor_hours},
            {"Parameter": "Calculated Hours (Scaled)", "Value": outdoor_hours / OUTDOOR_HOURS_SCALING_FACTOR},
            {"Parameter": "Polymer Matrix", "Value": "Rigid Polyvinyl Chloride (PVC)"},
            {"Parameter": "Stabilizer System", "Value": "HALS Tinuvin 770 (Bis(2,2,6,6-tetramethyl-4-piperidyl) sebacate)"},
            {"Parameter": "Model Method", "Value": "Stiff ODE System (BDF Solver)"},
            {"Parameter": "Author", "Value": "Group 1 University Research / PREMAKUMARA H.P.S."}
        ])
        meta_df.to_excel(writer, sheet_name='Model Metadata', index=False)

    return file_path


# Backward compatible alias for original script
def degrade_analyse(degrade_time_in_hours, file_name="PVC_degradation_analysis_final", maximum_stab_concentration=0.2):
    df = run_batch_analysis(
        outdoor_hours=degrade_time_in_hours * OUTDOOR_HOURS_SCALING_FACTOR,
        max_stabilizer_conc=maximum_stab_concentration,
        num_samples=1000
    )
    # Match original column naming for legacy compatibility
    export_df = pd.DataFrame({
        "[Stabilizer]": df["Stabilizer_Fraction"],
        "Final [PVC]": df["Final_PVC_Retention_Fraction"],
        "Degrade%": df["Degradation_Pct"],
        "Reduction%": df["Degradation_Reduction_Pct"]
    })
    export_df.to_excel(file_name + ".xlsx", index=False)
