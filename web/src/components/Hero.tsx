import React from 'react';
import { ArrowRight, Sliders, Zap, GraduationCap } from 'lucide-react';
import { ComfortableTypewriter } from './ComfortableTypewriter';
import { PROJECT_METADATA } from '../core/reportData';

interface HeroProps {
  onSelectTab: (tabId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectTab }) => {
  return (
    <section className="relative w-full py-16 sm:py-20 md:py-24 overflow-hidden flex flex-col items-center text-center px-4">
      {/* Google-Grade Ambient Morphing Mesh Orbs (from 1_My_WebSite) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[600px] md:w-[850px] h-[320px] md:h-[450px] bg-sky-400/20 rounded-full blur-[100px] -z-10 opacity-50 pointer-events-none animate-mesh-float" />
      <div className="absolute top-20 left-1/3 -translate-x-1/2 w-[400px] md:w-[600px] h-[260px] md:h-[360px] bg-emerald-400/15 rounded-full blur-[90px] -z-10 opacity-40 pointer-events-none animate-mesh-float-reverse" />

      <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto z-10">
        {/* Academic Module Credential Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-sky-200 bg-sky-50/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-sky-900 backdrop-blur-sm shadow-xs animate-fade-in-up">
          <GraduationCap className="w-4 h-4 text-sky-600" />
          <span>University of Moratuwa</span>
          <span className="text-sky-300">•</span>
          <span>Materials Science & Engineering</span>
          <span className="text-sky-300">•</span>
          <span className="badge badge-green text-[10px]">MT2230 Grade B+</span>
        </div>

        {/* Dynamic Typewriter Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] animate-fade-in-up delay-100 flex flex-col items-center justify-center gap-1 sm:gap-2">
          <span>PVC Photodegradation Kinetics</span>
          <span className="text-sky-600">
            <ComfortableTypewriter
              words={["Simulated", "Characterized", "Modeled", "Stabilized", "Optimized"]}
              className="text-sky-600"
              pauseDuration={2600}
            />
          </span>
        </h1>

        {/* Persona Credential Badge (matching 1_My_WebSite) */}
        <div className="flex justify-center animate-fade-in-up delay-200">
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 rounded-full border border-slate-200 bg-white/90 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium text-slate-800 backdrop-blur-sm shadow-sm hover:border-sky-300 transition-all">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-sky-600 to-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs ring-2 ring-sky-200">
              SP
            </div>
            <div className="flex items-center gap-2 flex-wrap text-center sm:text-left justify-center">
              <span className="font-bold text-slate-900">Sadun Premakumara</span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-sky-700 font-semibold">Lead Software Developer &amp; Kinetics Analyst</span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span className="text-slate-500 font-mono text-xs hidden sm:inline">Index: 210494D</span>
            </div>
          </div>
        </div>

        {/* Subtitle / Value Proposition */}
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          An interactive computational material science platform solving the 8-coupled stiff ordinary differential equations
          governing PVC solar weathering, contrasting bare chain dehydrochlorination against the regenerative Denisov Cycle
          of HALS Tinuvin 770.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 animate-fade-in-up delay-300">
          <button
            onClick={() => onSelectTab('simulator')}
            className="btn btn-primary h-11 px-6 shadow-md hover-lift"
          >
            <Sliders className="w-4 h-4" />
            <span>Launch Formulation Optimizer</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => onSelectTab('mechanisms')}
            className="btn btn-secondary h-11 px-5 hover-lift"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Explore Chemical Mechanisms</span>
          </button>

          <button
            onClick={() => onSelectTab('report')}
            className="btn btn-secondary h-11 px-5 hover-lift"
          >
            <span>Read 36-Page Thesis</span>
          </button>
        </div>

        {/* Metric Highlights in Spectrum Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto">
          <div className="card spectrum-card hover-lift p-4 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Global PVC Market
            </p>
            <p className="text-xl sm:text-2xl font-black text-sky-700 mt-0.5">
              {PROJECT_METADATA.marketSize2023}
            </p>
            <p className="text-[11px] text-slate-400">→ $110B by 2030 (2.95%)</p>
          </div>

          <div className="card spectrum-card hover-lift p-4 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Acceleration Factor
            </p>
            <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">~700×</p>
            <p className="text-[11px] text-slate-400">ASTM G154 to Outdoor</p>
          </div>

          <div className="card spectrum-card hover-lift p-4 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Activation Energy
            </p>
            <p className="text-xl sm:text-2xl font-black text-purple-700 mt-0.5">
              {PROJECT_METADATA.activationEnergy}
            </p>
            <p className="text-[11px] text-slate-400">Arrhenius Rate Law</p>
          </div>

          <div className="card spectrum-card hover-lift p-4 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Stiff ODE System
            </p>
            <p className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">8 Equations</p>
            <p className="text-[11px] text-slate-400">Catalytic Denisov Cycle</p>
          </div>
        </div>
      </div>
    </section>
  );
};
