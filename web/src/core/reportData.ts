/**
 * Complete Structured Scientific Data extracted from the 36-page University Project Report,
 * 20 Presentation Slides, and Semester 4 Portfolio.
 * University of Moratuwa - Department of Materials Science & Engineering
 */

export interface TeamMember {
  index: string;
  name: string;
  shortName?: string;
  role?: string;
  isLeadAuthor?: boolean;
  isGroupLead?: boolean;
}

export interface ReportChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  summary: string;
  highlights: string[];
  equations?: { title: string; latex: string; explanation: string }[];
  figures?: { id: string; caption: string; description: string; type: string }[];
  content: string[];
}

export interface SlideItem {
  slideNumber: number;
  title: string;
  category: string;
  bullets: string[];
  takeaway: string;
}

export const PROJECT_METADATA = {
  title: "Optimizing UV Stabilization in PVC using HALS",
  subtitle: "Computational Kinetics Modeling, Denisov Cycle Simulation & Predictive Stabilization Software",
  academicModule: "MT2230 - Kinetics of Materials",
  institution: "Department of Materials Science & Engineering, University of Moratuwa",
  leadStudent: {
    name: "Sadun Premakumara (Premakumara H.P.S.)",
    role: "Python Software Developer (Degradation Calculator) & Kinetics Analyst",
    portfolioUrl: "https://github.com/premakumarahps"
  },
  groupNumber: "Group 1",
  marketSize2023: "$82.52 Billion",
  marketSize2030: "$110.00 Billion",
  cagr: "2.95%",
  activationEnergy: "230 kJ/mol",
  accelerationFactor: "~700x (Lab ASTM G154 to Outdoor Environment)"
};

export const TEAM_MEMBERS: TeamMember[] = [
  { index: "210494D", name: "PREMAKUMARA H.P.S. (Sadun)", shortName: "PREMAKUMARA", role: "Software Developer & Kinetics Analyst", isLeadAuthor: true },
  { index: "210042R", name: "ANJANA E.A.O.", shortName: "ANJANA", role: "Materials Characterization & FTIR Review" },
  { index: "210061A", name: "BANDARA H.M.K.D.", shortName: "BANDARA", role: "Polymer Degradation Chemistry" },
  { index: "210070B", name: "BIBULEWELA P.A.C.", shortName: "BIBULEWELA", role: "Additive Formulation & Literature" },
  { index: "210281X", name: "KAUSHIKA K.K.G.", shortName: "KAUSHIKA", role: "Mechanical Testing Analysis" },
  { index: "210347G", name: "MADHUBHASHINEE H.A.W.R.", shortName: "MADHUBHASHINEE", role: "Thermal Kinetics & TGA Data" },
  { index: "210381E", name: "MAYOORATHAN K.", shortName: "MAYOORATHAN", role: "Reaction Kinetics & Rate Equations" },
  { index: "210640A", name: "THEMIYA K.L.", shortName: "THEMIYA (Lead)", role: "Group Lead • UV Weathering Simulation & Standards", isGroupLead: true },
  { index: "210722D", name: "WIJESOORIYA W.A.A.D.", shortName: "WIJESOORIYA", role: "Documentation & Technical Reporting" }
];

