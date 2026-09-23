import matplotlib.pyplot as plt
from pvc_degrade_prof_simulator import PVC_deg_prof

#how use this method e.g. plot_degrade_prof(PVC=True, R_N_H=True)
def plot_degrade_prof(initial_stabilizer,degrade_time_in_hours, **args ):

    model = PVC_deg_prof(initial_stabilizer, degrade_time_in_hours)

    # Solve the system
    model.solve()
    
    time_points = model.sol.t
    concentrations = model.sol.y
        
    # Define concentration labels
    labels = ["PVC", "R_N_H", "Cl_rad", "R_N_OH", "R_N_O_R", "R_NO_rad", "R_rad", "R_OO_rad"]
        
    # Plot each concentration based on the args
    for index, label in enumerate(labels):
        if args.get(label, False):
            plt.plot(time_points, concentrations[index], label=label)
        
    plt.xlabel('Time (seconds)')
    plt.ylabel('Concentration')
    plt.title('Concentration vs Time')
    plt.legend()
    plt.show()
