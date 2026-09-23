import numpy as np
from scipy.integrate import solve_ivp

class PVC_deg_prof:
    def __init__(self, initial_stabilizer, degrade_time_in_hours , rate_constants=[51, 5.5e2, 1.2e9, 1.9e-3, 9.3e-5, 1e-6, 1e8, 0.5, 0.1], simulate_time_point=0.1, initial_PVC=1):
        self.initial_PVC = initial_PVC
        self.initial_stabilizer = initial_stabilizer
        self.degrade_time = degrade_time_in_hours
        self.rate_constants = rate_constants 
        self.simulate_time_point = simulate_time_point  # default 0.1 second

        # Convert lifetime to seconds
        self.degrade_time_seconds = degrade_time_in_hours * 3600

        # Initial concentrations
        # [PVC], [R_N_H], [Cl_rad], [R_N_OH], [R_N_O_R], [R_NO_rad], [R_rad], [R_OO_rad]
        self.initial_concentrations = [initial_PVC, initial_stabilizer, 0, 0, 0, 0, 0, 0]

        # Time span for the simulation
        self.t_span = (0, self.degrade_time_seconds)

        # Adjust number of intervals based on the specified resolution
        num_intervals = int(self.degrade_time_seconds / self.simulate_time_point)

        # Evaluation intervals
        self.evaluation_intervals = np.linspace(0, self.degrade_time_seconds, num_intervals)

        # Placeholder for the solution
        self.sol = None

    def kinetics_model(self, t, y, k):
        # Unpacking concentrations                     
        PVC, R_N_H, Cl_rad, R_N_OH, R_N_O_R, R_NO_rad, R_rad, R_OO_rad = y
        # Unpacking reaction rate constants
        k1, k2, k3, k4, k5, k6, k7, k8, k9 = k

        # Define the differential equations
        dPVC_dt = -k6 * PVC - k8 * PVC * R_OO_rad - k9 * Cl_rad * PVC
        dCl_rad_dt = k6 * PVC + k8 * PVC * R_OO_rad
        dR_rad_dt = k6 * PVC - k7 * R_rad - k3 * R_rad * R_NO_rad
        dR_OO_rad_dt = k7 * R_rad - k8 * R_OO_rad * PVC - k1 * R_OO_rad * R_N_H - k2 * R_OO_rad * R_N_OH - k4 * R_N_O_R * R_OO_rad

        dR_N_H_dt = -k1 * R_OO_rad * R_N_H
        dR_N_OH_dt = k1 * R_OO_rad * R_N_H + k5 * R_N_O_R - k2 * R_N_OH * R_OO_rad
        dR_N_O_R_dt = k3 * R_NO_rad * R_rad - k5 * R_N_O_R - k4 * R_N_O_R * R_OO_rad
        dR_NO_rad_dt = k4 * R_N_O_R * R_OO_rad + k2 * R_OO_rad * R_N_OH - k3 * R_rad * R_NO_rad

        return [dPVC_dt, dR_N_H_dt, dCl_rad_dt, dR_N_OH_dt, dR_N_O_R_dt, dR_NO_rad_dt, dR_rad_dt, dR_OO_rad_dt]

    def solve(self):
        self.sol = solve_ivp(
            self.kinetics_model,            # function
            self.t_span,                    # time span
            self.initial_concentrations,    # initial conditions
            args=(self.rate_constants,),    # rate constants
            method='BDF',
            t_eval=self.evaluation_intervals,
            rtol=1e-6,
            atol=1e-8)
        
        if self.sol is None:
            raise ValueError("The system has not been solved yet. Call the 'solve' method first.")
        
        return self.sol.t, self.sol.y