export const EXPERIMENTAL_DATASETS = {
  tensileStrength: {
    title: "Tensile Strength Degradation under UV Exposure (Graph 02)",
    unit: "N/mm² (MPa)",
    samples: [
      { timeHours: 0, label: "Reference", value: 52.0, error: 0.2 },
      { timeHours: 24, label: "24 Hours", value: 51.7, error: 0.15 },
      { timeHours: 48, label: "48 Hours", value: 51.5, error: 0.15 },
      { timeHours: 72, label: "72 Hours", value: 51.2, error: 0.18 },
      { timeHours: 96, label: "96 Hours", value: 50.8, error: 0.12 },
      { timeHours: 120, label: "120 Hours", value: 50.7, error: 0.14 },
      { timeHours: 144, label: "144 Hours", value: 50.6, error: 0.10 },
      { timeHours: 168, label: "168 Hours", value: 50.4, error: 0.11 }
    ],
    insight: "Gradual reduction in tensile strength is caused by homolytic main-chain scission, which decreases polymer molecular weight and chain stiffness."
  },
  elongationAtBreak: {
    title: "Elongation at Break Retention (%) (Graph 03)",
    unit: "%",
    samples: [
      { timeHours: 0, label: "Reference", value: 88.8 },
      { timeHours: 24, label: "24 Hours", value: 88.5 },
      { timeHours: 48, label: "48 Hours", value: 87.9 },
      { timeHours: 72, label: "72 Hours", value: 87.4 },
      { timeHours: 96, label: "96 Hours", value: 86.9 },
      { timeHours: 120, label: "120 Hours", value: 86.4 },
      { timeHours: 144, label: "144 Hours", value: 85.9 },
      { timeHours: 168, label: "168 Hours", value: 85.3 }
    ],
    insight: "Elongation reduces steadily from 88.8% to 85.3% due to chain cleavage and cross-linking in the surface layers."
  },
  hardnessShoreD: {
    title: "Surface Hardness (Shore D) Evolution (Graph 04)",
    unit: "Shore D",
    samples: [
      { timeHours: 0, label: "Reference", value: 81.6 },
      { timeHours: 24, label: "24 Hours", value: 81.6 },
      { timeHours: 48, label: "48 Hours", value: 81.4 },
      { timeHours: 72, label: "72 Hours", value: 80.8 },
      { timeHours: 96, label: "96 Hours", value: 80.4 },
      { timeHours: 120, label: "120 Hours", value: 80.0 },
      { timeHours: 144, label: "144 Hours", value: 79.6 },
      { timeHours: 168, label: "168 Hours", value: 79.3 }
    ],
    insight: "Surface softening occurs as micro-cracks develop and low-molecular fragments migrate to the surface."
  },
  weightLossComparison: {
    title: "Polymer Weight Loss (%) Under Irradiation (Graph 07)",
    unit: "% weight loss",
    timeDays: [0, 20, 40, 60, 80, 100],
    curves: [
      { name: "PVC (Blank / No Stabilizer)", color: "#ef4444", values: [0.0, 0.7, 1.35, 2.3, 3.3, 5.2] },
      { name: "PVC + Ph3SnL", color: "#f97316", values: [0.0, 0.55, 1.3, 2.1, 2.9, 4.0] },
      { name: "PVC + Bu2SnL2", color: "#8b5cf6", values: [0.0, 0.45, 1.2, 1.95, 2.45, 3.45] },
      { name: "PVC + Me2SnL2 (Optimized Organotin)", color: "#10b981", values: [0.0, 0.4, 0.98, 1.65, 2.2, 3.25] }
    ],
    insight: "Unstabilized PVC loses over 5.2% of total mass after 100 days due to volatile HCl degassing and fragment loss, while stabilized systems suppress loss by up to 40%."
  }
};

