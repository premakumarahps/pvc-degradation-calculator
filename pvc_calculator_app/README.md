# PVC Photodegradation Kinetics & HALS Formulation Optimizer

> **University Academic Research Project · Group 1**  
> *Developed by PREMAKUMARA H.P.S.*

A scientific desktop application and chemical kinetics simulation suite designed to predict Poly(vinyl chloride) (PVC) degradation under accelerated UV radiation and determine the optimal concentration of Hindered Amine Light Stabilizer (HALS, Tinuvin 770) required for outdoor polymer durability.

---

## 🔬 Scientific Background & Modeling

Polyvinyl Chloride (PVC) undergoes rapid deterioration upon outdoor solar UV exposure through photo-initiated dehydrochlorination ($HCl$ elimination) and free-radical auto-oxidation:

$$\text{PVC} + h\nu \xrightarrow{k_6} \text{R}^\bullet + \text{Cl}^\bullet$$

Consecutive loss of $HCl$ generates conjugated polyene chromophores ($-(CH=CH)_n-$) that cause severe yellow-brown discoloration, micro-cracking, and mechanical embrittlement.

### The Denisov Regenerative Cycle (HALS Protection)

Hindered Amine Light Stabilizers (HALS) such as **Tinuvin 770** (Bis(2,2,6,6-tetramethyl-4-piperidyl) sebacate) protect PVC not through passive UV absorption, but by dynamically scavenging reactive radical intermediates via the regenerative **Denisov Cycle**:

1. **Peroxy Radical Trapping**: Active amine groups ($>NH$) react with degradative peroxy radicals ($ROO^\bullet$) to produce hydroxylamines ($>N\text{-}OH$).
2. **Polymer Alkyl Radical Scavenging**: Catalytic nitroxyl radicals ($>NO^\bullet$) rapidly intercept polymer radicals ($R^\bullet$) at near diffusion-controlled rates ($k_3 = 1.2 \times 10^9\ \text{M}^{-1}\text{s}^{-1}$), forming alkoxyamines ($>N\text{-}O\text{-}R$).
3. **Catalytic Regeneration**: Alkoxyamines react with further peroxy radicals or undergo thermal cleavage to regenerate $>NO^\bullet$, enabling a single stabilizer molecule to quench multiple radical chains.

### 8 Coupled Stiff Ordinary Differential Equations (ODEs)

The chemical kinetics are governed by an 8-species stiff ODE system solved via the **Backward Differentiation Formula (BDF)** method:

```
d[PVC]/dt    = - k6*[PVC] - k8*[PVC]*[ROO*] - k9*[Cl*]*[PVC]
d[>NH]/dt    = - k1*[ROO*]*[>NH]
d[Cl*]/dt    =   k6*[PVC] + k8*[PVC]*[ROO*]
d[>N-OH]/dt  =   k1*[ROO*]*[>NH] + k5*[>NOR] - k2*[>N-OH]*[ROO*]
d[>NOR]/dt   =   k3*[>NO*]*[R*] - k5*[>NOR] - k4*[>NOR]*[ROO*]
d[>NO*]/dt   =   k4*[>NOR]*[ROO*] + k2*[ROO*]*[>N-OH] - k3*[R*]*[>NO*]
d[R*]/dt     =   k6*[PVC] - k7*[R*] - k3*[R*]*[>NO*]
d[ROO*]/dt   =   k7*[R*] - k8*[ROO*]*[PVC] - k1*[ROO*]*[>NH] - k2*[ROO*]*[>N-OH] - k4*[>NOR]*[ROO*]
```

#### Rate Constants Table
| Rate Constant | Value | Chemical Mechanism |
| :--- | :--- | :--- |
| **$k_1$** | $51.0\ \text{M}^{-1}\text{s}^{-1}$ | $ROO^\bullet + {>}NH \rightarrow {>}NOH + \text{products}$ |
| **$k_2$** | $550.0\ \text{M}^{-1}\text{s}^{-1}$ | $ROO^\bullet + {>}NOH \rightarrow {>}NO^\bullet + ROOH$ |
| **$k_3$** | $1.2 \times 10^{9}\ \text{M}^{-1}\text{s}^{-1}$ | ${>}NO^\bullet + R^\bullet \rightarrow {>}NOR$ (Alkyl Radical Termination) |
| **$k_4$** | $1.9 \times 10^{-3}\ \text{M}^{-1}\text{s}^{-1}$ | ${>}NOR + ROO^\bullet \rightarrow {>}NO^\bullet + ROOR$ |
| **$k_5$** | $9.3 \times 10^{-5}\ \text{s}^{-1}$ | ${>}NOR \rightarrow {>}NOH + \text{alkene}$ (Thermal Cleavage) |
| **$k_6$** | $1.0 \times 10^{-6}\ \text{s}^{-1}$ | $\text{PVC} + h\nu \rightarrow R^\bullet + Cl^\bullet$ (Photolytic Initiation) |
| **$k_7$** | $1.0 \times 10^{8}\ \text{M}^{-1}\text{s}^{-1}$ | $R^\bullet + O_2 \rightarrow ROO^\bullet$ (Rapid Oxygen Addition) |
| **$k_8$** | $0.5\ \text{M}^{-1}\text{s}^{-1}$ | $ROO^\bullet + \text{PVC} \rightarrow R^\bullet + Cl^\bullet$ (Chain Propagation) |
| **$k_9$** | $0.1\ \text{M}^{-1}\text{s}^{-1}$ | $Cl^\bullet + \text{PVC} \rightarrow R^\bullet + HCl$ (Autocatalysis) |

