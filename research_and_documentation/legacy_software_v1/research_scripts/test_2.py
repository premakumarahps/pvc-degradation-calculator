import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp

# Define rate constants
k6 = 8.3e-7  # s^-1
k7 = 1e8   # M^-1 s^-1
k8 = 0.5e3  # M^-1 s^-1
k9 = 0.1   # M^-1 s^-1

# Define the system of ODEs
def odes(t, y):
    PVC, R_prime, R_prime_OO, Cl = y
    dPVC_dt = -k6 * PVC - k8 * PVC * R_prime_OO - k9 * Cl * PVC
    dR_prime_dt = k6 * PVC - k7 * R_prime
    dR_prime_OO_dt = k7 * R_prime - k8 * R_prime_OO * PVC
    dCl_dt = k6 * PVC + k8 * PVC * R_prime_OO
    return [dPVC_dt, dR_prime_dt, dR_prime_OO_dt, dCl_dt]

# Initial concentrations
PVC0 = 1.0  # M (assuming initial concentration of PVC is 1 M)
R_prime0 = 0.0  # M
R_prime_OO0 = 0.0  # M
Cl0 = 0.0  # M
time = 10000

# Initial conditions vector
y0 = [PVC0, R_prime0, R_prime_OO0, Cl0]

# Time span for the simulation
t_span = (0, time)  # s
t_eval = np.linspace(t_span[0], t_span[1], time)

# Solve the system of ODEs using the BDF method
solution = solve_ivp(odes, t_span, y0, method='BDF', t_eval=t_eval)

# Extract solution
PVC_sol = solution.y[0]

# Plot the concentration of PVC over time
plt.plot(solution.t, PVC_sol, label='[PVC]')
plt.xlabel('Time (s)')
plt.ylabel('Concentration (M)')
plt.title('Concentration of PVC over Time')
plt.legend()
plt.grid()
plt.show()
