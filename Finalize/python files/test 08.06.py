import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

# Define the differential equations
def kinetics(t, y, k):
    # Unpacking Concentrations
    PVC, Cl_rad, R_rad, R_OO_rad = y
    # Unpacking Reaction Rate Constants
    k6, k7, k8, k9 = k

    # Define the differential equations
    dPVC_dt = -k6 * PVC - k8 * PVC * R_OO_rad - k9 * Cl_rad * PVC
    dCl_rad_dt = k6 * PVC - k9 * Cl_rad * PVC
    dR_rad_dt = k6 * PVC - k7 * R_rad
    dR_OO_rad_dt = k7 * R_rad - k8 * R_OO_rad * PVC

    return [dPVC_dt, dCl_rad_dt, dR_rad_dt, dR_OO_rad_dt]

# Define the rate constants
rate_constants = [1e-6, 1e8, 0.5, 0.1]

# Initial parameters
initial_PVC = 1.0
expected_lifetime = 4  # in hours

# Convert lifetime to seconds
time_seconds = expected_lifetime * 3600

# Initial concentrations
y0 = [initial_PVC, 0, 0, 0]

# Time span for the simulation
t_span = (0, time_seconds)

# Evaluation intervals
evaluation_intervals = np.linspace(0, time_seconds, 100)

# Solve the system of differential equations
sol = solve_ivp(kinetics, t_span, y0, args=(rate_constants,), method='BDF', t_eval=evaluation_intervals, rtol=1e-6, atol=1e-8)

# Extract solution components
t = sol.t
PVC, Cl_rad, R_rad, R_OO_rad = sol.y

# Configure the plot
plt.figure(figsize=(10, 6))

# Plot each concentration with a unique label
plt.plot(t, PVC, label='PVC')
plt.plot(t, Cl_rad, label='Cl_rad')
plt.plot(t, R_rad, label='R_rad')
plt.plot(t, R_OO_rad, label='R_OO_rad')

# Add labels and title
plt.xlabel('Time (seconds)')
plt.ylabel('Concentration')
plt.title('Concentration Profiles')
plt.legend()

# Display the plot
plt.show()
