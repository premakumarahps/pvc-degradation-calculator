import numpy as np
from scipy.optimize import fsolve

def find_roots(func, initial_guesses):
    """
    Find roots of the given function using initial guesses.
    
    Parameters:
    func (callable): The function for which to find the roots.
    initial_guesses (array-like): Initial guesses for the roots.
    
    Returns:
    list: List of roots.
    """
    roots = []
    for guess in initial_guesses:
        try:
            # Use fsolve to find a root starting from the initial guess
            root_solution = fsolve(func, guess)
            # Add the root to the list if it's not already present (within a tolerance)
            if not any(np.isclose(root_solution, r, atol=1e-8) for r in roots):
                roots.append(root_solution[0])
        except Exception as e:
            # Handle any errors that may occur during root finding
            print(f"Error finding root near {guess}: {e}")
    return roots

# Example usage
def example_func(x):
    return x**5-4*x**4+8*x-76  # Roots at x = 1, 2, 3

initial_guesses = np.linspace(-10, 10, 100)  # Initial guesses
roots = find_roots(example_func, initial_guesses)
print("Roots:", roots)
