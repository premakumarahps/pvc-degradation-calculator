import numpy as np
import pandas as pd
from pvc_degrade_prof_simulator import PVC_deg_prof  

def degrade_analyse(degrade_time_in_hours,file_name="PVC_degradation_analysis_final",maximum_stab_concentration=0.2):
    # Define the range of stabilizer concentrations
    #start , end , num_intervals
    stabilizer_concentrations = np.linspace(0, maximum_stab_concentration, num=1000)

    # Initialize an empty list to store results
    results = []

    # Run simulations for each stabilizer concentration
    for concentration in stabilizer_concentrations:
        model = PVC_deg_prof(concentration, degrade_time_in_hours)
        time_points, concentrations = model.solve()
        
        # Store only the final PVC concentration
        final_pvc_concentration = concentrations[0][-1]  # PVC concentration is the first element in concentrations array
        degrade_per=(1-final_pvc_concentration)*100
        
        if (concentration==0):init_degrade_per=degrade_per
        reduction_per=init_degrade_per-degrade_per
        
        results.append([concentration, final_pvc_concentration, degrade_per, reduction_per])

    # Create a DataFrame from the results
    df = pd.DataFrame(results, columns=["[Stabilizer]", "Final [PVC]", "Degrade%", "Reduction%"])

    # Export the DataFrame to an Excel file
    df.to_excel(file_name+".xlsx", index=False)
