"""
Constants and chemical species definitions for the PVC Degradation and HALS Stabilization model.
Based on research: "Degradation Kinetic Modeling and Prediction of Optimal HALS Amount for Effective UV Stabilization of PVC"
"""

from typing import List, Dict, Tuple

# Reaction rate constants (k1 through k9)
# k1: R_OO* + >NH -> >NOH (Peroxy radical scavenging by HALS)
# k2: R_OO* + >NOH -> >NO* (Scavenging by hydroxylamine)
# k3: >NO* + R* -> >NOR (Alkyl radical scavenging by nitroxyl radical)
# k4: >NOR + R_OO* -> >NO* + inert (Alkoxyamine peroxy radical reaction)
# k5: >NOR -> >NOH + olefin (Thermal/photolytic cleavage)
# k6: PVC + hv -> R* + Cl* (Initiation under UV light)
# k7: R* + O2 -> R_OO* (Propagation: rapid reaction with dissolved oxygen)
# k8: R_OO* + PVC -> R* + Cl* (Propagation: hydrogen abstraction)
# k9: Cl* + PVC -> R* + HCl (Autocatalytic propagation by chlorine radicals)
DEFAULT_RATE_CONSTANTS: List[float] = [
    51.0,      # k1
    550.0,     # k2 (5.5e2)
    1.2e9,     # k3
    1.9e-3,    # k4
    9.3e-5,    # k5
    1.0e-6,    # k6
    1.0e8,     # k7
    0.5,       # k8
    0.1        # k9
]

# Kinetic species list in ODE order
SPECIES_KEYS: List[str] = [
    "PVC",
    "R_N_H",
    "Cl_rad",
    "R_N_OH",
    "R_N_O_R",
    "R_NO_rad",
    "R_rad",
    "R_OO_rad"
]

# Human-readable labels and chemical names
SPECIES_METADATA: Dict[str, Dict[str, str]] = {
    "PVC": {
        "label": "PVC Matrix [PVC]",
        "formula": "[-CH2-CHCl-]n",
        "description": "Polyvinyl chloride polymer matrix concentration (fraction)",
        "color": "#38bdf8"  # Sky blue
    },
    "R_N_H": {
        "label": "Active HALS [>NH]",
        "formula": "Tinuvin 770 (>NH)",
        "description": "Hindered Amine Light Stabilizer (Tinuvin 770)",
        "color": "#10b981"  # Emerald green
    },
    "Cl_rad": {
        "label": "Chlorine Radical [Cl*]",
        "formula": "Cl*",
        "description": "Chlorine radical from C-Cl photolytic scission",
        "color": "#f59e0b"  # Amber
    },
    "R_N_OH": {
        "label": "Hydroxylamine [>N-OH]",
        "formula": ">N-OH",
        "description": "Intermediate hydroxylamine derivative in Denisov cycle",
        "color": "#8b5cf6"  # Purple
    },
    "R_N_O_R": {
        "label": "Alkoxyamine [>N-O-R]",
        "formula": ">N-O-R",
        "description": "Intermediate alkoxyamine formed by radical recombination",
        "color": "#ec4899"  # Pink
    },
    "R_NO_rad": {
        "label": "Nitroxyl Radical [>NO*]",
        "formula": ">NO*",
        "description": "Catalytic nitroxyl radical in regenerative Denisov cycle",
        "color": "#06b6d4"  # Cyan
    },
    "R_rad": {
        "label": "Polymer Radical [R*]",
        "formula": "R*",
        "description": "Carbon-centered polymer alkyl radical",
        "color": "#ef4444"  # Crimson red
    },
    "R_OO_rad": {
        "label": "Peroxy Radical [ROO*]",
        "formula": "ROO*",
        "description": "Degradative polymer peroxy radical",
        "color": "#f97316"  # Orange
    }
}

# Empirical conversion factors from original university validation:
# - Time scaling: 2800 hours corresponds to accelerated outdoor weathering cycle
OUTDOOR_HOURS_SCALING_FACTOR: float = 2800.0

# - Weight percentage conversion: stabilizer concentration fraction to wt.%
STABILIZER_WT_MULTIPLIER: float = 4.0

# Default thresholds
DEFAULT_TARGET_PVC_RETENTION: float = 0.8  # 80% residual polymer integrity
DEFAULT_MAX_STABILIZER_CONC: float = 0.2   # Max stabilizer fraction (0.8 wt.%)
DEFAULT_DECIMAL_PLACES: int = 6
