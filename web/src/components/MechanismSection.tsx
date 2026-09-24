import React, { useState } from 'react';
import { Layers, Zap, RefreshCw, AlertOctagon, CheckCircle2 } from 'lucide-react';

export const MechanismSection: React.FC = () => {
  const [activeView, setActiveView] = useState<'unstabilized' | 'stabilized' | 'rate-constants'>('unstabilized');

  const rateConstantDetails = [
    {
      symbol: 'k₁',
      val: '51.0',
      units: 'M⁻¹ s⁻¹',
      ref: '[9] Yousif & Haddad (2013)',
      reaction: ">NH + R'OO• → >N-OH + aliphatic ketone",
      role: 'Initial peroxy radical scavenging by parent HALS amine'
    },
    {
      symbol: 'k₂',
      val: '5.5 × 10²',
      units: 'M⁻¹ s⁻¹',
      ref: '[9] Yousif & Haddad (2013)',
      reaction: ">N-OH + R'OO• → >NO• + hydroperoxide",
      role: 'Oxidation of hydroxylamine to stable catalytic nitroxyl radical'
    },
    {
      symbol: 'k₃',
      val: '1.2 × 10⁹',
      units: 'M⁻¹ s⁻¹',
      ref: '[9] Yousif & Haddad (2013)',
      reaction: ">NO• + R'• → >N-O-R' (alkoxyamine)",
      role: 'Diffusion-controlled trapping of polymer alkyl radicals (ultra-fast)'
    },
    {
      symbol: 'k₄',
      val: '1.9 × 10⁻³',
      units: 'M⁻¹ s⁻¹',
      ref: '[9] Yousif & Haddad (2013)',
      reaction: ">N-O-R' + R'OO• → >NO• + inert products",
      role: 'Peroxy radical attack on alkoxyamine regenerating >NO•'
    },
    {
      symbol: 'k₅',
      val: '9.3 × 10⁻⁵',
      units: 's⁻¹',
      ref: '[24] Prinet et al. (1997)',
      reaction: '>N-O-R\' → >NH + alkene (olefin)',
      role: 'Regeneration of parent secondary amine (>NH), closing the cycle'
    },
    {
      symbol: 'k₆',
      val: '1.0 × 10⁻⁶',
      units: 's⁻¹',
      ref: '[24] Prinet et al. (1997)',
      reaction: 'PVC + hν → R\'• + Cl•',
      role: 'Primary photolytic initiation via C-Cl bond homolysis under UV-B'
    },
    {
      symbol: 'k₇',
      val: '1.0 × 10⁸',
      units: 'M⁻¹ s⁻¹',
      ref: '[24] Prinet et al. (1997)',
      reaction: "R'• + O₂ → R'OO•",
      role: 'Instantaneous oxygen trapping yielding degradative peroxy radicals'
    },
    {
      symbol: 'k₈',
      val: '0.5',
      units: 'M⁻¹ s⁻¹',
      ref: '[24] Prinet et al. (1997)',
      reaction: "R'OO• + PVC → R'• + hydroperoxide",
      role: 'Hydrogen abstraction from backbone, sustaining chain degradation'
    },
    {
      symbol: 'k₉',
      val: '0.1',
      units: 'M⁻¹ s⁻¹',
      ref: '[24] Prinet et al. (1997)',
      reaction: "Cl• + PVC → R'• + HCl ↑",
      role: 'Autocatalytic zip-dehydrochlorination releasing corrosive HCl gas'
    }
  ];

  return (
    <section id="mechanisms" className="py-12 bg-white border-b border-slate-200">
      <div className="container space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Chemical Kinetics & Reaction Pathways</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mechanisms of PVC Photodegradation vs. HALS Stabilization
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Detailed chemical walkthrough from the University Project Report contrasting
            uninhibited radical zip-elimination with the catalytic regenerative Denisov Cycle.
          </p>

          {/* Sub-navigation tabs */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 mt-2">
            <button
              onClick={() => setActiveView('unstabilized')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeView === 'unstabilized'
                  ? 'bg-white text-red-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Without Stabilizer (Bare PVC)
            </button>
            <button
              onClick={() => setActiveView('stabilized')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeView === 'stabilized'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              With HALS (Denisov Cycle)
            </button>
            <button
              onClick={() => setActiveView('rate-constants')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeView === 'rate-constants'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Table 1: Rate Constants (k₁ - k₉)
            </button>
          </div>
        </div>

        {/* View 1: Unstabilized Degradation Mechanism */}
        {activeView === 'unstabilized' && (
          <div className="space-y-6 animate-fade-in">
            {/* Visual Pathway Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card border-l-4 border-l-red-500 space-y-2">
                <span className="badge badge-red text-[10px]">Step 1: Initiation</span>
                <h4 className="font-bold text-slate-900 text-sm">C-Cl Bond Cleavage</h4>
                <div className="math-block text-xs">PVC + hν → R'• + Cl•</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Solar UV-B radiation (280–320 nm) excites labile C-Cl bonds in PVC. Homolytic cleavage
                  ejects a free chlorine radical (Cl•) and creates a reactive alkyl polyene radical (R'•).
                </p>
              </div>

              <div className="card border-l-4 border-l-amber-500 space-y-2">
                <span className="badge badge-amber text-[10px]">Step 2: Oxidation</span>
                <h4 className="font-bold text-slate-900 text-sm">Peroxy Radical Formation</h4>
                <div className="math-block text-xs">R'• + O₂ → R'OO•</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dissolved oxygen reacts almost instantaneously (k₇ = 1.0×10⁸ M⁻¹s⁻¹) with the carbon
                  radical to form high-energy peroxy radicals (R'OO•), initiating the oxidative cascade.
                </p>
              </div>

              <div className="card border-l-4 border-l-purple-500 space-y-2">
                <span className="badge badge-purple text-[10px]">Step 3: Propagation</span>
                <h4 className="font-bold text-slate-900 text-sm">Zip-Dehydrochlorination</h4>
                <div className="math-block text-xs">Cl• + PVC → R'• + HCl ↑</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Free chlorine radicals abstract adjacent hydrogens in an autocatalytic 'zipper' reaction,
                  releasing corrosive hydrochloric acid gas (HCl) and creating polyenes (-CH=CH-)n.
                </p>
              </div>

              <div className="card border-l-4 border-l-slate-700 space-y-2">
                <span className="badge badge-red text-[10px]">Step 4: Macro Failure</span>
                <h4 className="font-bold text-slate-900 text-sm">Discoloration & Cracking</h4>
                <div className="math-block text-xs">n ≥ 7: Chromophores</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Conjugated polyene chains absorb blue light, shifting color from white to yellow, brown,
                  and black. Surface micro-cracks coalesce, destroying tensile strength.
                </p>
              </div>
            </div>

            {/* Differential Equations for Unstabilized System */}
            <div className="card space-y-4 bg-slate-50/60">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <AlertOctagon className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Coupled Differential Equations (Without Stabilizer)
                </h3>
                <span className="text-xs text-slate-500 ml-auto">Report Page 21</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                  <p className="text-xs font-bold text-slate-700">1. Polymer Matrix Loss Rate:</p>
                  <div className="math-block text-xs">
                    d[PVC]/dt = -k₆[PVC] - k₈[PVC][R'OO•] - k₉[Cl•][PVC]
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Depleted by photolysis (k₆), peroxy radical abstraction (k₈), and autocatalytic attack
                    by chlorine radicals (k₉).
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                  <p className="text-xs font-bold text-slate-700">2. Chlorine Radical Dynamics:</p>
                  <div className="math-block text-xs">
                    d[Cl•]/dt = k₆[PVC] + k₈[PVC][R'OO•] - k₁₀[Cl•]²
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Propagates continuous dehydrochlorination until bimolecular radical recombination.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                  <p className="text-xs font-bold text-slate-700">3. Polymer Alkyl Radicals:</p>
                  <div className="math-block text-xs">d[R'•]/dt = k₆[PVC] - k₇[R'•]</div>
                  <p className="text-[11px] text-slate-500">
                    Trapped immediately by ambient oxygen to yield peroxy radicals.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                  <p className="text-xs font-bold text-slate-700">4. Peroxy Radicals:</p>
                  <div className="math-block text-xs">
                    d[R'OO•]/dt = k₇[R'•] - k₈[R'OO•][PVC]
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Without HALS, peroxy radicals abstract hydrogen without hindrance.
                  </p>
                </div>
              </div>
            </div>

            {/* Authentic Report Diagram: Figure 11 */}
            <div className="card p-4 space-y-3 bg-white border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Thesis Figure 11: Overall Photodegradation Mechanism with Rate Constants
                </h4>
                <span className="badge badge-red text-[10px]">Report Page 20</span>
              </div>
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="w-full lg:w-3/5 bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-center">
                  <img
                    src="/images/fig_bare_mechanism.png"
                    alt="Overall Photodegradation Mechanism with Rate Constants"
                    className="max-h-72 object-contain"
                  />
                </div>
                <div className="w-full lg:w-2/5 space-y-2 text-xs text-slate-600 leading-relaxed">
                  <p>
                    <strong>Chain Initiation &amp; Dehydrochlorination:</strong> UV photons excite the polymer chain, breaking C-Cl bonds and initiating alkyl radical (R'•) propagation.
                  </p>
                  <p>
                    <strong>Corrosive HCl Evolution:</strong> Free chlorine radicals abstract hydrogens, triggering the rapid zipper reaction that evolves HCl gas and creates colored polyenes.
                  </p>
                  <div className="p-2.5 rounded-lg bg-red-50 text-red-900 border border-red-200">
                    <strong>Critical Vulnerability:</strong> Without chemical intervention, uninhibited radical cascades lead to catastrophic surface yellowing and micro-cracking.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 2: HALS Stabilization (Denisov Cycle) */}
        {activeView === 'stabilized' && (
          <div className="space-y-6 animate-fade-in">
            {/* Interactive Denisov Cycle Interactive Diagram */}
            <div className="card space-y-5 bg-gradient-to-br from-emerald-50/40 via-white to-sky-50/40 border-emerald-200">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      The Regenerative Denisov Cycle (Tinuvin 770)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Catalytic interception and regeneration mechanism discovered by E.T. Denisov (1970)
                    </p>
                  </div>
                </div>
                <span className="badge badge-green text-xs">Self-Regenerating</span>
              </div>

              {/* Cycle Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 text-center shadow-xs">
                  <span className="badge badge-green text-[10px]">1. Radical Trapping</span>
                  <p className="font-mono font-bold text-emerald-700 text-xs mt-1">&gt;NH + R'OO•</p>
                  <p className="text-[10px] text-slate-500">k₁ = 51 M⁻¹s⁻¹</p>
                  <p className="text-[11px] text-slate-600 pt-1 leading-tight">
                    Secondary amine forms intermediate hydroxylamine (&gt;N-OH).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 text-center shadow-xs">
                  <span className="badge badge-purple text-[10px]">2. Nitroxyl Formation</span>
                  <p className="font-mono font-bold text-purple-700 text-xs mt-1">&gt;N-OH + R'OO•</p>
                  <p className="text-[10px] text-slate-500">k₂ = 550 M⁻¹s⁻¹</p>
                  <p className="text-[11px] text-slate-600 pt-1 leading-tight">
                    Hydroxylamine oxidizes into catalytic nitroxyl radical (&gt;NO•).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-sky-300 space-y-1 text-center shadow-sm ring-1 ring-sky-200">
                  <span className="badge badge-blue text-[10px]">3. Fast Alkyl Scavenge</span>
                  <p className="font-mono font-bold text-sky-700 text-xs mt-1">&gt;NO• + R'•</p>
                  <p className="text-[10px] text-sky-600 font-semibold">k₃ = 1.2 × 10⁹ M⁻¹s⁻¹</p>
                  <p className="text-[11px] text-slate-600 pt-1 leading-tight">
                    Diffusion-rate recombination forms alkoxyamine (&gt;N-O-R').
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 text-center shadow-xs">
                  <span className="badge badge-amber text-[10px]">4. Re-Oxidation</span>
                  <p className="font-mono font-bold text-amber-700 text-xs mt-1">&gt;N-O-R' + R'OO•</p>
                  <p className="text-[10px] text-slate-500">k₄ = 1.9 × 10⁻³ M⁻¹s⁻¹</p>
                  <p className="text-[11px] text-slate-600 pt-1 leading-tight">
                    Re-generates nitroxyl radical (&gt;NO•) to continue cycle.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-300 space-y-1 text-center shadow-sm ring-1 ring-emerald-200">
                  <span className="badge badge-green text-[10px]">5. Amine Regeneration</span>
                  <p className="font-mono font-bold text-emerald-700 text-xs mt-1">&gt;N-O-R' → &gt;NH</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">k₅ = 9.3 × 10⁻⁵ s⁻¹</p>
                  <p className="text-[11px] text-slate-600 pt-1 leading-tight">
                    Cleaves olefin and regenerates parent amine (&gt;NH).
                  </p>
                </div>
              </div>

              {/* Denisov Insight Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-200 text-xs leading-relaxed flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Why HALS is so efficient in PVC: </strong>
                  Unlike sacrificial UV absorbers that degrade 1-for-1 upon absorbing a photon,
                  a single molecule of Tinuvin 770 cycles repeatedly through &gt;NO• and &gt;NH. It can
                  scavenge over <strong>50 to 100 free radicals</strong> before irreversible termination,
                  explaining why low dosages (0.1–0.5 wt.%) provide multi-year outdoor durability.
                </div>
              </div>
            </div>

            {/* Differential Equations with Stabilizer */}
            <div className="card space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Layers className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Coupled Differential Equations With HALS (8 Stiff ODEs)
                </h3>
                <span className="text-xs text-slate-500 ml-auto">Report Page 22</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <p className="text-xs font-bold text-slate-700">Hydroxylamine [R-N-OH]:</p>
                  <div className="math-block text-xs">
                    d[R-N-OH]/dt = k₁[R'OO•][R-N-H] + k₅[R-N(O-R')] - k₂[R-N-OH][R'OO•]
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <p className="text-xs font-bold text-slate-700">Alkoxyamine [R-N(O-R')]:</p>
                  <div className="math-block text-xs">
                    d[R-N(O-R')]/dt = k₃[R-NO•][R'•] - k₅[R-N(O-R')] - k₄[R-N(O-R')][R'OO•]
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <p className="text-xs font-bold text-slate-700">Nitroxyl Radical [R-NO•]:</p>
                  <div className="math-block text-xs">
                    d[R-NO•]/dt = k₄[R-N(O-R')][R'OO•] + k₂[R'OO•][R-N-OH] - k₃[R'•][R-NO•]
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <p className="text-xs font-bold text-slate-700">Peroxy Radicals [R'OO•]:</p>
                  <div className="math-block text-xs">
                    d[R'OO•]/dt = k₇[R'•] - k₈[R'OO•][PVC] - k₁[R'OO•][R-N-H] - k₂[R'OO•][R-N-OH] - k₄[R-N(O-R')][R'OO•]
                  </div>
                </div>
              </div>
            </div>

            {/* Authentic Report Diagram: Figure 12 */}
            <div className="card p-4 space-y-3 bg-white border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Thesis Figure 12: Reaction and Regeneration Mechanism of HALS with Rate Constants
                </h4>
                <span className="badge badge-green text-[10px]">Report Page 21</span>
              </div>
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="w-full lg:w-3/5 bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-center">
                  <img
                    src="/images/fig_hals_denisov.png"
                    alt="Reaction and Regeneration Mechanism of HALS with Rate Constants"
                    className="max-h-72 object-contain"
                  />
                </div>
                <div className="w-full lg:w-2/5 space-y-2 text-xs text-slate-600 leading-relaxed">
                  <p>
                    <strong>Radical Scavenging:</strong> HALS Tinuvin 770 secondary amine (&gt;NH) interrupts peroxy radicals (R'OO•) forming hydroxylamines (&gt;N-OH).
                  </p>
                  <p>
                    <strong>Regenerative Cycle:</strong> Oxidation yields nitroxyl radicals (&gt;NO•), which trap polymer alkyl radicals (R'•) at near diffusion limits (k₃ = 1.2×10⁹ M⁻¹s⁻¹).
                  </p>
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
                    <strong>Catalytic Efficiency:</strong> One HALS molecule intercepts up to 100 free radicals through cyclic regeneration, ensuring multi-year stability.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 3: Table 1 Rate Constants */}
        {activeView === 'rate-constants' && (
          <div className="card p-0 overflow-hidden animate-fade-in">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">
                Table 1: Reaction Rate Constants of the Mechanism
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Experimentally determined and literature-validated under ASTM G154 accelerated weathering
                conditions (50°C, 0.76 W/m² UV flux).
              </p>
            </div>

            <div className="table-container border-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Constant</th>
                    <th>Value</th>
                    <th>Units</th>
                    <th>Reaction Formula</th>
                    <th>Chemical Role</th>
                    <th>Citation</th>
                  </tr>
                </thead>
                <tbody>
                  {rateConstantDetails.map((k) => (
                    <tr key={k.symbol}>
                      <td className="font-mono font-bold text-sky-700">{k.symbol}</td>
                      <td className="font-mono font-semibold text-slate-900">{k.val}</td>
                      <td className="font-mono text-xs text-slate-500">{k.units}</td>
                      <td className="font-mono text-xs text-slate-800">{k.reaction}</td>
                      <td className="text-xs text-slate-600">{k.role}</td>
                      <td className="text-xs text-slate-400 italic">{k.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
