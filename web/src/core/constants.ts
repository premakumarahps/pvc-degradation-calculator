/**
 * Constants and chemical species definitions for the PVC Photodegradation and HALS Stabilization Model.
 * Synthesized from University Research: "Optimizing UV Stabilization in PVC using HALS"
 * University of Moratuwa - MT2230 Kinetics of Materials
 * Group 1 | Premakumara H.P.S. (Sadun)
 */

export interface SpeciesMeta {
  key: string;
  name: string;
  formula: string;
  role: string;
  color: string;
  bgLight: string;
  description: string;
}

export const SPECIES_METADATA: Record<string, SpeciesMeta> = {
  PVC: {
    key: "PVC",
    name: "PVC Polymer Matrix",
    formula: "[-CH2-CHCl-]n",
    role: "Target Substrate",
    color: "#0284c7", // Sky blue
    bgLight: "rgba(2, 132, 199, 0.1)",
    description: "Normalized polyvinyl chloride polymer matrix concentration. Target threshold is ≥ 80% (0.80)."
  },
  R_N_H: {
    key: "R_N_H",
    name: "Active HALS [>NH]",
    formula: "Tinuvin 770 (>NH)",
    role: "Free Radical Scavenger",
    color: "#059669", // Emerald green
    bgLight: "rgba(5, 150, 105, 0.1)",
    description: "Active Hindered Amine Light Stabilizer (Tinuvin 770) available for radical interception."
  },
  Cl_rad: {
    key: "Cl_rad",
    name: "Chlorine Radical [Cl•]",
    formula: "Cl•",
    role: "Photolysis Radical",
    color: "#d97706", // Amber
    bgLight: "rgba(217, 119, 6, 0.1)",
    description: "Aggressive chlorine radical generated from homolytic C-Cl bond cleavage under UV radiation."
  },
  R_N_OH: {
    key: "R_N_OH",
    name: "Hydroxylamine [>N-OH]",
    formula: ">N-OH",
    role: "Key Intermediate",
    color: "#7c3aed", // Violet
    bgLight: "rgba(124, 58, 237, 0.1)",
    description: "Intermediate hydroxylamine generated when >NH reacts with peroxy radicals in Step 1 of the Denisov cycle."
  },
  R_N_O_R: {
    key: "R_N_O_R",
    name: "Alkoxyamine [>N-O-R']",
    formula: ">N-O-R'",
    role: "Recombination Intermediate",
    color: "#db2777", // Pink
    bgLight: "rgba(219, 39, 119, 0.1)",
    description: "Intermediate formed by the ultra-fast trapping of polymer alkyl radicals by nitroxyl radicals (k3)."
  },
  R_NO_rad: {
    key: "R_NO_rad",
    name: "Nitroxyl Radical [>NO•]",
    formula: ">NO•",
    role: "Catalytic Cycle Driver",
    color: "#0891b2", // Cyan
    bgLight: "rgba(8, 145, 178, 0.1)",
    description: "Stable nitroxyl radical driving the catalytic Denisov regeneration cycle without being consumed."
  },
  R_rad: {
    key: "R_rad",
    name: "Polymer Alkyl Radical [R'•]",
    formula: "R'• (~CH2-C•H~)",
    role: "Degradation Intermediate",
    color: "#dc2626", // Red
    bgLight: "rgba(220, 38, 38, 0.1)",
    description: "Carbon-centered radical created upon chlorine ejection, initiating rapid photo-oxidation."
  },
  R_OO_rad: {
    key: "R_OO_rad",
    name: "Peroxy Radical [R'OO•]",
    formula: "R'OO•",
    role: "Oxidative Chain Carrier",
    color: "#ea580c", // Orange
    bgLight: "rgba(234, 88, 12, 0.1)",
    description: "Highly damaging peroxy radical formed by rapid oxygen addition to alkyl radicals."
  }
};

export const SPECIES_KEYS = Object.keys(SPECIES_METADATA);

// Default reaction rate constants [k1..k9]
export const DEFAULT_RATE_CONSTANTS: number[] = [
  51.0,     // k1: R'OO• + >NH -> >N-OH + ketone (51 M⁻¹s⁻¹)
  550.0,    // k2: R'OO• + >N-OH -> >NO• + hydroperoxide (5.5e2 M⁻¹s⁻¹)
  1.2e9,    // k3: >NO• + R'• -> >N-O-R' (1.2e9 M⁻¹s⁻¹)
  1.9e-3,   // k4: >N-O-R' + R'OO• -> >NO• + products (1.9e-3 M⁻¹s⁻¹)
  9.3e-5,   // k5: >N-O-R' -> >NH + olefin (9.3e-5 s⁻¹)
  1.0e-6,   // k6: PVC + hv -> R'• + Cl• (photolytic initiation ~ 1.0e-6 s⁻¹)
  1.0e8,    // k7: R'• + O2 -> R'OO• (fast oxygen addition 1.0e8 M⁻¹s⁻¹)
  0.5,      // k8: R'OO• + PVC -> R'• + hydroperoxide (0.5 M⁻¹s⁻¹)
  0.1       // k9: Cl• + PVC -> R'• + HCl (propagation by Cl• 0.1 M⁻¹s⁻¹)
];

// University project empirical model parameters
export const OUTDOOR_HOURS_SCALING_FACTOR = 2800.0;
export const STABILIZER_WT_MULTIPLIER = 4.0;
export const DEFAULT_TARGET_PVC_RETENTION = 0.80; // 80% critical threshold
export const DEFAULT_MAX_STABILIZER_CONC = 0.20;

// Arrhenius & Acceleration Factor Parameters
export const ARRHENIUS_CONSTANTS = {
  activationEnergyJ: 230000, // 230 kJ/mol
  universalGasR: 8.314, // J/(mol·K)
  tLabCelsius: 50.0,
  tEnvCelsius: 25.0,
  iLabWm2: 0.76,
  iEnvWm2: 1.33,
  calculatedAF: 700.0
};
