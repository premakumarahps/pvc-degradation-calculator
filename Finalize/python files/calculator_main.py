import numpy as np # For numerical operations
from scipy.integrate import solve_ivp # For solving initial value problems for ODEs

# Define the differential equations
def kinetics(t, y, k, R_N_H):
    # Unpacking Concentrations
    PVC, Cl_rad, R_N_OH, R_N_O_R, R_NO_rad, R_rad, R_OO_rad = y
    # Unpacking Reaction Rate Constants
    k1, k2, k3, k4, k5, k6, k7, k8, k9, k10 = k

    # Define the differential equations
    dPVC_dt = -k6 * PVC - k8 * PVC * R_OO_rad - k9 * Cl_rad * PVC
    dCl_rad_dt = k6 * PVC + k8 * PVC * R_OO_rad-k10*Cl_rad*Cl_rad
    dR_N_OH_dt = k1 * R_OO_rad * R_N_H + k5 * R_N_O_R - k2 * R_N_OH * R_OO_rad
    dR_N_O_R_dt = k3 * R_NO_rad * R_rad - k5 * R_N_O_R - k4 * R_N_O_R * R_OO_rad
    dR_NO_rad_dt = k4 * R_N_O_R * R_OO_rad + k2 * R_OO_rad * R_N_OH - k3 * R_rad * R_NO_rad
    dR_rad_dt = k6 * PVC - k7 * R_rad - k3 * R_rad * R_NO_rad
    dR_OO_rad_dt = k7 * R_rad - k8 * R_OO_rad * PVC - k1 * R_OO_rad * R_N_H - k2 * R_OO_rad * R_N_OH - k4 * R_N_O_R * R_OO_rad
    
    return [dPVC_dt, dCl_rad_dt, dR_N_OH_dt, dR_N_O_R_dt, dR_NO_rad_dt, dR_rad_dt, dR_OO_rad_dt]

# Define the function to solve the ODEs and find the PVC concentration after a given time
def solve_for_stabilizer(initial_stabilizer, initial_PVC, target_PVC, expected_lifetime_hours):
    time_seconds = expected_lifetime_hours * 3600
    y0 = [initial_PVC, 0, initial_stabilizer, 0, 0, 0, 0] # Define the initial concentrations of all species in the system
    t_span = (0, time_seconds) # The total time duration over which the chemical kinetics are to be simulated
    evaluation_intervals = np.linspace(0, time_seconds, 100) # Store integration interval

    sol = solve_ivp(kinetics, t_span, y0, args=(rate_constants, initial_stabilizer), method='BDF', t_eval=evaluation_intervals, rtol=1e-6, atol=1e-8) 

    if sol.status != 0:
        print("Solver failed")
        return None

    # Print full solution for debugging
    print("Solution:", sol.y)

    PVC_concentration_at_target_time = sol.y[0, -1]  # Concentration at the end of the time interval
    return PVC_concentration_at_target_time - target_PVC

# Define the rate constants
rate_constants = [51, 5.5e2, 1.2e9, 1.9e-3, 9.3e-5, 1e-3, 1e8, 0.5, 0.1,1e9]

# Initial parameters
initial_PVC = 1.0  
target_PVC = 0.4   
expected_lifetime = 1     

# Test with different stabilizer concentrations
initial_stabilizer = 1000

result = solve_for_stabilizer(initial_stabilizer, initial_PVC, target_PVC, expected_lifetime)
print(f"Initial stabilizer: {initial_stabilizer}, PVC deviation: {result}")