export const REPORT_CHAPTERS: ReportChapter[] = [
  {
    id: "abstract-intro",
    number: "1.0",
    title: "Introduction & Global Market Relevance",
    subtitle: "The Challenge of Outdoor PVC Weathering",
    summary: "Polyvinyl Chloride is a versatile thermoplastic valued at $82.52B in 2023. Under solar UV radiation, homolytic C-Cl cleavage triggers severe dehydrochlorination, loss of tensile strength, and discoloration.",
    highlights: [
      "Global PVC market expanding to $110B by 2030 at 2.95% CAGR.",
      "UV-B radiation (280–320 nm) matches C-Cl bond dissociation energies.",
      "Dehydrochlorination generates corrosive HCl and chromophoric polyene sequences."
    ],
    content: [
      "Polyvinyl Chloride (PVC) is one of the most widely manufactured thermoplastics worldwide, essential for municipal water supply pipes, exterior architectural cladding, window profiles, and automotive trims.",
      "However, when exposed to solar UV radiation, PVC absorbs photons in the UV-B spectrum (280–320 nm). Although pure PVC theoretically has poor absorption above 250 nm, structural imperfections—such as allylic chlorides, internal double bonds, catalyst residues, and hydroperoxides—act as intense chromophores.",
      "These defects trigger homolytic cleavage of the labile C-Cl bond, ebullating free chlorine radicals (Cl•) and leaving carbon-centered polyenyl radicals (R'•). The ensuing cascade releases gaseous hydrogen chloride (HCl) in a progressive 'zipper-like' elimination reaction."
    ],
    equations: [
      {
        title: "Planck-Einstein UV Photon Cleavage Relation",
        latex: "E_{photon} = h\\nu = \\frac{hc}{\\lambda} \\ge E_{C-Cl} \\approx 327\\ \\text{kJ/mol}",
        explanation: "UV-B photons (λ ≤ 365 nm) possess sufficient quantum energy to cause homolytic dissociation of defective C-Cl bonds."
      },
      {
        title: "Quantum Yield of Photodehydrochlorination",
        latex: "\\Phi_{\\text{HCl}} = \\frac{\\text{Moles of HCl Released}}{\\text{Moles of UV Photons Absorbed}} > 10",
        explanation: "Quantifies zip-chain length; uninhibited PVC exhibits cascading catalytic unzipping yielding tens of HCl molecules per photon."
      }
    ]
  },
  {
    id: "unstabilized-mechanisms",
    number: "2.0",
    title: "Photodegradation Mechanics (Without Stabilizer)",
    subtitle: "Free Radical Cascades, Auto-Oxidation & Chain Scission",
    summary: "In the absence of stabilizers, polymer alkyl radicals rapidly react with atmospheric oxygen to form peroxyl radicals (R'OO•), causing catastrophic chain dehydrochlorination.",
    highlights: [
      "Homolytic cleavage: PVC + hv -> R'• + Cl• (Reaction k6 = 1.0e-6 s⁻¹)",
      "Instantaneous oxygen trapping: R'• + O2 -> R'OO• (Reaction k7 = 1.0e8 M⁻¹s⁻¹)",
      "Chain dehydrochlorination releases HCl and generates conjugated double bonds."
    ],
    equations: [
      {
        title: "PVC Matrix Depletion (Without Stabilizer)",
        latex: "\\frac{d[PVC]}{dt} = -k_6[PVC] - k_8[PVC][R'OO^\\bullet] - k_9[Cl^\\bullet][PVC]",
        explanation: "PVC is consumed by primary photolytic initiation (k6), hydrogen abstraction by peroxy radicals (k8), and autocatalytic attack by chlorine radicals (k9)."
      },
      {
        title: "Alkyl Radical Dynamics",
        latex: "\\frac{d[R'^\\bullet]}{dt} = k_6[PVC] - k_7[R'^\\bullet]",
        explanation: "Polymer alkyl radicals are produced photolytically and trapped immediately by ambient dissolved oxygen."
      },
      {
        title: "Peroxy Radical Propagation",
        latex: "\\frac{d[R'OO^\\bullet]}{dt} = k_7[R'^\\bullet] - k_8[R'OO^\\bullet][PVC]",
        explanation: "Peroxy radicals rapidly abstract hydrogen from adjacent PVC units, sustaining the degradative chain."
      },
      {
        title: "Chlorine Radical Evolution",
        latex: "\\frac{d[Cl^\\bullet]}{dt} = k_6[PVC] + k_8[PVC][R'OO^\\bullet] - k_{10}[Cl^\\bullet]^2",
        explanation: "Free chlorine radicals propagate zip-elimination to generate HCl until terminating by recombination."
      }
    ],
    content: [
      "Without stabilization, every single photon absorption event initiates a chain reaction that can destroy hundreds of vinyl chloride monomer units.",
      "As hydrogen chloride is stripped from the backbone, conjugated polyene sequences (-CH=CH-)n are formed. As n increases past 7, absorption shifts from UV into the visible blue spectrum, causing the plastic to turn yellow, brown, and eventually charred black.",
      "Simultaneously, tertiary alkyl radicals cause random chain scission (reducing tensile elongation) and cross-linking between adjacent polymer coils, rendering the PVC brittle, prone to stress cracking, and structurally compromised."
    ]
  },
  {
    id: "hals-stabilization",
    number: "3.0",
    title: "HALS Stabilization & The Denisov Cycle",
    subtitle: "Regenerative Free Radical Scavenging via Tinuvin 770",
    summary: "Hindered Amine Light Stabilizers (HALS) like Tinuvin 770 do not merely absorb UV light; they scavenge radicals catalytically in a closed regeneration loop discovered by E.T. Denisov.",
    highlights: [
      "Secondary amine (>NH) reacts with peroxy radicals to form hydroxylamine (>N-OH).",
      "Nitroxyl radical (>NO•) traps alkyl radicals (R'•) with diffusion-controlled speed (k3 = 1.2e9 M⁻¹s⁻¹).",
      "Alkoxyamine (>N-O-R') regenerates active >NO• and >NH, providing persistent long-term protection."
    ],
    equations: [
      {
        title: "Denisov Step 1: Hydroxylamine Formation",
        latex: ">\\!\\text{NH} + R'OO^\\bullet \\xrightarrow{k_1} >\\!\\text{N-OH} + \\text{Ketone}",
        explanation: "Active HALS scavenges harmful peroxy radicals, mitigating photo-oxidation."
      },
      {
        title: "Denisov Step 2: Nitroxyl Radical Formation",
        latex: ">\\!\\text{N-OH} + R'OO^\\bullet \\xrightarrow{k_2} >\\!\\text{NO}^\\bullet + R'OOH",
        explanation: "Hydroxylamine oxidizes to form the persistent, catalytic nitroxyl radical."
      },
      {
        title: "Denisov Step 3: Diffusion-Controlled Alkyl Trapping",
        latex: ">\\!\\text{NO}^\\bullet + R'^\\bullet \\xrightarrow{k_3} >\\!\\text{N-O-R'}",
        explanation: "Nitroxyl radical terminates polymer alkyl radicals at diffusion rates (k3 = 1.2 × 10⁹ M⁻¹s⁻¹)."
      },
      {
        title: "Denisov Step 4 & 5: Catalytic Regeneration",
        latex: ">\\!\\text{N-O-R'} \\xrightarrow{k_5} >\\!\\text{NH} + \\text{Olefin} \\quad \\big| \\quad >\\!\\text{N-O-R'} + R'OO^\\bullet \\xrightarrow{k_4} >\\!\\text{NO}^\\bullet + \\text{Products}",
        explanation: "Thermal and radical cleavage regenerates >NH and >NO•, allowing one HALS molecule to neutralize dozens of radicals."
      }
    ],
    content: [
      "Traditional UV absorbers act as sacrificial shields: they absorb UV photons and dissipate the energy as heat, but slowly degrade over time.",
      "Tinuvin 770 (Bis(2,2,6,6-tetramethyl-4-piperidyl) sebacate) functions through a superior mechanism known as the Denisov Cycle.",
      "Because the nitroxyl radical (>NO•) is regenerated during the termination of alkoxyamines, a single HALS molecule can deactivate up to 100 free radicals before being irreversibly consumed. This enables durable, low-concentration stabilization (0.1–0.5 wt.%)."
    ]
  },
  {
    id: "acceleration-modeling",
    number: "4.0",
    title: "Accelerated Testing & Arrhenius Modeling",
    subtitle: "Linking ASTM G154 Lab Chambers to Real-World Outdoor Exposure",
    summary: "The project determined rate constants under ASTM G154 accelerated conditions (50°C, 0.76 W/m²). Using the Arrhenius equation with activation energy Ea = 230 kJ/mol, an Acceleration Factor AF ≈ 700 correlates lab hours to real-world years.",
    highlights: [
      "Arrhenius equation: k = A · exp(-Ea / RT)",
      "Temperature factor: AFT = exp[(Ea/R) · (1/T_env - 1/T_lab)]",
      "Combined Acceleration Factor: AF = AFT · AFI ≈ 700",
      "100 hours in laboratory chamber ≈ 70,000 hours (~8 years) in field conditions."
    ],
    equations: [
      {
        title: "Arrhenius Temperature Acceleration Factor",
        latex: "AF_T = \\exp\\left[\\frac{E_a}{R}\\left(\\frac{1}{T_{env}} - \\frac{1}{T_{lab}}\\right)\\right]",
        explanation: "With Ea = 230 kJ/mol, R = 8.314 J/mol·K, T_env = 298.15 K, and T_lab = 323.15 K."
      },
      {
        title: "Light Intensity Acceleration Factor",
        latex: "AF_I = \\frac{I_{lab}}{I_{env}} = \\frac{0.76\\ \\text{W/m}^2}{1.33\\ \\text{W/m}^2} \\approx 0.57",
        explanation: "Ratio of UV chamber lamp flux to peak tropical sunlight irradiance."
      },
      {
        title: "Total Accelerated Weathering Transformation",
        latex: "t_{env} = t_{lab} \\times AF \\approx t_{lab} \\times 700",
        explanation: "Equivalent environmental outdoor exposure time based on accelerated chamber hours."
      }
    ],
    content: [
      "To obtain actionable industrial lifespan data within academic time constraints, samples were exposed in an accelerated weathering chamber following ASTM G154 standards.",
      "The chamber maintained a controlled temperature of 50°C and a UV irradiance of 0.76 W/m² using fluorescent UVA-340 and UVB-313 lamps.",
      "By calculating the Arrhenius activation energy (Ea = 230 kJ/mol), the project established the combined acceleration factor AF ≈ 700. This mathematical bridge allows the software to predict decades of real-world outdoor performance."
    ]
  },
  {
    id: "experimental-validation",
    number: "5.0",
    title: "Material Characterization & Validation",
    subtitle: "FTIR, UV-Vis, Tensile, Shore D Hardness & TGA",
    summary: "Experimental results verified that HALS incorporation suppresses carbonyl build-up in FTIR, preserves tensile strength above 50 MPa, maintains Shore D hardness, and prevents mass loss.",
    highlights: [
      "FTIR spectroscopy verified minimal carbonyl (C=O) band growth in stabilized PVC.",
      "Tensile strength: Slow, controlled decline from 52.0 to 50.4 MPa over 168 hours.",
      "Elongation at break: Dropped from 88.8% to 85.3%, avoiding catastrophic embrittlement.",
      "TGA analysis: Mass loss suppressed by > 35% compared to blank unstabilized PVC."
    ],
    content: [
      "Samples removed at 24, 48, 72, 96, 120, 144, and 168 hours were subjected to standardized mechanical and spectroscopic characterization.",
      "FTIR spectra demonstrated that uninhibited PVC exhibits broad absorption bands at 1715–1735 cm⁻¹, corresponding to ketone and carboxylic acid carbonyl groups formed during oxidative scission. Stabilized formulations showed marked suppression of these peaks.",
      "Tensile and elongation tests proved that Tinuvin 770 prevented premature micro-crack coalescence, maintaining structural elasticity and impact resistance essential for construction pipes and fittings."
    ],
    equations: [
      {
        title: "FTIR Carbonyl Index (CI)",
        latex: "\\text{CI} = \\frac{A_{1720}}{A_{1428}}",
        explanation: "Ratio of photo-oxidative carbonyl (C=O) band at 1720 cm⁻¹ to the invariant structural reference C-H bending peak at 1428 cm⁻¹."
      },
      {
        title: "Tensile Strength Retention Ratio",
        latex: "\\text{Retention}_{\\sigma} = \\left( \\frac{\\sigma_t}{\\sigma_0} \\right) \\times 100\\%",
        explanation: "Monitors residual load-bearing capacity over weathering duration t, where baseline pristine PVC exhibits σ₀ = 52.0 MPa."
      },
      {
        title: "Elongation at Break Ductility Metric",
        latex: "\\text{Retention}_{\\varepsilon} = \\left( \\frac{\\varepsilon_t}{\\varepsilon_0} \\right) \\times 100\\%",
        explanation: "Quantifies preservation of ductile plastic flow (ε₀ = 88.8%), preventing catastrophic sudden brittle failure."
      }
    ]
  },
  {
    id: "industrial-recommendations",
    number: "6.0",
    title: "Engineering Optimization & Recommendations",
    subtitle: "Formulation Rules, Synergistic Co-Stabilizers & Depth Profiling",
    summary: "Industrial guidelines recommend 0.2–1.0 wt.% Tinuvin 770. For extreme environments, synergistic combinations with Benzophenone UV absorbers and hindered phenolic antioxidants are advised.",
    highlights: [
      "Optimal industrial range: 0.20 to 1.0 wt.% (failsafe warning at > 5.0 wt.%).",
      "Synergistic co-stabilization: HALS (radical scavenger) + Benzotriazoles (UV absorber).",
      "Beer-Lambert depth modeling: I(x) = I_0 · exp(-α x) for thick-walled PVC profiles.",
      "Environmental benefit: Quantifies HCl mitigation to satisfy RoHS and REACH standards."
    ],
    equations: [
      {
        title: "Beer-Lambert Law for UV Attenuation",
        latex: "I(x) = I_0 \\cdot e^{-\\alpha x}",
        explanation: "UV intensity decreases exponentially through the thickness of the PVC profile, concentrating degradation in the outermost 100–200 μm."
      },
      {
        title: "Compounding Ratio Conversion",
        latex: "\\text{Compounding Rate (g/kg)} = \\text{wt.\\%} \\times 10.0",
        explanation: "Direct formulation translation from research weight percentage to factory compounding extruder scales."
      }
    ],
    content: [
      "For commercial extrusion, exceeding 2.0 wt.% of Tinuvin 770 often leads to additive blooming (migration to the surface) without providing proportional durability gains.",
      "The algorithm identifies the optimal balance: adding sufficient HALS to maintain polymer retention above 80% throughout the product warranty period while avoiding excess material cost.",
      "Future enhancements include incorporating protective nanocomposites (e.g. TiO2 or ZnO nanoparticles) and applying multi-layer co-extrusion where high-concentration HALS is localized in an outer cap-stock layer."
    ]
  }
];

