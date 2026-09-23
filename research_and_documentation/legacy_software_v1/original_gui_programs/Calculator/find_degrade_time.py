import numpy as np
from pvc_degrade_prof_simulator import PVC_deg_prof

def find_degrade_time(initial_stabilizer, target_pvc_concentration):
    degrade_time_in_hours = 0.5  # Start with 0.5 hour
    while True:
        model = PVC_deg_prof(initial_stabilizer, degrade_time_in_hours)
        # Solve the system
        model.solve()

        time_points = model.sol.t
        PVC_concentrations = model.sol.y[0]  # PVC concentration is the first in the array

        if PVC_concentrations[-1] > target_pvc_concentration:
            # If the target concentration is not reached, double the degrade time
            degrade_time_in_hours *= 2
        else:
            # Find the time point where PVC concentration <= target_pvc_concentration
            for i in range(len(PVC_concentrations) - 1):
                if PVC_concentrations[i] > target_pvc_concentration and PVC_concentrations[i + 1] <= target_pvc_concentration:
                    # Interpolate to find the exact time
                    t1, t2 = time_points[i], time_points[i + 1]
                    c1, c2 = PVC_concentrations[i], PVC_concentrations[i + 1]
                    # Linear interpolation formula
                    time_at_target = t1 + (t2 - t1) * (target_pvc_concentration - c1) / (c2 - c1)
                    return time_at_target / 3600  # Convert seconds to hours

            # If the loop completes without finding the concentration, increase time and continue
            degrade_time_in_hours *= 2
