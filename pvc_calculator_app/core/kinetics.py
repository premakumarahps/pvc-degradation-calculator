"""
Kinetics simulator for PVC degradation and HALS (Hindered Amine Light Stabilizer) stabilization.
Solves the coupled system of 8 stiff ordinary differential equations (ODEs).
"""

from typing import List, Tuple, Optional, Dict
import numpy as np
from scipy.integrate import solve_ivp

from core.constants import DEFAULT_RATE_CONSTANTS, SPECIES_KEYS


class PVCDegradationModel:
    """
    Simulates the chemical kinetics of PVC degradation in the presence of HALS (Tinuvin 770).
    Uses the stiff backward differentiation formula (BDF) solver.
    """

    def __init__(
        self,
        initial_stabilizer: float,
        degrade_time_in_hours: float,
        rate_constants: Optional[List[float]] = None,
        initial_pvc: float = 1.0,
        max_evaluation_points: int = 1000
    ):
        """
        Args:
            initial_stabilizer: Initial stabilizer concentration fraction (e.g. 0.0 to 0.2)
            degrade_time_in_hours: Degradation duration in scaled simulation hours
            rate_constants: 9 reaction rate constants [k1..k9]. Uses defaults if None.
            initial_pvc: Initial normalized PVC concentration (default 1.0 = 100%)
            max_evaluation_points: Maximum time points to evaluate for plotting/memory safety
        """
        self.initial_pvc = float(initial_pvc)
        self.initial_stabilizer = float(initial_stabilizer)
        self.degrade_time_in_hours = float(degrade_time_in_hours)
        self.rate_constants = rate_constants or list(DEFAULT_RATE_CONSTANTS)
        self.max_evaluation_points = max_evaluation_points

        # Time span converted to seconds for ODE solver
        self.degrade_time_seconds = self.degrade_time_in_hours * 3600.0

        # Initial concentrations:
        # [PVC, R_N_H, Cl_rad, R_N_OH, R_N_O_R, R_NO_rad, R_rad, R_OO_rad]
        self.initial_concentrations = [
            self.initial_pvc,
            self.initial_stabilizer,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0
        ]

        self.t_span = (0.0, max(self.degrade_time_seconds, 1e-6))

        # Dynamically calculate safe number of evaluation points (avoids memory explosion)
        num_intervals = min(max(int(self.degrade_time_seconds * 10), 100), self.max_evaluation_points)
        self.evaluation_intervals = np.linspace(0.0, self.degrade_time_seconds, num_intervals)

        self.sol = None

    @staticmethod
    def kinetics_ode(t: float, y: List[float], k: List[float]) -> List[float]:
        """
        Coupled stiff differential equations representing the chemical kinetics:
        y[0]: PVC
        y[1]: R_N_H   (Active HALS)
        y[2]: Cl_rad  (Chlorine radical)
        y[3]: R_N_OH  (Hydroxylamine)
        y[4]: R_N_O_R (Alkoxyamine)
        y[5]: R_NO_rad(Nitroxyl radical)
        y[6]: R_rad   (Polymer alkyl radical)
        y[7]: R_OO_rad(Polymer peroxy radical)
        """
        pvc, r_n_h, cl_rad, r_n_oh, r_n_o_r, r_no_rad, r_rad, r_oo_rad = y
        k1, k2, k3, k4, k5, k6, k7, k8, k9 = k

        # 1. PVC Matrix loss through photolysis and radical attacks
        d_pvc_dt = -k6 * pvc - k8 * pvc * r_oo_rad - k9 * cl_rad * pvc

        # 2. Chlorine radical formation
        d_cl_rad_dt = k6 * pvc + k8 * pvc * r_oo_rad

        # 3. Alkyl radical balance (formation vs scavenging)
        d_r_rad_dt = k6 * pvc - k7 * r_rad - k3 * r_rad * r_no_rad

        # 4. Peroxy radical balance (formation vs scavenging by HALS species)
        d_r_oo_rad_dt = (
            k7 * r_rad
            - k8 * r_oo_rad * pvc
            - k1 * r_oo_rad * r_n_h
            - k2 * r_oo_rad * r_n_oh
            - k4 * r_n_o_r * r_oo_rad
        )

        # 5. HALS consumption
        d_r_n_h_dt = -k1 * r_oo_rad * r_n_h

        # 6. Hydroxylamine intermediate
        d_r_n_oh_dt = k1 * r_oo_rad * r_n_h + k5 * r_n_o_r - k2 * r_n_oh * r_oo_rad

        # 7. Alkoxyamine intermediate
        d_r_n_o_r_dt = k3 * r_no_rad * r_rad - k5 * r_n_o_r - k4 * r_n_o_r * r_oo_rad

        # 8. Catalytic Nitroxyl radical regeneration (Denisov Cycle)
        d_r_no_rad_dt = k4 * r_n_o_r * r_oo_rad + k2 * r_oo_rad * r_n_oh - k3 * r_rad * r_no_rad

        return [
            d_pvc_dt,
            d_r_n_h_dt,
            d_cl_rad_dt,
            d_r_n_oh_dt,
            d_r_n_o_r_dt,
            d_r_no_rad_dt,
            d_r_rad_dt,
            d_r_oo_rad_dt
        ]

    def solve(self) -> Tuple[np.ndarray, np.ndarray]:
        """
        Solves the ODE system using Scipy's BDF method.
        Returns:
            (time_points_in_hours, concentrations_array [8, N])
        """
        self.sol = solve_ivp(
            self.kinetics_ode,
            self.t_span,
            self.initial_concentrations,
            args=(self.rate_constants,),
            method='BDF',
            t_eval=self.evaluation_intervals,
            rtol=1e-6,
            atol=1e-8
        )

        if not self.sol.success:
            raise RuntimeError(f"ODE Solver failed: {self.sol.message}")

        # Convert evaluation times back to hours for clean interpretation
        time_hours = self.sol.t / 3600.0
        return time_hours, self.sol.y

    def get_species_dict(self) -> Dict[str, np.ndarray]:
        """Returns results as a keyed dictionary by species name."""
        if self.sol is None:
            self.solve()
        return {key: self.sol.y[i] for i, key in enumerate(SPECIES_KEYS)}


# Backward-compatible alias for original scripts
PVC_deg_prof = PVCDegradationModel
