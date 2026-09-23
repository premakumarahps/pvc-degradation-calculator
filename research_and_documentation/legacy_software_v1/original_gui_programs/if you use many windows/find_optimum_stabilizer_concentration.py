import numpy as np
from pvc_degrade_prof_simulator import PVC_deg_prof  


def find_optimum_concentration1(degrade_time_in_hours,max_stab_concentartion=0.2):

    # Define the range of stabilizer concentrations
    #start , end , num_intervals
    stabilizer_concentrations = np.linspace(0, max_stab_concentartion, num=10000)

    # Initialize an empty list to store results
    results = []

    # Initialize a flag to track whether the condition is met
    found_stabilizer_concentration = False

    # Run simulations for each stabilizer concentration
    for stab_concentration in stabilizer_concentrations:
        model = PVC_deg_prof(stab_concentration, degrade_time_in_hours)
        time_points, concentrations = model.solve()
        
        # Store only the final PVC concentration
        final_pvc_concentration = concentrations[0][-1]  # PVC concentration is the first element in concentrations array

        if (final_pvc_concentration>0.8):
            if (stab_concentration==0):
                return -1 #that means "No need add stabilizer"
            else:
                return stab_concentration # that means "Stabiler cancentration to achive expected life time"

            found_stabilizer_concentration = True
            break

    # If no suitable stabilizer concentration was found
    if not found_stabilizer_concentration:
        return -2 #that means "No suitable stabilizer concentration found for this expected life time. Try shorter expected life time or introduce another stabilers."

#fast method
def find_optimum_concentration2(degrade_time_in_hours, max_stab_concentartion=0.2, decimal_places=10):

    # Define the range of stabilizer concentrations
    stabilizer_concentrations = np.linspace(0, max_stab_concentartion, num=10000)

    low, high = 0, len(stabilizer_concentrations) - 1

    # Run binary search for the suitable stabilizer concentration
    while low <= high:
        mid = (low + high) // 2
        stab_concentration = stabilizer_concentrations[mid]
        model = PVC_deg_prof(stab_concentration, degrade_time_in_hours)
        time_points, concentrations = model.solve()

        # Store only the final PVC concentration
        final_pvc_concentration = concentrations[0][-1]  # PVC concentration is the first element in concentrations array

        if final_pvc_concentration > 0.8:
            high = mid - 1
        else:
            low = mid + 1

    # Check the found concentration
    if low < len(stabilizer_concentrations):
        stab_concentration = stabilizer_concentrations[low]
        model = PVC_deg_prof(stab_concentration, degrade_time_in_hours)
        time_points, concentrations = model.solve()
        final_pvc_concentration = concentrations[0][-1]

        if final_pvc_concentration > 0.8:
            if stab_concentration == 0:
                return -1  # No need to add stabilizer
            else:
                return round(stab_concentration, decimal_places)  # Suitable stabilizer concentration found

    # If no suitable stabilizer concentration was found
    return -2  # No suitable stabilizer concentration found for this expected lifetime
