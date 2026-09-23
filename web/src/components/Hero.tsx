import React from 'react';
import { ArrowRight, Download, Sliders, Zap } from 'lucide-react';
import { PROJECT_METADATA } from '../core/reportData';

interface HeroProps {
  onStartSimulation: () => void;
  onExploreMechanisms: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartSimulation, onExploreMechanisms }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50 border-b border-slate-200 py-12 md:py-16">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-200/25 blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Institution & Module Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
            <span className="badge badge-blue text-xs">University of Moratuwa</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-700">MT2230 - Kinetics of Materials</span>
            <span className="text-slate-400">•</span>
            <span className="badge badge-green text-xs font-bold">Grade B+</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Optimizing UV Stabilization in PVC using{' '}
            <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              HALS (Tinuvin 770)
            </span>
          </h1>

          {/* Subtitle / Executive Summary */}
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A comprehensive computational kinetics model and formulation optimizer designed to predict
            Polyvinyl Chloride (PVC) degradation under intense solar UV radiation and evaluate the
            regenerative radical scavenging performance of the Hindered Amine Light Stabilizer (HALS) Denisov Cycle.
          </p>

          {/* Lead Author Attribution Card */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/90 border border-slate-200 shadow-xs text-left">
            <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
              SP
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Premakumara H.P.S. <span className="text-slate-500 font-normal">(Index: 210494D)</span>
              </p>
              <p className="text-[11px] text-sky-700 font-medium">
                Lead Python Software Developer & Kinetics Analyst • Group 1
              </p>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button onClick={onStartSimulation} className="btn btn-primary shadow-md">
              <Sliders className="w-4 h-4" />
              <span>Launch Degradation Simulator</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button onClick={onExploreMechanisms} className="btn btn-secondary">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Compare Mechanisms (Bare vs. HALS)</span>
            </button>

            <a href="#downloads" className="btn btn-secondary">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Download Desktop Suite & Thesis</span>
            </a>
          </div>

          {/* Key Quantitative Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto">
            <div className="card text-center p-3">
              <p className="text-xs font-medium text-slate-500">Global PVC Market</p>
              <p className="text-lg sm:text-xl font-bold text-sky-700">
                {PROJECT_METADATA.marketSize2023}
              </p>
              <p className="text-[11px] text-slate-400">→ $110B by 2030 (2.95%)</p>
            </div>

            <div className="card text-center p-3">
              <p className="text-xs font-medium text-slate-500">Acceleration Factor</p>
              <p className="text-lg sm:text-xl font-bold text-emerald-700">~700×</p>
              <p className="text-[11px] text-slate-400">ASTM G154 to Outdoor</p>
            </div>

            <div className="card text-center p-3">
              <p className="text-xs font-medium text-slate-500">Activation Energy</p>
              <p className="text-lg sm:text-xl font-bold text-purple-700">
                {PROJECT_METADATA.activationEnergy}
              </p>
              <p className="text-[11px] text-slate-400">Arrhenius Temperature k</p>
            </div>

            <div className="card text-center p-3">
              <p className="text-xs font-medium text-slate-500">Kinetics Framework</p>
              <p className="text-lg sm:text-xl font-bold text-slate-800">8 Coupled ODEs</p>
              <p className="text-[11px] text-slate-400">Catalytic Denisov Cycle</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
