import numpy as np
from scipy.integrate import solve_ivp
from scipy.optimize import root_scalar
import matplotlib.pyplot as plt

# Define the differential equations
def kinetics(t, y, k, R_N_H):
    PVC, Cl_rad, R_N_OH, R_N_O_R, R_NO_rad, R_rad, R_OO_rad = y
    k1, k2, k3, k4, k5, k6, k7, k8, k9 = k
    
    dPVC_dt = -k6 * PVC - k8 * PVC * R_OO_rad - k9 * Cl_rad * PVC
    dCl_rad_dt = k6 * PVC + k8 * PVC * R_OO_rad
    dR_N_OH_dt = k1 * R_OO_rad * R_N_H + k5 * R_N_O_R - k2 * R_N_OH * R_OO_rad
    dR_N_O_R_dt = k3 * R_NO_rad * R_rad - k5 * R_N_O_R - k4 * R_N_O_R * R_OO_rad
    dR_NO_rad_dt = k4 * R_N_O_R * R_OO_rad + k2 * R_OO_rad * R_N_OH - k3 * R_rad * R_NO_rad
    dR_rad_dt = k6 * PVC - k7 * R_rad - k3 * R_rad * R_NO_rad
    dR_OO_rad_dt = k7 * R_rad - k8 * R_OO_rad * PVC - k1 * R_OO_rad * R_N_H - k2 * R_OO_rad * R_N_OH - k4 * R_N_O_R * R_OO_rad
    
    return [dPVC_dt, dCl_rad_dt, dR_N_OH_dt, dR_N_O_R_dt, dR_NO_rad_dt, dR_rad_dt, dR_OO_rad_dt]

# Define the rate constants
k_values = [51, 5.5e2, 1.2e9, 1.9e-3, 9.3e-5, 1e-5, 1e8, 0.5, 0.1]

# Define the function to solve the ODEs and find the PVC concentration after 1 hour
def solve_for_stabilizer(initial_stabilizer, initial_PVC, target_PVC, time_hours, R_N_H):
    time_seconds = time_hours * 3600
    y0 = [initial_PVC, 0, initial_stabilizer, 0, 0, 0, 0]
    t_span = (0, time_seconds)
    t_eval = np.linspace(0, time_seconds, 100)

    sol = solve_ivp(kinetics, t_span, y0, args=(k_values, R_N_H), method='BDF', t_eval=t_eval, rtol=1e-6, atol=1e-8)

    if sol.status != 0:
        print(f"Solver failed with message: {sol.message}")
        return None

    PVC_conc_at_target_time = sol.y[0, -1]  # Concentration at the end of the time interval
    return PVC_conc_at_target_time - target_PVC

# Initial parameters
initial_PVC = 1.0  # Initial concentration of PVC
target_PVC = 0.5   # Target concentration of PVC
time_hours = 1     # Time in hours to reach the target concentration
R_N_H = 1.0        # Concentration of R-N-H

# Use root finding to determine the required initial stabilizer concentration
def find_bracket(func, initial_guess, args, step=0.1, max_iter=100):
    left = initial_guess
    right = initial_guess + step
    for _ in range(max_iter):
        f_left = func(left, *args)
        f_right = func(right, *args)
        if f_left * f_right < 0:
            return left, right
        left += step
        right += step
    raise ValueError("Could not find a valid bracket")

# Try to find a valid bracket
try:
    bracket = find_bracket(solve_for_stabilizer, initial_guess=0, args=(initial_PVC, target_PVC, time_hours, R_N_H))
    result = root_scalar(solve_for_stabilizer, args=(initial_PVC, target_PVC, time_hours, R_N_H), bracket=bracket, method='brentq')

    if result.converged:
        initial_stabilizer = result.root
        print(f"Required initial stabilizer concentration: {initial_stabilizer:.4f} M")

        # Solve the kinetics with the found initial stabilizer concentration
        y0 = [initial_PVC, 0, initial_stabilizer, 0, 0, 0, 0]
        t_span = (0, time_hours * 3600)
        t_eval = np.linspace(0, time_hours * 3600, 100)
        sol = solve_ivp(kinetics, t_span, y0, args=(k_values, R_N_H), method='BDF', t_eval=t_eval, rtol=1e-6, atol=1e-8)
        
        # Plot the results
        if sol.status == 0:
            t = sol.t / 3600  # Convert time to hours
            PVC_conc = sol.y[0]
            plt.plot(t, PVC_conc, label='[PVC]')
            plt.axhline(y=target_PVC, color='r', linestyle='--', label='Target [PVC]')
            plt.xlabel('Time (hours)')
            plt.ylabel('Concentration (M)')
            plt.legend()
            plt.title('PVC Degradation Kinetics')
            plt.show()
        else:
            print(f"Solver failed with message: {sol.message}")
    else:
        print("Failed to find the required initial stabilizer concentration.")
except ValueError as e:
    print(f"Error: {e}")
