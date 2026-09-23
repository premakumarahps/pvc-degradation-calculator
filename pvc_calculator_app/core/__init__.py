"""
PVC Degradation and Stabilization Core Package.
"""

from core.constants import (
    DEFAULT_RATE_CONSTANTS,
    SPECIES_KEYS,
    SPECIES_METADATA,
    OUTDOOR_HOURS_SCALING_FACTOR,
    STABILIZER_WT_MULTIPLIER
)
from core.kinetics import PVCDegradationModel, PVC_deg_prof
from core.optimizer import (
    find_optimum_stabilizer,
    find_optimum_concentration2,
    find_degradation_time_for_target,
    OptimizationResult,
    OptimizationStatus
)
from core.analyzer import run_batch_analysis, export_analysis_to_excel, degrade_analyse

__all__ = [
    "DEFAULT_RATE_CONSTANTS",
    "SPECIES_KEYS",
    "SPECIES_METADATA",
    "OUTDOOR_HOURS_SCALING_FACTOR",
    "STABILIZER_WT_MULTIPLIER",
    "PVCDegradationModel",
    "PVC_deg_prof",
    "find_optimum_stabilizer",
    "find_optimum_concentration2",
    "find_degradation_time_for_target",
    "OptimizationResult",
    "OptimizationStatus",
    "run_batch_analysis",
    "export_analysis_to_excel",
    "degrade_analyse"
]
