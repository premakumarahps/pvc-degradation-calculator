# 3_PVC_Degradation_Calculator

> **Polyvinyl Chloride (PVC) Photodegradation Kinetics & HALS Formulation Optimizer**  
> *Academic University Research Project · Group 1*  
> *Author: PREMAKUMARA H.P.S.*

This repository contains the complete research, chemical kinetics modeling, standalone desktop software application, and future interactive web platform for predicting UV-induced PVC degradation and calculating optimal concentrations of Hindered Amine Light Stabilizers (HALS Tinuvin 770).

---

## 📁 Repository Structure

```
3_PVC_Degradation_Calculator/
│
├── pvc_calculator_app/                # Modernized Standalone Desktop Application Suite
│   ├── core/                          # Stiff ODE numerical solver & kinetics engines
│   │   ├── constants.py               # Rate constants (k1..k9), species metadata, empirical scaling
│   │   ├── kinetics.py                # 8-species coupled ODE model (SciPy BDF solver)
│   │   ├── optimizer.py               # Binary search numerical formulation optimizer
│   │   └── analyzer.py                # Batch sensitivity simulation & Excel exporter
│   ├── gui/                           # High-DPI PyQt6 graphical user interface
│   │   ├── assets/                    # High-resolution icons & graphics
│   │   ├── tabs/                      # Optimizer, Plotter, Batch Sensitivity, Theory tabs
│   │   ├── theme.py                   # Scientific modern dark theme
│   │   └── main_window.py             # Unified multi-tab application window
│   ├── main.py                        # Entrypoint supporting both GUI and CLI modes
│   ├── run.bat                        # Double-click launcher for Windows
│   ├── build_exe.bat                  # One-click PyInstaller standalone .exe compiler
│   ├── requirements.txt               # Python package dependencies
│   └── README.md                      # Desktop application user guide
│
├── research_and_documentation/        # Categorized Academic Research Archive
│   ├── reports_and_manuscripts/       # University Project Report, manuscripts, research drafts
│   ├── literature_papers/             # Peer-reviewed journal publications on HALS & PVC
│   ├── datasheets/                    # Technical data sheets (Tinuvin 770 & Tinuvin P)
│   │   ├── tinuvin_770/               # TDS, SDS, and technical bulletins
│   │   └── tinuvin_P/                 # Benzotriazole UV absorber datasheets
│   ├── kinetic_derivations/           # Analytical derivations & reaction mechanism notes
│   └── legacy_software_v1/            # Original 2024 university Python scripts & UI files
│
├── PVC_Degradation_Calculator_Desktop_Suite.zip # Downloadable package for offline users
└── .gitignore                         # Configured for Python, Web, and Vercel artifacts
```

---

## ⚡ Quick Start: Running the Desktop Application

### Option A: Direct Python Launch
1. Ensure Python 3.9+ is installed.
2. Install dependencies:
   ```bash
   cd pvc_calculator_app
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   # Launch GUI
   python main.py

   # Or run via CLI
   python main.py --cli --hours 1500
   ```

### Option B: Double-Click Launcher (Windows)
Double-click `pvc_calculator_app/run.bat`.

### Option C: Standalone Windows Executable (.exe)
Double-click `pvc_calculator_app/build_exe.bat` to compile a standalone executable that runs without requiring Python to be installed.

---

## 🔬 Scientific Highlights
* **Degradation System**: Rigid PVC matrix undergoing photolytic dehydrochlorination ($HCl$ loss, conjugated polyenes) and photo-oxidation.
* **Stabilizer Mechanism**: Hindered Amine Light Stabilizer (Tinuvin 770) acting via the catalytic, regenerative **Denisov Cycle** ($>NH \rightarrow >NO^\bullet \rightarrow >NOR \rightarrow >NO^\bullet$).
* **Numerical Method**: Stiff system of 8 coupled nonlinear ODEs solved using the Backward Differentiation Formula (BDF).
