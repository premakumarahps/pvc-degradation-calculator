import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

# Define the differential equations
def kinetics(t, y, k):
    # Unpacking Concentrations                     
    PVC, R_N_H, Cl_rad, R_N_OH, R_N_O_R, R_NO_rad, R_rad, R_OO_rad = y
    # Unpacking Reaction Rate Constants
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

# Define the rate constants
rate_constants = [51, 5.5e2, 1.2e9, 1.9e-3, 9.3e-5, 1e-6, 1e8, 0.5, 0.1]

# Initial parameters
initial_PVC = 1.0
expected_lifetime = float(input("Enter expected life time : "))  # in hours
initial_stabilizer = float(input("Enter stabilizer concentration : ")) 

# Convert lifetime to seconds
time_seconds = expected_lifetime * 3600

# Initial concentrations
y0 = [initial_PVC, initial_stabilizer, 0, 0, 0, 0, 0, 0]

# Time span for the simulation
t_span = (0, time_seconds)

# Evaluation intervals
evaluation_intervals = np.linspace(0, time_seconds, 500)

# Solve the system of differential equations
sol = solve_ivp(kinetics, t_span, y0, args=(rate_constants,), method='BDF', t_eval=evaluation_intervals, rtol=1e-6, atol=1e-8)

# Extract solution components
t = sol.t
PVC, R_N_H, Cl_rad, R_N_OH, R_N_O_R, R_NO_rad, R_rad, R_OO_rad = sol.y

# Configure the plot
plt.figure(figsize=(10, 6))

# Plot each concentration with a unique label
plt.plot(t, PVC, label='PVC')
plt.plot(t, R_N_H, label='R_N_H')
plt.plot(t, Cl_rad, label='Cl_rad')
plt.plot(t, R_N_OH, label='R_N_OH')
plt.plot(t, R_N_O_R, label='R_N_O_R')
plt.plot(t, R_NO_rad, label='R_NO_rad')
plt.plot(t, R_rad, label='R_rad')
plt.plot(t, R_OO_rad, label='R_OO_rad')

# Add labels and title
plt.xlabel('Time (seconds)')
plt.ylabel('Concentration')
plt.title('Concentration Profiles')
plt.legend()

# Display the plot
plt.show()

print("PVC initial concentration : ",PVC[0])
print("PVC concentration Now : ",PVC[-1])
