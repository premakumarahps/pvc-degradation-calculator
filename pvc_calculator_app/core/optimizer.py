"""
Optimization engine for determining the minimum required HALS stabilizer concentration
to achieve a targeted PVC product outdoor lifetime.
"""

from dataclasses import dataclass
from enum import Enum
import numpy as np
from typing import Optional, List

from core.kinetics import PVCDegradationModel
from core.constants import (
    OUTDOOR_HOURS_SCALING_FACTOR,
    STABILIZER_WT_MULTIPLIER,
    DEFAULT_TARGET_PVC_RETENTION,
    DEFAULT_MAX_STABILIZER_CONC,
    DEFAULT_DECIMAL_PLACES
)


class OptimizationStatus(Enum):
    SAFE_WITHOUT_STABILIZER = "SAFE_WITHOUT_STABILIZER"
    OPTIMUM_FOUND = "OPTIMUM_FOUND"
    EXCEEDS_MAX_LIFETIME = "EXCEEDS_MAX_LIFETIME"


@dataclass
class OptimizationResult:
    status: OptimizationStatus
    outdoor_hours: float
    scaled_hours: float
    recommended_wt_percent: float
    recommended_raw_conc: float
    final_pvc_retention: float
    message: str
    target_threshold: float = DEFAULT_TARGET_PVC_RETENTION

    @property
    def is_success(self) -> bool:
        return self.status != OptimizationStatus.EXCEEDS_MAX_LIFETIME


def find_optimum_stabilizer(
    expected_outdoor_hours: float,
    max_stabilizer_conc: float = DEFAULT_MAX_STABILIZER_CONC,
    target_pvc_retention: float = DEFAULT_TARGET_PVC_RETENTION,
    decimal_places: int = DEFAULT_DECIMAL_PLACES,
    rate_constants: Optional[List[float]] = None
) -> OptimizationResult:
    """
    Finds the optimal HALS stabilizer concentration to achieve the target lifetime.
    
    Args:
        expected_outdoor_hours: Desired lifespan in real-world outdoor exposure hours
        max_stabilizer_conc: Upper search bound for stabilizer fraction (default 0.2)
        target_pvc_retention: Desired minimum remaining PVC fraction (default 0.8 = 80%)
        decimal_places: Precision for rounding
        rate_constants: Optional custom rate constants
    """
    if expected_outdoor_hours <= 0:
        raise ValueError("Expected lifetime must be greater than 0.")
    if max_stabilizer_conc <= 0:
        raise ValueError("Max stabilizer concentration must be greater than 0.")

    # Convert outdoor weathering hours to scaled model hours
    scaled_hours = expected_outdoor_hours / OUTDOOR_HOURS_SCALING_FACTOR

    # Step 1: Check baseline without any stabilizer (conc = 0)
    baseline_model = PVCDegradationModel(0.0, scaled_hours, rate_constants=rate_constants)
    _, baseline_y = baseline_model.solve()
    baseline_final_pvc = baseline_y[0][-1]

    if baseline_final_pvc >= target_pvc_retention:
        return OptimizationResult(
            status=OptimizationStatus.SAFE_WITHOUT_STABILIZER,
            outdoor_hours=expected_outdoor_hours,
            scaled_hours=scaled_hours,
            recommended_wt_percent=0.0,
            recommended_raw_conc=0.0,
            final_pvc_retention=round(baseline_final_pvc * 100, 2),
            message="No stabilizer required! PVC retains over 80% integrity naturally for this duration."
        )

    # Step 2: Binary search across candidate concentrations
    steps = 10000
    concentrations = np.linspace(0.0, max_stabilizer_conc, num=steps)
    low, high = 0, len(concentrations) - 1
    best_idx = None

    while low <= high:
        mid = (low + high) // 2
        cand_conc = concentrations[mid]
        model = PVCDegradationModel(cand_conc, scaled_hours, rate_constants=rate_constants)
        _, y = model.solve()
        final_pvc = y[0][-1]

        if final_pvc >= target_pvc_retention:
            best_idx = mid
            high = mid - 1  # Seek smaller concentration that still satisfies threshold
        else:
            low = mid + 1

    if best_idx is not None:
        opt_conc = float(concentrations[best_idx])
        final_model = PVCDegradationModel(opt_conc, scaled_hours, rate_constants=rate_constants)
        _, final_y = final_model.solve()
        final_pvc = final_y[0][-1]

        recommended_wt = round(opt_conc * STABILIZER_WT_MULTIPLIER, decimal_places)
        return OptimizationResult(
            status=OptimizationStatus.OPTIMUM_FOUND,
            outdoor_hours=expected_outdoor_hours,
            scaled_hours=scaled_hours,
            recommended_wt_percent=recommended_wt,
            recommended_raw_conc=round(opt_conc, decimal_places),
            final_pvc_retention=round(final_pvc * 100, 2),
            message=f"Optimal formulation: Add {recommended_wt} wt.% of Tinuvin 770 stabilizer."
        )

    # If even the maximum stabilizer concentration cannot maintain target integrity:
    return OptimizationResult(
        status=OptimizationStatus.EXCEEDS_MAX_LIFETIME,
        outdoor_hours=expected_outdoor_hours,
        scaled_hours=scaled_hours,
        recommended_wt_percent=-1.0,
        recommended_raw_conc=-1.0,
        final_pvc_retention=0.0,
        message="No suitable stabilizer concentration found within maximum dosage limit. "
                "The target lifetime exceeds maximum single-stabilizer capability. "
                "Consider combining Tinuvin 770 with a UV absorber (e.g. Tinuvin P) or reducing target lifetime."
    )


def find_degradation_time_for_target(
    stabilizer_conc: float,
    target_pvc_fraction: float = DEFAULT_TARGET_PVC_RETENTION,
    rate_constants: Optional[List[float]] = None
) -> float:
    """
    Computes the total outdoor hours until PVC drops to the specified target retention.
    """
    scaled_hours = 0.1
    max_scaled_hours = 50.0  # Safe cap to avoid infinite loops

    while scaled_hours <= max_scaled_hours:
        model = PVCDegradationModel(stabilizer_conc, scaled_hours, rate_constants=rate_constants)
        t_hours, y = model.solve()
        pvc = y[0]

        if pvc[-1] > target_pvc_fraction:
            scaled_hours *= 2.0
        else:
            # Interpolate exact point
            for i in range(len(pvc) - 1):
                if pvc[i] >= target_pvc_fraction and pvc[i + 1] <= target_pvc_fraction:
                    t1, t2 = t_hours[i], t_hours[i + 1]
                    c1, c2 = pvc[i], pvc[i + 1]
                    t_scaled = t1 + (t2 - t1) * (target_pvc_fraction - c1) / (c2 - c1 + 1e-12)
                    return t_scaled * OUTDOOR_HOURS_SCALING_FACTOR
            scaled_hours *= 2.0

    return max_scaled_hours * OUTDOOR_HOURS_SCALING_FACTOR


# Backward compatibility helper matching original function signature
def find_optimum_concentration2(degrade_time_in_hours, max_stab_concentartion=0.2, decimal_places=8):
    # Note: original function received scaled time directly
    res = find_optimum_stabilizer(
        expected_outdoor_hours=degrade_time_in_hours * OUTDOOR_HOURS_SCALING_FACTOR,
        max_stabilizer_conc=max_stab_concentartion,
        decimal_places=decimal_places
    )
    if res.status == OptimizationStatus.SAFE_WITHOUT_STABILIZER:
        return -1
    elif res.status == OptimizationStatus.EXCEEDS_MAX_LIFETIME:
        return -2
    return res.recommended_raw_conc