---

## 💻 Application Features

### 1. ⚡ Formulation Optimizer
- Enter desired outdoor weathering lifespan (e.g. 500, 1000, 1500, 2000 hours).
- Solves minimum effective Tinuvin 770 concentration using binary search numerical optimization.
- Displays recommended weight percentage (`wt.%`), industrial compounding ratio ($g/\text{kg PVC}$), residual polymer integrity, and status indicator.

### 2. 📈 Interactive Kinetics Plotter
- Embedded dark-mode Matplotlib canvas with zoom, pan, and home tools.
- Real-time graphing of all 8 kinetic species:
  - $[PVC]$ (Polymer matrix)
  - $[{>}NH]$ (Active Tinuvin 770)
  - $[Cl^\bullet]$ (Chlorine radical)
  - $[{>}N\text{-}OH]$ (Hydroxylamine intermediate)
  - $[{>}N\text{-}O\text{-}R]$ (Alkoxyamine intermediate)
  - $[{>}NO^\bullet]$ (Nitroxyl radical)
  - $[R^\bullet]$ (Polymer alkyl radical)
  - $[ROO^\bullet]$ (Polymer peroxy radical)
- Export high-resolution publication-ready figures (`.PNG`, `.PDF`, `.SVG`).

### 3. 📊 Batch Sensitivity Analysis
- Simulates polymer integrity over a continuous spectrum of stabilizer concentrations.
- Multi-threaded background execution with progress tracking (zero UI freeze).
- Export complete analytical datasets to formatted Excel spreadsheets (`.xlsx`) with metadata or CSV files.

### 4. 📖 Integrated Theory & Equation Guide
- Embedded HTML documentation of literature citations, polymer degradation pathways, and Denisov reaction cycles.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9, 3.10, 3.11, 3.12, 3.13, or 3.14

### Installation
Clone or download this folder, then install the dependencies:
```bash
pip install -r requirements.txt
```

### Launching the Graphical User Interface (GUI)
* **On Windows**: Double-click `run.bat` or run:
  ```bash
  python main.py
  ```

### Running via Command-Line (CLI)
You can also run calculations directly from your terminal:
```bash
# Calculate optimum stabilizer for 1500 outdoor hours
python main.py --cli --hours 1500

# Run a batch sensitivity analysis and export to Excel
python main.py --batch degradation_analysis.xlsx --hours 1500 --samples 100
```

---

## 📦 Building a Standalone Windows Executable (.exe)

To build a standalone executable that runs on any Windows PC without needing Python installed:
1. Double-click `build_exe.bat` or run:
   ```bash
   pip install pyinstaller
   pyinstaller --onedir --windowed --name "PVC_Degradation_Optimizer" --icon "gui/assets/calculator_icon.png" --add-data "gui/assets;gui/assets" main.py
   ```
2. The executable will be generated inside:
   `dist\PVC_Degradation_Optimizer\PVC_Degradation_Optimizer.exe`

---

## 📚 References
1. Andrady, A. L., Hamid, S. A., & Lambert, M. P. (2005). Effects of sunlight on polymers: degradation and stabilization. *Handbook of Material Weathering*.
2. Ohkatsu, Y. (2008). Search for Unified Action Mechanism of Hindered Amine Light Stabilizers. *J. Jpn. Pet. Inst.*, 51(4), 191-204.
3. Asua, J. M., Lezcano, P. M., & Marco, C. (2002). Kinetic modeling of the photostabilization of PVC by HALS. *Polymer Degradation and Stability*, 75(2), 225-239.
4. Singh, B., Byrne, F., & Morrison, M. (2017). Degradation of polyvinyl chloride (PVC) formulations: A review. *Polymer Degradation and Stability*, 138, 115-124.