export const PRESENTATION_SLIDES: SlideItem[] = [
  {
    slideNumber: 1,
    title: "Title & University Identification",
    category: "Overview",
    bullets: [
      "Optimizing UV Stabilization in PVC using HALS",
      "University of Moratuwa - Department of Materials Science & Engineering",
      "Module MT2230 - Kinetics of Materials",
      "Group 1 | Sadun Premakumara - Lead Software Developer & Kinetics Analyst"
    ],
    takeaway: "Formal defense of the computational kinetics model and PVC degradation software."
  },
  {
    slideNumber: 2,
    title: "Introduction & Market Context",
    category: "Motivation",
    bullets: [
      "PVC is a durable, cost-effective thermoplastic widely used across infrastructure.",
      "Global PVC market valued at $82.52B (2023) -> projected to reach $110B by 2030 (CAGR 2.95%).",
      "Severe susceptibility to UV radiation causes discoloration, embrittlement, and failure."
    ],
    takeaway: "High economic stakes necessitate accurate mathematical prediction of PVC outdoor longevity."
  },
  {
    slideNumber: 3,
    title: "Project Objectives",
    category: "Scope",
    bullets: [
      "1. Develop a comprehensive kinetic model for PVC degradation under UV exposure.",
      "2. Integrate the action of HALS (Tinuvin 770) into the coupled differential equations.",
      "3. Create a user-friendly software tool for predicting optimal stabilizer concentration."
    ],
    takeaway: "Three clear deliverables spanning theoretical chemistry, numerical ODE modeling, and software deployment."
  },
  {
    slideNumber: 4,
    title: "Mechanisms of Photodegradation",
    category: "Fundamentals",
    bullets: [
      "UV Absorption in the UV-B spectrum (280–320 nm).",
      "Free Radical Formation via C-Cl homolysis.",
      "Chain Scission & Cross-Linking altering molecular weight.",
      "Photooxidation driven by atmospheric oxygen."
    ],
    takeaway: "Photodegradation is a multi-step radical chain reaction that must be halted early."
  },
  {
    slideNumber: 5,
    title: "Mechanistic Pathways in UV Degradation",
    category: "Chemistry",
    bullets: [
      "Formation of Polyene Radicals: ~CH2-CH(Cl)~ + hv -> ~CH2-C•H~ + Cl•",
      "Formation of Peroxy Radicals: ~CH2-C•H~ + O2 -> ~CH2-CH(OO•)~",
      "Reaction with adjacent PVC: ~CH2-CH(OO•)~ + PVC -> ~HC=CH~ + hydroperoxide"
    ],
    takeaway: "Radical propagation abstracts HCl and creates conjugated double bonds (-CH=CH-)n."
  },
  {
    slideNumber: 6,
    title: "Detrimental Effects on PVC Properties",
    category: "Failure Modes",
    bullets: [
      "Discoloration: Severe yellowing and browning from polyenes.",
      "Surface Cracking: Micro-fissures compromising barrier integrity.",
      "Loss of Mechanical Properties: Tensile drop, impact fragility.",
      "Surface Roughness: Additive leaching and dirt accumulation."
    ],
    takeaway: "Macro-level product failure directly stems from micro-level radical propagation."
  },
  {
    slideNumber: 7,
    title: "Role of Stabilizers",
    category: "Mitigation",
    bullets: [
      "UV Absorbers: Dissipate incident radiation into harmless heat.",
      "HALS (Tinuvin 770): Intercept and trap reactive radicals.",
      "Sterically hindered piperidine ring provides thermal and chemical stability."
    ],
    takeaway: "HALS provides superior efficiency over sacrificial absorbers due to catalytic regeneration."
  },
  {
    slideNumber: 8,
    title: "Experimental Data on PVC Degradation",
    category: "Testing",
    bullets: [
      "Accelerated Weathering Chamber: Controlled temperature (50°C) and UV lamps (0.76 W/m²).",
      "FTIR Spectroscopy: Quantifies carbonyl (C=O) oxidation peaks at 1720 cm⁻¹.",
      "UV-Vis Spectroscopy: Measures absorbance spectrum shifts."
    ],
    takeaway: "Empirical chamber testing yields the kinetic parameters required for the mathematical model."
  },
  {
    slideNumber: 9,
    title: "Rate Equations Without Stabilizers",
    category: "Mathematics",
    bullets: [
      "d[PVC]/dt = -k6[PVC] - k8[PVC][R'OO•] - k9[Cl•][PVC]",
      "d[R'•]/dt = k6[PVC] - k7[R'•]",
      "d[R'OO•]/dt = k7[R'•] - k8[R'OO•][PVC]",
      "d[Cl•]/dt = k6[PVC] + k8[PVC][R'OO•] - k10[Cl•]²"
    ],
    takeaway: "Four coupled equations model the rapid degradation cascade of bare PVC."
  },
  {
    slideNumber: 10,
    title: "Radical Scavenging & Regeneration of HALS",
    category: "The Denisov Cycle",
    bullets: [
      ">NH -> >N-OH via peroxy radical reaction.",
      ">N-OH -> >NO• (persistent nitroxyl radical).",
      ">NO• + R'• -> >N-O-R' (diffusion-controlled trapping at k3 = 1.2e9 M⁻¹s⁻¹).",
      "Regeneration of active species closes the catalytic loop."
    ],
    takeaway: "The cyclic mechanism enables a tiny amount of stabilizer to protect millions of polymer bonds."
  },
  {
    slideNumber: 11,
    title: "Rate Equations With Stabilizers (Part 1)",
    category: "Mathematics",
    bullets: [
      "d[PVC]/dt incorporates stabilizer inhibition kinetics.",
      "d[Cl•]/dt = k6[PVC] - k8[PVC][R'OO•]",
      "d[R-N-OH]/dt = k1[R'OO•][R-N-H] + k5[R-N(O-R')] - k2[R-N-OH][R'OO•]",
      "d[R-N(O-R')]/dt = k3[R-NO•][R'•] - k5[R-N(O-R')] - k4[R-N(O-R')][R'OO•]"
    ],
    takeaway: "Explicit mathematical accounting of all intermediate HALS states."
  },
  {
    slideNumber: 12,
    title: "Rate Equations With Stabilizers (Part 2)",
    category: "Mathematics",
    bullets: [
      "d[R-NO•]/dt = k4[R-N(O-R')][R'OO•] + k2[R'OO•][R-N-OH] - k3[R'•][R-NO•]",
      "d[R'•]/dt = k6[PVC] - k7[R'•] - k3[R'•][R-NO•]",
      "d[R'OO•]/dt = k7[R'•] - k8[R'OO•][PVC] - k1[R'OO•][R-N-H] - k2[R'OO•][R-N-OH] - k4[R-N(O-R')][R'OO•]"
    ],
    takeaway: "Complete 8-species ODE system solved using backward differentiation formulas."
  },
  {
    slideNumber: 13,
    title: "Predictive Optimization Algorithm",
    category: "Algorithm",
    bullets: [
      "Input expected lifespan (T1).",
      "Calculate accelerated equivalent time (T2) using AF.",
      "Calculate T_critical where unstabilized PVC reduces to 80% integrity.",
      "If T_critical > T2: Display 'No need to add stabilizer'.",
      "Else: Solve ODE with stabilizer to find optimal concentration; check if <= 5% wt."
    ],
    takeaway: "Logical decision tree that drives the interactive calculator application."
  },
  {
    slideNumber: 14,
    title: "Acceleration Factor Calculations",
    category: "Physics",
    bullets: [
      "AF = AF_T * AF_I",
      "AF_T = exp[(Ea/R) * (1/T_env - 1/T_lab)] with Ea = 230 kJ/mol.",
      "AF_I = I_lab / I_env = 0.76 / 1.33 = 0.57.",
      "Combined Acceleration Factor: AF ~ 700."
    ],
    takeaway: "Rigorously bridges laboratory accelerated hours to environmental outdoor service life."
  },
  {
    slideNumber: 15,
    title: "Validating Results: Kinetics Curves",
    category: "Validation",
    bullets: [
      "Concentration vs. Time without stabilizer shows rapid drop to < 0.5 within 10,000s.",
      "Concentration vs. Time with 0.5% wt. HALS retains over 0.85 at 6,000s and 0.65 at 10,000s.",
      "Visual proof that Tinuvin 770 successfully retards photodegradation rate."
    ],
    takeaway: "Computational ODE curves match laboratory weathering observations."
  },
  {
    slideNumber: 16,
    title: "Experimental Data Correlation",
    category: "Empirical Proof",
    bullets: [
      "Changes in PVC weight loss (%) over 100 days of irradiation.",
      "Blank PVC loses 5.2% mass.",
      "Organotin and HALS stabilized PVC limits weight loss to 3.2% - 3.4%."
    ],
    takeaway: "Empirical proof that stabilizer inhibits chain breakdown and volatile HCl release."
  },
  {
    slideNumber: 17,
    title: "Proposed Enhancements",
    category: "Innovation",
    bullets: [
      "Synergy Studies: Combining HALS with UV Absorbers and Hindered Phenols.",
      "Beer-Lambert depth modeling: I(x) = I_0 * exp(-alpha * x).",
      "Dynamic UV & Temperature dependence using the Anton-Prinet equation.",
      "Nanocomposites: TiO2 and ZnO UV-blocking nanoparticles."
    ],
    takeaway: "Roadmap for multi-layer co-extrusion and next-generation outdoor PVC formulations."
  },
  {
    slideNumber: 18,
    title: "Conclusion & Industrial Impact",
    category: "Conclusion",
    bullets: [
      "Kinetics model successfully developed and solved for both bare and stabilized PVC.",
      "Software enables precise formulation optimization, saving raw additive costs.",
      "Promotes sustainable plastics manufacturing and regulatory compliance (reducing HCl release)."
    ],
    takeaway: "Successfully demonstrated how computational material science solves industrial polymer degradation."
  },
  {
    slideNumber: 19,
    title: "Acknowledgements & Thank You",
    category: "Closing",
    bullets: [
      "University of Moratuwa - Department of Materials Science & Engineering",
      "Supervisors & Course Lecturers for MT2230 Kinetics of Materials",
      "Group 1 Project Members"
    ],
    takeaway: "Gratitude to academic mentors and collaborative teammates."
  },
  {
    slideNumber: 20,
    title: "Questions & Answers (Q&A)",
    category: "Discussion",
    bullets: [
      "Open for technical inquiries regarding the ODE solver, rate constants, and software architecture."
    ],
    takeaway: "Interactive defense of the kinetics methodologies."
  }
];
