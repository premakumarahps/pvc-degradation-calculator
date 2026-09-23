import numpy as np
from scipy.integrate import solve_ivp

# Time span for the simulation
t_span = (0, 100)

# Evaluation intervals
evaluation_intervals = np.linspace(0, 100, 100)

# Initial conditions for x and y
y0 = [0, 2]  # Replace with actual initial values

# Define the ODE system
def solver(t, z):
    x, y = z
    dy_dt = x/2 -5*t+10
    dx_dt = 12*t+10
    return [dx_dt, dy_dt]

# Solve the ODE
sol = solve_ivp(solver, t_span, y0, method='BDF', t_eval=evaluation_intervals, rtol=1e-6, atol=1e-8)

# Print the solution
print(sol.t)  # Time points
print(sol.y)  # Solution values at the time points
